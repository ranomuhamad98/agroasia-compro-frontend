import type { MediaItem, MediaUploadRequest, MediaUploadResponse, MediaListResponse, MediaQueryParams } from '@/types/media-api-type';
import { toast } from 'vue3-toastify';

export function useMedia() {
  const apiClient = useProxyApiClient();
  const mediaItems = ref<MediaItem[]>([]);
  const isLoading = ref(false);
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  const getMediaItems = async (params?: MediaQueryParams) => {
    try {
      isLoading.value = true;
      error.value = null;

      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const url = `/media/get${queryString ? '?' + queryString : ''}`;

      const response = await apiClient.get<MediaListResponse>(url);

      if (response.success && response.data) {
        mediaItems.value = response.data;
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch media items');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching media items';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadMedia = async (file: File, alt: string) => {
    try {
      isUploading.value = true;
      error.value = null;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('images', file);
      formData.append('alt', alt);

      const response = await apiClient.post<MediaUploadResponse>('/media/post', {
        body: formData,
      });

      if (response.success && response.data.media) {
        mediaItems.value.unshift(...response.data.media);
        
        return response.data.media;
      } else {
        throw new Error(response.message || 'Failed to upload media');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while uploading media';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isUploading.value = false;
    }
  };

  const uploadMultipleMedia = async (files: { file: File; alt: string }[]) => {
    try {
      isUploading.value = true;
      error.value = null;

      const uploadPromises = files.map(({ file, alt }) => uploadMediaSingle(file, alt));
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      
      if (failed.length > 0) {
        const errorMessage = `${failed.length} out of ${files.length} files failed to upload`;
        toast.warning(errorMessage);
      }
      
      return {
        successful: successful.length,
        failed: failed.length,
        results
      };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while uploading media files';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Helper function for single file upload (used in multiple upload)
   */
  const uploadMediaSingle = async (file: File, alt: string) => {
    const formData = new FormData();
    formData.append('images', file);
    formData.append('alt', alt);

    const response = await apiClient.post<MediaUploadResponse>('/media/post', {
      body: formData,
    });

    if (response.success && response.data.media) {
      return response.data.media;
    } else {
      throw new Error(response.message || 'Failed to upload media');
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const refreshMedia = async (params?: MediaQueryParams) => {
    return await getMediaItems(params);
  };

  return {
    mediaItems: readonly(mediaItems),
    isLoading: readonly(isLoading),
    isUploading: readonly(isUploading),
    error: readonly(error),
    
    getMediaItems,
    uploadMedia,
    uploadMultipleMedia,
    clearError,
    refreshMedia
  };
}