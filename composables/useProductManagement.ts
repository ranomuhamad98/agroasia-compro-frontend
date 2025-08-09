export interface AdditionalInformationTable {
  headers: string[];
  rows: string[][];
}

export interface AdditionalInformation {
  content_1: string;
  content_2: AdditionalInformationTable;
  content_3: string;
}

export interface CreateProductPayload {
  name: string;
  summary: string;
  description: string;
  additional_information?: AdditionalInformation;
  category_id: string;
  tags?: string[];
  text_wa?: string;
  is_top_product?: boolean;
}

export interface UpdateProductPayload {
  name: string;
  summary: string;
  description: string;
  additional_information?: AdditionalInformation;
  category_id: string;
  tags?: string[];
  image?: string; // optional on update
  text_wa?: string;
  is_top_product?: boolean;
}

export type GalleryStatus = 'main' | 'gallery';

export interface AddProductGalleryPayload {
  image_gallery_id: string;
  status: GalleryStatus;
}

export function useProductManagement() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const apiClient = useApiClient();

  interface ExternalProduct {
    id: string;
    name: string;
    summary: string;
    description: string;
    additional_information?: Record<string, any>;
    category_id: string;
    category_name?: string;
    tags?: string[];
    gallery?: Array<{ image: string; status: string }>;
  }

  interface ProductCreateResponseBody {
    status: number;
    message: string;
    product: ExternalProduct;
  }

  interface ApiSuccessWrapper<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  const createProduct = async (payload: CreateProductPayload) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<ApiSuccessWrapper<ProductCreateResponseBody>>( 
        '/api/product/post',
        {
          method: 'POST',
          body: payload,
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to create product');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ Failed to create product:', err);
      error.value = err?.message || 'Failed to create product';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addProductImage = async (productId: string, payload: AddProductGalleryPayload) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<ApiSuccessWrapper<any>>( 
        `/api/product/${productId}/gallery`,
        {
          method: 'POST',
          body: payload,
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to add product image');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ Failed to add product image:', err);
      error.value = err?.message || 'Failed to add product image';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const updateProduct = async (
    id: string,
    payload: UpdateProductPayload
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<{ success: boolean; data: any; message?: string }>(
        `/api/product/${id}`,
        {
          method: 'PUT',
          body: payload,
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to update product');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ Failed to update product:', err);
      error.value = err?.message || 'Failed to update product';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getProductDetail = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<{ success: boolean; data: any; message?: string }>(`/api/product/${id}`, {
        method: 'GET',
        headers: { accept: 'application/json' }
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch product detail');
      }

      const raw = response.data as any;
      const product = raw?.product || raw?.data?.product || raw?.data || raw;
      return product;
    } catch (err: any) {
      console.error('❌ Failed to fetch product detail:', err);
      error.value = err?.message || 'Failed to fetch product detail';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<{ success: boolean; data: any; message?: string }>(`/api/product/${id}`, {
        method: 'DELETE',
        headers: { accept: 'application/json' }
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete product');
      }

      return true;
    } catch (err: any) {
      console.error('❌ Failed to delete product:', err);
      error.value = err?.message || 'Failed to delete product';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    createProduct,
    updateProduct,
    getProductDetail,
    addProductImage,
    deleteProduct,
    clearError,
  };
}


