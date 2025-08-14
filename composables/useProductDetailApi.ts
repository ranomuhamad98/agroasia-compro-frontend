import type { ProductDetailApiResponse } from "@/types/product-detail-api-types";

export const useProductDetailApi = (productId: string) => {
  const apiClient = useApiClient();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { data: productData, error: productError, pending: productPending } = useAsyncData<ProductDetailApiResponse>(
    'product-detail-api-data',
    async () => {
      try { 
        isLoading.value = true;
        error.value = null;
        const response = await apiClient.get<ProductDetailApiResponse>(`/products/${productId}`);
        return response;
      } catch (error: any) {
        error.value = error.message || 'Failed to fetch product detail';
        throw error;
      } finally {
        isLoading.value = false;
      }
    }, {
      default: () => null,
      server: true,
      lazy: true,
      immediate: true,
    }
  )

  const product = computed(() => productData.value?.data.product);
  const waLink = computed(() => `${productData.value?.data.footer.whatsapp_number} ${productData.value?.data.footer.whatsapp_prerequisite_text.replace('[1]', product.value?.name || '')}`);

  return {
    productData,
    productError,
    productPending,
    product: readonly(product),
    waLink: readonly(waLink),
  }
}
