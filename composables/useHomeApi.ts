import type { HomeApiResponse } from '../types/home-api-type'
import { toast } from 'vue3-toastify';

export function useHomeApi() {
  const apiClient = useApiClient();
  
  // Reactive state for loading and error handling
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Use useAsyncData (not lazy) to automatically fetch on mount
  const { data: homeData, refresh, pending } = useAsyncData<HomeApiResponse>(
    'home-api-data',
    async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        const response = await apiClient.get<HomeApiResponse>('/home');
        
        // Validate response structure
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }

        if (response.status !== 200) {
          throw new Error(response.message || 'API request failed');
        }

        return response;
      } catch (err: any) {
        const errorMessage = err.statusMessage || err.message || 'Failed to fetch home data';
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
  const aboutUs = computed(() => (homeData.value as HomeApiResponse)?.about_us);
  const categories = computed(() => (homeData.value as HomeApiResponse)?.categories || []);
  const topProducts = computed(() => (homeData.value as HomeApiResponse)?.top_products || []);
  const topProductSection = computed(() => (homeData.value as HomeApiResponse)?.top_product_section);
  const program = computed(() => (homeData.value as HomeApiResponse)?.program);
  const featured = computed(() => (homeData.value as HomeApiResponse)?.featured || []);
  const testimonials = computed(() => (homeData.value as HomeApiResponse)?.testimonials || []);
  const faq = computed(() => (homeData.value as HomeApiResponse)?.faq || []);
  const header = computed(() => (homeData.value as HomeApiResponse)?.header);
  const footer = computed(() => (homeData.value as HomeApiResponse)?.footer);
  const slider = computed(() => (homeData.value as HomeApiResponse)?.slider || []);

  // Manual refresh function
  const refreshData = async () => {
    await refresh();
  };

  // Check if data is available
  const hasData = computed(() => !!homeData.value && (homeData.value as HomeApiResponse).status === 200);

  return {
    // Data
    homeData: readonly(homeData),
    aboutUs: readonly(aboutUs),
    categories: readonly(categories),
    topProducts: readonly(topProducts),
    topProductSection: readonly(topProductSection),
    program: readonly(program),
    featured: readonly(featured),
    testimonials: readonly(testimonials),
    faq: readonly(faq),
    header: readonly(header),
    footer: readonly(footer),
    slider: readonly(slider),
    
    // State
    isLoading: readonly(isLoading),
    isPending: readonly(pending),
    error: readonly(error),
    hasData: readonly(hasData),
    
    // Actions
    refresh: refreshData,
  };
} 