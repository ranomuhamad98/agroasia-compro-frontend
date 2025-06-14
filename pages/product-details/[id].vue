<template>
  <div v-if="product">
      <!-- breadcrumb start -->
      <breadcrumb-with-image title="Product Details" :subtitle="['Home', 'Products', product.name]" color="#FFFFFF" />
      <!-- breadcrumb end -->

      <!-- product details area start -->
      <product-details-area :product="product" />
      <!-- product details area end -->

      <!-- related products start -->
      <product-related :product-id="product.id" :category="product.parentCategory" />
      <!-- related products end -->
  </div>
</template>

<script setup lang="ts">
import product_data from '@/data/product-data';
import { useProductStore } from '@/pinia/useProductStore';
import { type IProduct } from '@/types/product-d-t';
const route = useRoute()

const productStore = useProductStore();

let product = ref<IProduct | undefined>();
useSeoMeta({ title: "Product Details Page" });
onMounted(() => {
  product.value = product_data.find(b => b.id === Number(route.params.id));
  if (product.value && product.value?.images?.length > 0) {
    productStore.activeImg = product.value.images[0];
  }
});

</script>
