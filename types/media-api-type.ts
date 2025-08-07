export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  alt: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
  image_original: string;
}

export interface MediaUploadRequest {
  images: File;
  alt: string;
}

interface MediaUploadResponseData {
  success: boolean;
  media: MediaItem[];
  message: string;
}

export interface MediaUploadResponse {
  success: boolean;
  data: MediaUploadResponseData;
  message: string;
}

export interface MediaListResponse {
  success: boolean;
  data: MediaItem[];
  message: string;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mime_type?: string;
}