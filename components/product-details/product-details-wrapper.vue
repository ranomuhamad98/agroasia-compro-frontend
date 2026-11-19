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
              <Icon name="mdi:minus" />
            </span>
          </div>

          <input class="quantity-input" type="text" :value="cart" disabled>

          <div class="block-quantity">
            <span class="quantity-plus" @click="cart++">
              <Icon name="mdi:plus" />
            </span>
          </div>
        </div>

      </div>

      <div class="tp-product-details-action-category d-sm-flex align-items-center">
        <span style="font-weight: 400;">Category: </span>
        <div class="category-wrapper">
          <nuxt-link :to="`/products?category=${product.category_id}&page=1`" class="text-[#55585B]">{{ product.category_name }}</nuxt-link>
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
