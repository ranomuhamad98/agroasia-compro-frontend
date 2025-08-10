import type { MediaItem, MediaUploadRequest, MediaUploadResponse, MediaListResponse, MediaQueryParams } from '@/types/media-api-type';
import { toast } from 'vue3-toastify';

export function useMedia() {
  const mediaItems = ref<MediaItem[]>([]);
  const isLoading = ref(false);
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Get all media items
   */
  const getMediaItems = async (params?: MediaQueryParams) => {
    try {
      isLoading.value = true;
      error.value = null;

      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const url = `/api/media/get${queryString ? '?' + queryString : ''}`;

      const response = await $fetch<MediaListResponse>(url, {
        method: 'GET',
        credentials: 'include'
      });

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

  /**
   * Upload a media file
   */
  const uploadMedia = async (file: File, alt: string) => {
    try {
      isUploading.value = true;
      error.value = null;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('images', file);
      formData.append('alt', alt);

      const response = await $fetch<MediaUploadResponse>('/api/media/post', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.success && response.data.media) {
        // Add the new media item to the list
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

  /**
   * Upload multiple media files
   */
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

    const response = await $fetch<MediaUploadResponse>('/api/media/post', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (response.success && response.data.media) {
      return response.data.media;
    } else {
      throw new Error(response.message || 'Failed to upload media');
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Refresh media list
   */
  const refreshMedia = async (params?: MediaQueryParams) => {
    return await getMediaItems(params);
  };

  return {
    // State
    mediaItems: readonly(mediaItems),
    isLoading: readonly(isLoading),
    isUploading: readonly(isUploading),
    error: readonly(error),
    
    // Actions
    getMediaItems,
    uploadMedia,
    uploadMultipleMedia,
    clearError,
    refreshMedia
  };
}