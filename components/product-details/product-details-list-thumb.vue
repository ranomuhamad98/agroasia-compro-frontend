<template>
  <div class="tp-product-details-thumb-list">
    <div
      v-for="(img, i) in product.images"
      :key="i"
      class="tp-product-details-thumb-list-item mb-25 d-flex align-items-center justify-content-center"
      style="background-color: #f5f6f8"
    >
      <img :src="img" alt="product-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';

defineProps<{ product: IProduct }>();
</script>
