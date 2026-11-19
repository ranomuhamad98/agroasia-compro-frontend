import type { ApiError } from '../types/home-api-type'

interface UseProxyApiClientOptions {
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

export function useProxyApiClient(options: UseProxyApiClientOptions = {}) {
  const baseURL = import.meta.env.VITE_API_PROXY_PATH || '/proxy';
  
  const defaultOptions = {
    baseURL,
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
      body: requestBody,
      headers,
      timeout = defaultOptions.timeout,
      retries = defaultOptions.retries,
    } = requestOptions;

    const url = `${defaultOptions.baseURL}${endpoint}`;
    
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Don't set Content-Type for FormData, let the browser handle it
        const requestHeaders: Record<string, string> = {
          'credentials': 'include',
          ...headers,
        };
        
        // Only set Content-Type if it's not FormData
        if (!(requestBody instanceof FormData)) {
          requestHeaders['Content-Type'] = headers?.['Content-Type'] || 'application/json';
        }

        const response = await $fetch<T>(url, {
          method,
          ...(requestBody && { body: requestBody }),
          headers: requestHeaders,
          timeout,
          onResponseError({ response }) {
            throw createError({
              statusCode: response.status,
              statusMessage: response.statusText || 'API Error',
              data: response._data,
            });
          },
        });

        return response as T;
      } catch (error: any) {
        lastError = error;
        
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          break;
        }

        if (attempt === retries) {
          break;
        }

        const delay = defaultOptions.retryDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }

    // Create a standardized error response
    const apiError: ApiError = {
      status: lastError?.statusCode || 500,
      message: lastError?.statusMessage || lastError?.message || 'Unknown API Error',
      data: lastError?.data,
    };

    throw createError({
      statusCode: apiError.status,
      statusMessage: apiError.message,
      data: apiError,
    });
  }

  return {
    // Core HTTP methods for custom requests
    get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'GET' }),
    
    post: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'POST' }),
    
    put: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'PUT' }),
    
    delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'DELETE' }),
    
    patch: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
      makeRequest<T>(endpoint, { ...options, method: 'PATCH' }),
  };
}
