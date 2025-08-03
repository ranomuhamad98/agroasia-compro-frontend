interface SliderData {
  image_link: string;
  sub_title: string;
  title: string;
  button_title?: string;
  button_link?: string;
  position?: number;
}

interface Slider {
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
  const sliders = ref<Slider[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Get all sliders
   */
  const getSliders = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('🎨 Fetching sliders...');

      const response = await $fetch<SliderResponse>('/api/slider/get', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.success && response.data.sliders) {
        sliders.value = response.data.sliders;
        console.log('✅ Sliders fetched successfully:', response.data.sliders.length);
        return response.data.sliders;
      }

      throw new Error(response.message || 'Failed to fetch sliders');

    } catch (error: any) {
      console.error('❌ Get sliders error:', error);
      error.value = error.data?.message || error.message || 'Failed to fetch sliders';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create new slider
   */
  const createSlider = async (sliderData: SliderData) => {
    try {
      isLoading.value = true;
      error.value = null;
      console.log('🎨 Creating slider...', sliderData);

      const response = await $fetch<SliderResponse>('/api/slider/post', {
        method: 'POST',
        body: sliderData,
        credentials: 'include'
      });

      if (response.success) {
        console.log('✅ Slider created successfully');
        // Refresh sliders list
        await getSliders();
        return response.data;
      }

      throw new Error(response.message || 'Failed to create slider');

    } catch (error: any) {
      console.error('❌ Create slider error:', error);
      error.value = error.data?.message || error.message || 'Failed to create slider';
      
      // Handle specific error cases
      if (error.statusCode === 401) {
        throw new Error('Authentication required to create slider');
      }
      
      if (error.statusCode === 422) {
        throw new Error('Please check your slider data');
      }
      
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh sliders data
   */
  const refreshSliders = async () => {
    return await getSliders();
  };

  return {
    // State
    sliders: readonly(sliders),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    getSliders,
    createSlider,
    refreshSliders
  };
}