// src/components/forms/SecureFileUpload.tsx

import React, { useState, useCallback } from 'react';
import { useCSRFToken } from '@/lib/hooks/useCSRFToken';
import { logger } from '@/lib/logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

interface FileUploadProps {
  onUploadComplete?: (results: unknown[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export default function SecureFileUpload({
  onUploadComplete,
  onError,
  maxFiles = 5,
  acceptedFileTypes = Array.from(ALLOWED_TYPES),
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const csrfToken = useCSRFToken();

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} exceeds maximum size of 5MB`);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    return true;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      selectedFiles.forEach(validateFile);
      setFiles(selectedFiles);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Invalid file');
      // Reset file input
      event.target.value = '';
    }
  }, [maxFiles, onError, validateFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (droppedFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      droppedFiles.forEach(validateFile);
      setFiles(droppedFiles);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Invalid file');
    }
  }, [maxFiles, onError, validateFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleUpload = async () => {
    if (!files.length || !csrfToken) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      };

      // Handle response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete?.(response.results);
          setFiles([]);
        } else {
          throw new Error(xhr.statusText || 'Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error occurred');
      };

      // Send the request
      xhr.send(formData);
    } catch (error) {
      logger.error('File upload error:', { error });
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="p-4 border-2 border-dashed rounded-lg bg-white"
      >
        <input
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="file-upload"
          aria-label="File upload"
        />
        
        <label 
          htmlFor="file-upload"
          className="block w-full text-center cursor-pointer"
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Uploading...</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">
                Drop files here or click to upload
              </div>
              <div className="text-xs text-gray-400">
                Maximum {maxFiles} files. Supported formats: {acceptedFileTypes.join(', ')}
              </div>
            </div>
          )}
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm truncate flex-1">{file.name}</span>
              <span className="text-xs text-gray-500 mx-4">
                {(file.size / 1024).toFixed(1)}KB
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Remove ${file.name}`}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          ))}
          
          <button
            onClick={handleUpload}
            disabled={uploading || !csrfToken}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}
    </div>
  );
}