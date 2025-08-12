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

// Type definitions for different API responses
interface LoginResponse {
  success: boolean;
  data: any;
  message: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    categories: any;
    sliders: any;
    products: any;
    stats: {
      categoriesCount: number;
      slidersCount: number;
      productsCount: number;
      lastUpdated: string;
    };
  };
  message: string;
}

interface ProductResponse {
  success: boolean;
  data: any;
  message: string;
}

interface CategoryResponse {
  success: boolean;
  data: any;
  message: string;
}

interface SliderResponse {
  success: boolean;
  data: any;
  message: string;
}

interface TestimonialResponse {
  success: boolean;
  data: any;
  message: string;
}

interface GalleryResponse {
  success: boolean;
  data: any;
  message: string;
}

interface OurPeopleResponse {
  success: boolean;
  data: any;
  message: string;
}

interface MediaResponse {
  success: boolean;
  data: any;
  message: string;
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
      body,
      headers = {},
      timeout = defaultOptions.timeout,
      retries = defaultOptions.retries,
    } = requestOptions;

    const url = `${defaultOptions.baseURL}${endpoint}`;
    
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await $fetch<T>(url, {
          method,
          body,
          headers: {
            'Content-Type': 'application/json',
            'credentials': 'include',
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

        return response as T;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          break;
        }

        // If this is the last attempt, don't wait
        if (attempt === retries) {
          break;
        }

        // Wait before retrying with exponential backoff
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

  // Auth endpoints
  const auth = {
    login: (credentials: { email: string; password: string }) =>
      makeRequest<LoginResponse>('/auth/login', { method: 'POST', body: credentials }),
    
    logout: () =>
      makeRequest<LoginResponse>('/auth/logout', { method: 'POST' }),
    
    me: () =>
      makeRequest<LoginResponse>('/auth/me', { method: 'GET' }),
  };

  // Dashboard endpoints
  const dashboard = {
    get: () =>
      makeRequest<DashboardResponse>('/dashboard', { method: 'GET' }),
  };

  // Product endpoints
  const products = {
    getAll: () =>
      makeRequest<ProductResponse>('/product', { method: 'GET' }),
    
    getById: (id: string | number) =>
      makeRequest<ProductResponse>(`/product/${id}`, { method: 'GET' }),
    
    create: (productData: any) =>
      makeRequest<ProductResponse>('/product', { method: 'POST', body: productData }),
    
    update: (id: string | number, productData: any) =>
      makeRequest<ProductResponse>(`/product/${id}`, { method: 'PUT', body: productData }),
    
    delete: (id: string | number) =>
      makeRequest<ProductResponse>(`/product/${id}`, { method: 'DELETE' }),
  };

  // Category endpoints
  const categories = {
    getAll: () =>
      makeRequest<CategoryResponse>('/product/category', { method: 'GET' }),
    
    getById: (id: string | number) =>
      makeRequest<CategoryResponse>(`/product/category/${id}`, { method: 'GET' }),
    
    create: (categoryData: any) =>
      makeRequest<CategoryResponse>('/product/category', { method: 'POST', body: categoryData }),
    
    update: (id: string | number, categoryData: any) =>
      makeRequest<CategoryResponse>(`/product/category/${id}`, { method: 'PUT', body: categoryData }),
    
    delete: (id: string | number) =>
      makeRequest<CategoryResponse>(`/product/category/${id}`, { method: 'DELETE' }),
  };

  // Slider endpoints
  const sliders = {
    getAll: () =>
      makeRequest<SliderResponse>('/slider', { method: 'GET' }),
    
    create: (sliderData: any) =>
      makeRequest<SliderResponse>('/slider', { method: 'POST', body: sliderData }),
  };

  // Individual slider management
  const slider = {
    getById: (id: string | number) =>
      makeRequest<SliderResponse>(`/sliders/${id}`, { method: 'GET' }),
    
    update: (id: string | number, sliderData: any) =>
      makeRequest<SliderResponse>(`/sliders/${id}`, { method: 'PUT', body: sliderData }),
    
    delete: (id: string | number) =>
      makeRequest<SliderResponse>(`/sliders/${id}`, { method: 'DELETE' }),
  };

  // Testimonial endpoints
  const testimonials = {
    getAll: () =>
      makeRequest<TestimonialResponse>('/testimonials', { method: 'GET' }),
    
    getById: (id: string | number) =>
      makeRequest<TestimonialResponse>(`/testimonials/${id}`, { method: 'GET' }),
    
    create: (testimonialData: any) =>
      makeRequest<TestimonialResponse>('/testimonials', { method: 'POST', body: testimonialData }),
    
    update: (id: string | number, testimonialData: any) =>
      makeRequest<TestimonialResponse>(`/testimonials/${id}`, { method: 'PUT', body: testimonialData }),
    
    delete: (id: string | number) =>
      makeRequest<TestimonialResponse>(`/testimonials/${id}`, { method: 'DELETE' }),
  };

  // About - Gallery endpoints
  const gallery = {
    getAll: () =>
      makeRequest<GalleryResponse>('/about/gallery', { method: 'GET' }),
    
    getById: (id: string | number) =>
      makeRequest<GalleryResponse>(`/about/gallery/${id}`, { method: 'GET' }),
    
    create: (galleryData: any) =>
      makeRequest<GalleryResponse>('/about/gallery', { method: 'POST', body: galleryData }),
    
    delete: (id: string | number) =>
      makeRequest<GalleryResponse>(`/about/gallery/${id}`, { method: 'DELETE' }),
  };

  // About - Our People endpoints
  const ourPeople = {
    getAll: () =>
      makeRequest<OurPeopleResponse>('/about/ourpeople', { method: 'GET' }),
    
    getById: (id: string | number) =>
      makeRequest<OurPeopleResponse>(`/about/ourpeople/${id}`, { method: 'GET' }),
    
    create: (peopleData: any) =>
      makeRequest<OurPeopleResponse>('/about/ourpeople', { method: 'POST', body: peopleData }),
    
    update: (id: string | number, peopleData: any) =>
      makeRequest<OurPeopleResponse>(`/about/ourpeople/${id}`, { method: 'PUT', body: peopleData }),
    
    delete: (id: string | number) =>
      makeRequest<OurPeopleResponse>(`/about/ourpeople/${id}`, { method: 'DELETE' }),
  };

  // Media endpoints
  const media = {
    getAll: () =>
      makeRequest<MediaResponse>('/media', { method: 'GET' }),
    
    upload: (mediaData: any) =>
      makeRequest<MediaResponse>('/media', { method: 'POST', body: mediaData }),
  };

  // Admin endpoints (catch-all)
  const admin = {
    handle: (slug: string, options?: ApiRequestOptions) =>
      makeRequest<any>(`/admin/${slug}`, options),
  };

  // Public endpoints (catch-all)
  const publicApi = {
    handle: (slug: string, options?: ApiRequestOptions) =>
      makeRequest<any>(`/public/${slug}`, options),
  };

  return {
    // Core HTTP methods for custom requests
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

    // Organized endpoint groups
    auth,
    dashboard,
    products,
    categories,
    sliders,
    slider,
    testimonials,
    gallery,
    ourPeople,
    media,
    admin,
    public: publicApi,
  };
}
