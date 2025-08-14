import type { ProductsApiResponse, ProductsApiParams } from "../types/products-api-type";

interface ProductsCacheOptions {
  ttl?: number; // Time to live in milliseconds
  persistent?: boolean; // Use localStorage for persistence
  maxAge?: number; // Max age in seconds for useAsyncData
}

export function useProductsApi(
  params: MaybeRef<ProductsApiParams> = {}, 
  cacheOptions: ProductsCacheOptions = {}
) {
  const apiClient = useApiClient();
  const nuxtApp = useNuxtApp();

  // Default cache options
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    persistent = false,
    maxAge = 300 // 5 minutes for useAsyncData
  } = cacheOptions;

  // Create internal reactive params
  const internalParams = ref<ProductsApiParams>({
    page: unref(params).page || 1,
    limit: unref(params).limit || 12,
    category: unref(params).category
  });

  // Watch for external params changes and sync with internal params (initial sync only)
  let hasInitialized = false;
  watch(
    () => unref(params),
    (newParams) => {
      // Only sync on initial setup, afterwards internal params take control
      if (!hasInitialized && newParams) {
        const updatedParams = {
          page: newParams.page || 1,
          limit: newParams.limit || 12,
          category: newParams.category
        };
        internalParams.value = updatedParams;
        hasInitialized = true;
      }
    },
    { immediate: true }
  );

  // Make params reactive
  const reactiveParams = computed(() => ({
    page: internalParams.value.page || 1,
    limit: internalParams.value.limit || 12,
    category: internalParams.value.category
  }));

  // Build query string reactively
  const queryString = computed(() => {
    const { page, limit, category } = reactiveParams.value;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (category) {
      queryParams.append('category', category);
    }
    
    return queryParams.toString();
  });

  // Cache key that updates when parameters change
  const cacheKey = computed(() => 
    `products-api-data-${reactiveParams.value.page}-${reactiveParams.value.limit}-${reactiveParams.value.category || 'all'}`
  );

  // Persistent cache key for localStorage
  const persistentCacheKey = computed(() => `${cacheKey.value}-${Date.now() - (Date.now() % ttl)}`);

  // Function to get from persistent cache
  const getFromPersistentCache = (): ProductsApiResponse | null => {
    if (!persistent || process.server) return null;
    
    try {
      const cached = localStorage.getItem(persistentCacheKey.value);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (parsed.timestamp && (now - parsed.timestamp) < ttl) {
          return parsed.data;
        } else {
          // Remove expired cache
          localStorage.removeItem(persistentCacheKey.value);
        }
      }
    } catch (error) {
      console.warn('Failed to read from persistent cache:', error);
    }
    
    return null;
  };

  // Function to save to persistent cache
  const saveToPersistentCache = (data: ProductsApiResponse) => {
    if (!persistent || process.server) return;
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(persistentCacheKey.value, JSON.stringify(cacheData));
      
      // Clean up old cache entries (keep only last 10)
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('products-api-data-'));
      if (allKeys.length > 10) {
        allKeys.sort().slice(0, -10).forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to save to persistent cache:', error);
    }
  };

  const { data: productsData, error: productsError, pending: productsPending, refresh: refreshProducts } = useAsyncData<ProductsApiResponse>(
    cacheKey,
    async () => {
      // Try persistent cache first
      const cachedData = getFromPersistentCache();
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API
      const response = await apiClient.get<ProductsApiResponse>(`/products?${queryString.value}`);
      
      // Save to persistent cache
      saveToPersistentCache(response);
      
      return response;
    },
    {
      default: () => null,
      server: false, // Only fetch on client side for better performance
      lazy: false, // Auto fetch when key changes
      transform: (data: ProductsApiResponse) => data,
      watch: [cacheKey] // Explicitly watch cacheKey changes
    }
  );

  // Manual cache management functions
  const clearCache = () => {
    // Clear useAsyncData cache
    clearNuxtData(cacheKey.value);
    
    // Clear persistent cache (localStorage)
    if (persistent && process.client) {
      const allKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`products-api-data-${reactiveParams.value.page}-${reactiveParams.value.limit}`)
      );
      allKeys.forEach(key => localStorage.removeItem(key));
    }
  };

  const forceRefresh = async () => {
    clearCache();
    await refreshProducts();
  };

  const updateParams = async (newParams: Partial<ProductsApiParams>) => {
    const updatedParams = {
      ...internalParams.value,
      ...newParams
    };
    
    // Update the reactive params (this will trigger useAsyncData automatically)
    internalParams.value = updatedParams;
  };

  const fetchWithNewQuery = async (newParams: ProductsApiParams) => {
    // Replace all params (this will trigger useAsyncData automatically)
    internalParams.value = newParams;
  };

  const setParams = async (newParams: Partial<ProductsApiParams>) => {
    const updatedParams = { ...internalParams.value };
    
    // Update params
    if (newParams.page !== undefined) {
      updatedParams.page = newParams.page;
    }
    if (newParams.limit !== undefined) {
      updatedParams.limit = newParams.limit;
    }
    if (newParams.category !== undefined) {
      updatedParams.category = newParams.category;
    }
    
    // Update params (this will trigger useAsyncData automatically)
    internalParams.value = updatedParams;
  };

  const nextPage = async () => {
    const current = internalParams.value;
    const newPage = (current.page || 1) + 1;
    await updateParams({ page: newPage });
  };

  const previousPage = async () => {
    const current = internalParams.value;
    const currentPage = current.page || 1;
    if (currentPage > 1) {
      await updateParams({ page: currentPage - 1 });
    }
  };

  const goToPage = async (page: number) => {
    await updateParams({ page });
  };

  const changePage = async (page: number) => {
    await updateParams({ page });
  };

  const changeCategory = async (category: string | undefined) => {
    await updateParams({ category, page: 1 });
  };

  const changeLimit = async (limit: number) => {
    await updateParams({ limit, page: 1 });
  };

  const manualRefresh = async () => {
    await refreshProducts();
  };

  return {
    // Core data
    productsData,
    productsError,
    productsPending,
    refreshProducts,
    // Current parameters (read-only)
    currentParams: reactiveParams,
    // Query management functions (with internal smart caching)
    updateParams,
    fetchWithNewQuery,
    setParams,
    changePage,
    // Pagination helpers
    nextPage,
    previousPage,
    goToPage,
    // Filter helpers
    changeCategory,
    changeLimit,
    // Force refresh when needed (bypasses cache completely)
    forceRefresh,
    // Manual refresh function
    manualRefresh,
  };
}