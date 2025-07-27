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

  // Make params reactive
  const reactiveParams = computed(() => {
    const p = unref(params);
    return {
      page: p.page || 1,
      limit: p.limit || 12,
      category: p.category
    };
  });

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
      lazy: true,
      transform: (data: ProductsApiResponse) => data
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

  return {
    productsData,
    productsError,
    productsPending,
    refreshProducts,
    // Return reactive params for external use
    currentParams: reactiveParams,
    // Cache management
    clearCache,
    clearAllProductsCache,
    forceRefresh,
    // Cache info
    cacheInfo: computed(() => ({
      key: cacheKey.value,
      ttl,
      persistent,
      maxAge
    }))
  };
}