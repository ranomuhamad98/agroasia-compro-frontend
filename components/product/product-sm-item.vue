<template>
  <div class="tp-product-sm-item-5 d-flex align-items-center">
    <div class="tp-product-sm-thumb-5 fix">
        <nuxt-link :href="`/product-details/${product.id}`">
          <img :src="product.images[0]" alt="product-image">
        </nuxt-link>
    </div>
    <div class="tp-product-sm-content-5">
        <div class="tp-product-sm-tag-5">
          <span><a href="#">{{ product.children }} </a></span>
        </div>
        <h4 class="tp-product-sm-title-5">
          <nuxt-link :href="`/product-details/${product.id}`">
            {{ product.name }}
          </nuxt-link>
        </h4>
        <div class="tp-product-sm-rating-5">
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star-half-stroke"></i></span>
        </div>
        <div class="tp-product-sm-price-wrapper-5">
          <span class="tp-product-sm-price-5">
            ${{ product.discount > 0 ? product.price - (product.price * product.discount / 100) : product.price }}
          </span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProduct } from '@/types/product-d-t';

defineProps<{product:IProduct}>()
</script>
