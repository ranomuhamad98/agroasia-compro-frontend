<template>
  <div class="tp-product-details-thumb-gallery">
    <div class="row">
      <div class="col-lg-6"  v-for="(img, i) in product.images" :key="i">
        <div class="tp-product-details-thumb-gallery-item mb-25" style="background-color: #f5f6f8">
          <img
            :src="img"
            alt="product-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';

defineProps<{ product: IProduct }>();
</script>
