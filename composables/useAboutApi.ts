import type { AboutApiResponse } from '../types/about-api-type'

export function useAboutApi() {
  const apiClient = useApiClient();
  
  // Reactive state for loading and error handling
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Use useAsyncData to automatically fetch on mount
  const { data: aboutData, refresh, pending } = useAsyncData<AboutApiResponse>(
    'about-api-data',
    async () => {
      try {
        console.log('🚀 Fetching about data from API...');
        isLoading.value = true;
        error.value = null;
        
        const response = await apiClient.get<AboutApiResponse>('/about-us');
        
        console.log('📡 About API Response received:', response);
        
        // Validate response structure
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }

        if (response.status !== 200) {
          throw new Error(response.message || 'API request failed');
        }

        console.log('✅ About data fetched successfully');
        return response;
      } catch (err: any) {
        console.error('❌ Failed to fetch about data:', err);
        error.value = err.statusMessage || err.message || 'Failed to fetch about data';
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
  const jumbotron = computed(() => aboutData.value?.data?.jumbotron);
  const milestones = computed(() => aboutData.value?.data?.milestones || []);
  const video = computed(() => aboutData.value?.data?.video);
  const ourPeople = computed(() => aboutData.value?.data?.our_people || []);
  const ourValues = computed(() => aboutData.value?.data?.our_value);
  const gallery = computed(() => aboutData.value?.data?.gallery || []);
  const header = computed(() => aboutData.value?.data?.header);
  const footer = computed(() => aboutData.value?.data?.footer);

  // Method to manually refresh data
  const refreshAboutData = async () => {
    await refresh();
  };

  const hasData = computed(() => !!aboutData.value && (aboutData.value as AboutApiResponse).status === 200);

  return {
    // Raw data
    aboutData: readonly(aboutData),
    
    // Computed sections
    jumbotron: readonly(jumbotron),
    milestones: readonly(milestones),
    video: readonly(video),
    ourPeople: readonly(ourPeople),
    ourValues: readonly(ourValues),
    gallery: readonly(gallery),
    header: readonly(header),
    footer: readonly(footer),
    
    // State management
    isLoading: readonly(isLoading),
    pending: readonly(pending),
    error: readonly(error),
    hasData: readonly(hasData),
    
    // Methods
    refreshAboutData,
  };
} 