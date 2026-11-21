<template>
  <div class="tp-product-details-wrapper has-sticky">
    <h3 class="tp-product-details-title">{{ product.name }}</h3>

    <p class="tp-product-details-description whitespace-pre-wrap">{{ textMore ? product.summary :
      `${product.summary.substring(0,
        100)}...` }} <span @click="textMore = !textMore">{{ textMore ? 'See less' : 'See more' }}</span></p>

    <!-- actions -->
    <div class="tp-product-details-action-wrapper">
      <div class="tp-product-details-action-item-wrapper d-sm-flex align-items-center">

        <div class="tp-product-details-quantity-custom mb-15 mr-15">
          <div class="block-quantity">
            <span class="quantity-minus" @click="cart--">
              <svg class="qty-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M5 11h14v2H5z" />
              </svg>
            </span>
          </div>

          <input class="quantity-input" type="text" :value="cart" disabled>

          <div class="block-quantity">
            <span class="quantity-plus" @click="cart++">
              <svg class="qty-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
              </svg>
            </span>
          </div>
        </div>

      </div>

      <div class="tp-product-details-action-category d-sm-flex align-items-center">
        <span style="font-weight: 400;">Category: </span>
        <div class="category-wrapper">
          <nuxt-link :to="`/products?category=${product.category_slug || categorySlug(product.category_name)}&page=1`" class="text-[#55585B]">{{ product.category_name }}</nuxt-link>
        </div>
      </div>

      <div class="tp-product-details-action-pesan-sekarang">
        <a :href="waLink"
          target="_blank"
          rel="noopener noreferrer"
          class="tp-product-pesan-sekarang list-item-pesan-sekarang">
          <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
          <span>Pesan Sekarang!</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ProductDetail } from "@/types/product-detail-api-types";
import type { DeepReadonly } from "vue";
import { categorySlug } from "@/utils/categorySlug";

const props = withDefaults(defineProps<{
  product: DeepReadonly<ProductDetail>;
  waLink: string;
  isShowBottom?: boolean
}>(), {
  isShowBottom: true,
})
const cart = ref<number>(1);
let textMore = ref<boolean>(false)
</script>

<style scoped>
.qty-icon {
  width: 20px;
  height: 20px;
  display: block;
}
</style>
