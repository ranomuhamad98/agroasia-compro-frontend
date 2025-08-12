import { toast } from 'vue3-toastify';
import type { GalleryPayload } from '@/types/about-api-type';

// Gallery data interface based on the API response
export interface GalleryData {
  id: string;
  image_link: string;
  alt: string;
  input_time: string;
  update_time: string;
}

export interface CreateGalleryReturn {
  status: number;
  message: string;
  data: GalleryData;
}

export function useGalleryManagement() {
  const apiClient = useProxyApiClient();
  
  // Reactive state for loading and error handling
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Gallery list state
  const galleryList = ref<GalleryData[]>([]);
  const selectedGallery = ref<GalleryData | null>(null);

  // Create new gallery entry
  const createGallery = async (payload: GalleryPayload): Promise<CreateGalleryReturn> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await apiClient.post<CreateGalleryReturn>('/about/gallery', {
        body: payload,
      });
      
      // Add to local list if successful
      if (response.data) {
        galleryList.value.push(response.data);
      }
      
      toast.success('Image berhasil ditambahkan');
      return response;
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal menambahkan gallery';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete gallery item
  const deleteGallery = async (id: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await apiClient.delete<{ success: boolean; data: any; message: string }>(`/about/gallery/${id}`);
      
      // Remove from local list
      galleryList.value = galleryList.value.filter(item => item.id !== id);
      
      // Clear selected gallery if it's the same
      if (selectedGallery.value?.id === id) {
        selectedGallery.value = null;
      }
      
      toast.success('Image berhasil dihapus');
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal menghapus gallery';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Reset state
  const resetState = () => {
    galleryList.value = [];
    selectedGallery.value = null;
    error.value = null;
    isLoading.value = false;
  };

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // CRUD Operations
    createGallery,
    deleteGallery,
    
    // State Management
    clearError,
    resetState,
  };
}
