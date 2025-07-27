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
    
    // Clear persistent cache
    if (persistent && process.client) {
      const allKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`products-api-data-${reactiveParams.value.page}-${reactiveParams.value.limit}`)
      );
      allKeys.forEach(key => localStorage.removeItem(key));
    }
  };

  const clearAllProductsCache = () => {
    // Clear all products related cache
    if (process.client) {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('products-api-data-'));
      allKeys.forEach(key => localStorage.removeItem(key));
    }
    
    // Clear all nuxt data cache for products by finding matching keys
    if (nuxtApp.payload.data) {
      const dataKeys = Object.keys(nuxtApp.payload.data as Record<string, any>).filter(key => key.startsWith('products-api-data-'));
      dataKeys.forEach(key => clearNuxtData(key));
    }
  };

  // Force refresh (bypass all caches)
  const forceRefresh = async () => {
    clearCache();
    await refreshProducts();
  };

  // Function to update params and fetch new data (with internal smart caching)
  const updateParams = async (newParams: Partial<ProductsApiParams>) => {
    const updatedParams = {
      ...internalParams.value,
      ...newParams
    };
    
    // Update the reactive params (this will trigger useAsyncData automatically)
    internalParams.value = updatedParams;
  };

  // Function to fetch with completely new query (with internal smart caching)
  const fetchWithNewQuery = async (newParams: ProductsApiParams) => {
    // Replace all params (this will trigger useAsyncData automatically)
    internalParams.value = newParams;
  };

  // Function to set specific param and fetch (with internal smart caching)
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

  // Function to go to next page (with internal smart caching)
  const nextPage = async () => {
    const current = internalParams.value;
    const newPage = (current.page || 1) + 1;
    await updateParams({ page: newPage });
  };

  // Function to go to previous page (with internal smart caching)
  const previousPage = async () => {
    const current = internalParams.value;
    const currentPage = current.page || 1;
    if (currentPage > 1) {
      await updateParams({ page: currentPage - 1 });
    }
  };

  // Function to go to specific page (with internal smart caching)
  const goToPage = async (page: number) => {
    await updateParams({ page });
  };

  // Function to change category (with internal smart caching)
  const changeCategory = async (category: string | undefined) => {
    await updateParams({ category, page: 1 }); // Reset to page 1 when changing category
  };

  // Function to change limit per page (with internal smart caching)
  const changeLimit = async (limit: number) => {
    await updateParams({ limit, page: 1 }); // Reset to page 1 when changing limit
  };

  // Debug function to check current state
  const debugState = () => {
    return {
      internalParams: internalParams.value,
      reactiveParams: reactiveParams.value,
      cacheKey: cacheKey.value,
      queryString: queryString.value,
      pending: productsPending.value,
      hasData: !!productsData.value,
      dataLength: productsData.value?.data?.products?.length || 0
    };
  };

    // Manual refresh function that ensures fresh data
  const manualRefresh = async () => {
    await refreshProducts();
  };

  // Add watchers for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    watch(internalParams, (newParams, oldParams) => {
      console.log('🔄 Internal params changed:', { old: oldParams, new: newParams });
    }, { deep: true });

    watch(cacheKey, (newKey, oldKey) => {
      console.log('🔑 Cache key changed:', { old: oldKey, new: newKey });
    });

    watch(productsData, (newData, oldData) => {
      console.log('📦 Products data changed:', { 
        hadData: !!oldData, 
        hasData: !!newData,
        newLength: newData?.data?.products?.length || 0
      });
    });

    watch(productsPending, (pending, wasPending) => {
      if (pending && !wasPending) {
        console.log('⏳ Fetch started...');
      }
      if (!pending && wasPending) {
        console.log('✅ Fetch completed');
      }
    });
  }

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
    // Debug utilities (for development)
    debugState
  };
}