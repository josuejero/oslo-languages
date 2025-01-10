// src/app/admin/media/page.tsx

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MediaFile } from '@/types/media';

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFiles(prevFiles => [...prevFiles, ...data.files]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Media Library</h1>
          
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary cursor-pointer"
            >
              Upload Files
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {isUploading && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md mb-4">
            Uploading files...
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map(file => (
            <div
              key={file.id}
              className={`relative group bg-bg-tertiary rounded-lg overflow-hidden cursor-pointer ${
                selectedFile?.id === file.id ? 'ring-2 ring-accent-primary' : ''
              }`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="relative aspect-square">
                <Image
                  src={file.path}
                  alt={file.filename}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-bg-tertiary p-6 rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  File Details
                </h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <svg
                    className="w-6 h-6"
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedFile.path}
                    alt={selectedFile.filename}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Filename
                    </label>
                    <p className="text-text-primary">{selectedFile.filename}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Size
                    </label>
                    <p className="text-text-primary">
                      {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Dimensions
                    </label>
                    <p className="text-text-primary">
                      {selectedFile.width} x {selectedFile.height}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Upload Date
                    </label>
                    <p className="text-text-primary">
                      {new Date(selectedFile.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      File URL
                    </label>
                    <input
                      type="text"
                      value={selectedFile.path}
                      readOnly
                      className="w-full px-3 py-2 bg-bg-secondary text-text-primary rounded-md"
                      onClick={(e) => e.currentTarget.select()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}