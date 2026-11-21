import type { ProductDetailApiResponse } from "@/types/product-detail-api-types";
import { productOrderMessage, whatsAppOrderLink } from "@/utils/whatsapp";

export const useProductDetailApi = (productId: MaybeRef<string>) => {
  const apiClient = useApiClient();
  const id = computed(() => String(unref(productId) || ''));

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { data: productData, error: productError, pending: productPending } = useAsyncData<ProductDetailApiResponse>(
    () => `product-detail-api-data-${id.value}`,
    async () => {
      if (!id.value) {
        return null as unknown as ProductDetailApiResponse;
      }
      try {
        isLoading.value = true;
        error.value = null;
        const response = await apiClient.get<ProductDetailApiResponse>(`/products/${id.value}`);
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
      watch: [id],
    }
  )

  const product = computed(() => productData.value?.data.product);
  const waLink = computed(() => whatsAppOrderLink(
    productData.value?.data.footer?.whatsapp_number,
    productOrderMessage(
      product.value?.name || '',
      product.value?.text_wa_product,
      productData.value?.data.wa_text_interest
    )
  ));

  return {
    productData,
    productError,
    productPending,
    product: readonly(product),
    waLink: readonly(waLink),
  }
}
