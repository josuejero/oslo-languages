// src/types/media.ts

export interface MediaFile {
  id: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface MediaUploadResponse {
  success: boolean;
  file?: MediaFile;
  error?: string;
}