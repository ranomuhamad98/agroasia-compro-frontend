import { toast } from 'vue3-toastify';

interface SliderData {
  image_link: string;
  sub_title: string;
  title: string;
  button_title?: string;
  button_link?: string;
  position?: number;
}

export interface Slider {
  id: string;
  image_link: string;
  sub_title: string;
  title: string;
  button_title: string;
  button_link: string;
  position: number;
  input_time: string;
  update_time: string;
}

interface SliderResponse {
  success: boolean;
  data: {
    sliders?: Slider[];
    slider?: Slider;
  };
  message: string;
}

export function useSlider() {
  const apiClient = useProxyApiClient();
  const sliders = ref<Slider[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getSliders = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.get<SliderResponse>('/slider/get');

      if (response.success && response.data.sliders) {
        sliders.value = response.data.sliders;
        return response.data.sliders;
      }

      throw new Error(response.message || 'Failed to fetch sliders');

    } catch (error: any) {
      const errorMessage = error.data?.message || error.message || 'Failed to fetch sliders';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createSlider = async (sliderData: SliderData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.post<SliderResponse>('/slider/post', {
        body: sliderData,
      });

      if (response.success) {
        await getSliders();
        toast.success('Slider created successfully!');
        return response.data;
      }

      throw new Error(response.message || 'Failed to create slider');

    } catch (error: any) {
      let errorMessage = error.data?.message || error.message || 'Failed to create slider';
      
      if (error.statusCode === 401) {
        errorMessage = 'Authentication required to create slider';
      } else if (error.statusCode === 422) {
        errorMessage = 'Please check your slider data';
      }
      
      error.value = errorMessage;
      toast.error(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSlider = async (id: string, sliderData: SliderData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.put<SliderResponse>(`/slider/${id}`, {
        body: sliderData,
      });

      if (response.success) {
        await getSliders();
        toast.success('Slider updated successfully!');
        return response.data;
      }

      throw new Error(response.message || 'Failed to update slider');

    } catch (error: any) {
      let errorMessage = error.data?.message || error.message || 'Failed to update slider';
      
      if (error.statusCode === 401) {
        errorMessage = 'Authentication required to update slider';
      } else if (error.statusCode === 404) {
        errorMessage = 'Slider not found';
      } else if (error.statusCode === 422) {
        errorMessage = 'Please check your slider data';
      }
      
      error.value = errorMessage;
      toast.error(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSlider = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.delete<SliderResponse>(`/slider/${id}`, {
      });

      if (response.success) {
        await getSliders();
        toast.success('Slider deleted successfully!');
        return response.data;
      }

      throw new Error(response.message || 'Failed to delete slider');

    } catch (error: any) {
      let errorMessage = error.data?.message || error.message || 'Failed to delete slider';
      
      if (error.statusCode === 401) {
        errorMessage = 'Authentication required to delete slider';
      } else if (error.statusCode === 404) {
        errorMessage = 'Slider not found';
      }
      
      error.value = errorMessage;
      toast.error(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshSliders = async () => {
    return await getSliders();
  };

  return {
    sliders: readonly(sliders),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    getSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    refreshSliders
  };
}