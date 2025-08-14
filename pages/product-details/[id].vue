<template>
  <div>
    <div v-if="productPending" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
          <div class="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4">
          </div>
          <h2 class="text-xl font-semibold text-green-800 mb-2">Loading...</h2>
          <p class="text-green-600">Fetching product details...</p>
        </div>
    </div>
    <div class="pb-100" v-else-if="product">
        <breadcrumb-with-image title="Product Details" :subtitle="['Home', 'Products', product?.name || '']" color="#FFFFFF" />
        
        <product-details-area :product="product" :wa-link="waLink" />

        <product-details-gallery v-if="product.gallery.length > 0" :product="product" />

        <product-related-v2 :product-id="product?.id || ''" :category-id="product?.category_id || ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/pinia/useProductStore';
import { useProductDetailApi } from '@/composables/useProductDetailApi';

const route = useRoute()

const productId = route.params.id as string;

const {
  product,
  productPending,
  waLink,
  productError,
} = useProductDetailApi(productId)

const productStore = useProductStore();

// let product = ref<IProduct | undefined>();
useSeoMeta({ title: "Product Details Page" });
// onMounted(() => {
//   product.value = product_data.find(b => b.id === Number(route.params.id));
//   if (product.value && product.value?.images?.length > 0) {
//     productStore.activeImg = product.value.images[0];
//   }
// });

</script>
