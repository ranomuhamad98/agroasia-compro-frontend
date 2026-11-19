import type { HomeApiResponse, ApiError, Category, TopProduct, FAQ } from '../types/home-api-type'

interface HomeState {
  data: HomeApiResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    data: null,
    isLoading: false,
    error: null,
    lastFetched: null,
  }),

  getters: {
    // Data getters
    aboutUs: (state) => state.data?.about_us,
    categories: (state) => state.data?.categories || [],
    topProducts: (state) => state.data?.top_products || [],
    topProductSection: (state) => state.data?.top_product_section,
    program: (state) => state.data?.program,
    featured: (state) => state.data?.featured || [],
    testimonials: (state) => state.data?.testimonials || [],
    faq: (state) => state.data?.faq || [],
    header: (state) => state.data?.header,
    footer: (state) => state.data?.footer,
    slider: (state) => state.data?.slider || [],

    // State getters
    hasData: (state) => !!state.data && state.data.status === 200,
    isDataStale: (state) => {
      if (!state.lastFetched) return true;
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      return Date.now() - state.lastFetched > fiveMinutes;
    },
  },

  actions: {
    async fetchHomeData(force = false) {
      // Don't fetch if already loading
      if (this.isLoading) return;

      // Don't fetch if data is fresh (unless forced)
      if (!force && this.hasData && !this.isDataStale) return;

      this.isLoading = true;
      this.error = null;

      try {
        const apiClient = useApiClient();
        const response = await apiClient.get<HomeApiResponse>('/home');

        // Validate response
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }

        if (response.status !== 200) {
          throw new Error(response.message || 'API request failed');
        }

        this.data = response;
        this.lastFetched = Date.now();
        this.error = null;

        return response;
      } catch (err: any) {
        const errorMessage = err.statusMessage || err.message || 'Failed to fetch home data';
        this.error = errorMessage;
        
        console.error('Failed to fetch home data:', err);
        
        // Don't throw error to prevent app crashes
        // Instead, return null and let components handle the error state
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async refreshData() {
      return await this.fetchHomeData(true);
    },

    clearError() {
      this.error = null;
    },

    clearData() {
      this.data = null;
      this.lastFetched = null;
      this.error = null;
    },

    // Helper methods for specific data access
    getCategoryById(id: string) {
      return this.categories.find((category: Category) => category.id === id);
    },

    getTopProductById(id: string) {
      return this.topProducts.find((product: TopProduct) => product.id === id);
    },

    getTopProductsByCategory(categoryName: string) {
      return this.topProducts.filter((product: TopProduct) => 
        product.category.toLowerCase() === categoryName.toLowerCase()
      );
    },

    getFaqByTitle(title: string) {
      return this.faq.find((item: FAQ) => 
        item.title.toLowerCase().includes(title.toLowerCase())
      );
    },
  },
}); 