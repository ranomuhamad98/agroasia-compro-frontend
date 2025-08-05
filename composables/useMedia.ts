import type { MediaItem, MediaUploadRequest, MediaUploadResponse, MediaListResponse, MediaQueryParams } from '@/types/media-api-type';

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
      console.log('📁 Fetching media items...');

      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const url = `/api/media/get${queryString ? '?' + queryString : ''}`;

      const response = await $fetch<MediaListResponse>(url, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.success && response.data) {
        mediaItems.value = response.data;
        console.log('✅ Media items fetched successfully:', response.data.length, 'items');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch media items');
      }
    } catch (err: any) {
      console.error('❌ Error fetching media items:', err);
      error.value = err.message || 'An error occurred while fetching media items';
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
      console.log('📤 Uploading media file:', { 
        name: file.name, 
        size: file.size, 
        type: file.type,
        alt 
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('images', file);
      formData.append('alt', alt);

      const response = await $fetch<MediaUploadResponse>('/api/media/post', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.success && response.data) {
        console.log('✅ Media uploaded successfully:', response.data);
        
        // Add the new media item to the list
        mediaItems.value.unshift(response.data);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to upload media');
      }
    } catch (err: any) {
      console.error('❌ Error uploading media:', err);
      error.value = err.message || 'An error occurred while uploading media';
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
      console.log('📤 Uploading multiple media files:', files.length, 'files');

      const uploadPromises = files.map(({ file, alt }) => uploadMediaSingle(file, alt));
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      
      console.log(`✅ Upload completed: ${successful.length} successful, ${failed.length} failed`);
      
      if (failed.length > 0) {
        console.warn('⚠️ Some uploads failed:', failed);
      }
      
      return {
        successful: successful.length,
        failed: failed.length,
        results
      };
    } catch (err: any) {
      console.error('❌ Error uploading multiple media:', err);
      error.value = err.message || 'An error occurred while uploading media files';
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

    if (response.success && response.data) {
      return response.data;
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