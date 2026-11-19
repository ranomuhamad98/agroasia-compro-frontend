import { toast } from 'vue3-toastify';
import type { GalleryApiResponse, GalleryItem } from '../types/about-api-type'

export function useGalleryApi() {
  const apiClient = useApiClient();
  
  // Reactive state for loading and error handling
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Use useAsyncData to automatically fetch on mount
  const { data: galleryData, refresh, pending } = useAsyncData<GalleryApiResponse>(
    'gallery-api-data',
    async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        const response = await apiClient.get<GalleryApiResponse>('/about-us/gallery');
        
        // Validate response structure
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }

        if (response.status !== 200) {
          throw new Error(response.message || 'API request failed');
        }

        return response;
      } catch (err: any) {
        const errorMessage = err.statusMessage || err.message || 'Failed to fetch gallery data';
        error.value = errorMessage;
        toast.error(errorMessage);
        throw err;
      } finally {
        isLoading.value = false;
      }
    },
    {
      default: () => null,
      server: true,
    }
  );

  // Computed properties for easy access to specific data
  const gallery = computed(() => galleryData.value?.gallery || []);
  const message = computed(() => galleryData.value?.message);

  // Method to manually refresh data
  const refreshGalleryData = async () => {
    await refresh();
  };

  const hasData = computed(() => !!galleryData.value && galleryData.value.status === 200);

  return {
    // Raw data
    galleryData: readonly(galleryData),
    
    // Computed sections
    gallery: readonly(gallery),
    message: readonly(message),
    
    // State management
    isLoading: readonly(isLoading),
    pending: readonly(pending),
    error: readonly(error),
    hasData: readonly(hasData),
    
    // Methods
    refreshGalleryData,
  };
} 