import type { ApiError } from '../types/home-api-type'

interface UseApiClientOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export function useApiClient(options: UseApiClientOptions = {}) {
  const config = useRuntimeConfig();
  
  const defaultOptions = {
    baseURL: options.baseURL || 'https://agroasiaberdikari.id/api',
    timeout: options.timeout || 10000,
    retries: options.retries || 3,
    retryDelay: options.retryDelay || 1000,
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function makeRequest<T>(
    endpoint: string, 
    requestOptions: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = defaultOptions.timeout,
      retries = defaultOptions.retries,
    } = requestOptions;

    const url = `${defaultOptions.baseURL}${endpoint}`;
    
    console.log(`🌐 Making ${method} request to: ${url}`);
    
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt + 1}/${retries + 1} for ${url}`);
        
        const response = await $fetch<T>(url, {
          method,
          body,
          headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
            ...headers,
          },
          timeout,
          onResponseError({ response }) {
            throw createError({
              statusCode: response.status,
              statusMessage: response.statusText || 'API Error',
              data: response._data,
            });
          },
        });

        console.log(`✅ API request successful for ${url}`);
        return response;
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️ API request failed (attempt ${attempt + 1}):`, error.message || error);
        
        // Don't retry on client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          console.error(`❌ Client error (${error.statusCode}), not retrying`);
          break;
        }

        // If this is the last attempt, don't wait
        if (attempt === retries) {
          break;
        }

        // Wait before retrying with exponential backoff
        const delay = defaultOptions.retryDelay * Math.pow(2, attempt);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await sleep(delay);
      }
    }

    // Create a standardized error response
    const apiError: ApiError = {
      status: lastError?.statusCode || 500,
      message: lastError?.statusMessage || lastError?.message || 'Unknown API Error',
      data: lastError?.data,
    };

    console.error(`❌ All retry attempts failed for ${url}:`, apiError);

    throw createError({
      statusCode: apiError.status,
      statusMessage: apiError.message,
      data: apiError,
    });
  }

  return {
    get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'GET' }),
    
    post: <T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'POST', body }),
    
    put: <T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'PUT', body }),
    
    delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'DELETE' }),
    
    patch: <T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  };
} 