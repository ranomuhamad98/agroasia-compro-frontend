<template>
  <div class="tp-product-details-wrapper has-sticky">
    <h3 class="tp-product-details-title">{{ product.name }}</h3>

    <p class="tp-product-details-description">{{ textMore ? product.description : `${product.description.substring(0,
      100)}...` }} <span @click="textMore = !textMore">{{ textMore ? 'See less' : 'See more' }}</span></p>

    <!-- actions -->
    <div class="tp-product-details-action-wrapper">
      <div class="tp-product-details-action-item-wrapper d-sm-flex align-items-center">

        <div class="tp-product-details-quantity-custom mb-15 mr-15">
          <div class="block-quantity">
            <span class="quantity-minus" @click="cartStore.decrement">
              <Icon name="mdi:minus" />
            </span>
          </div>

          <input class="quantity-input" type="text" :value="cartStore.orderQuantity" disabled>

          <div class="block-quantity">
            <span class="quantity-plus" @click="cartStore.increment">
              <Icon name="mdi:plus" />
            </span>
          </div>
        </div>

      </div>

      <div class="tp-product-details-action-category d-sm-flex align-items-center">
        <span style="font-weight: 400;">Category: </span>
        <div class="category-wrapper">
          <nuxt-link v-for="tag in product.tags" :to="`/product-details/${tag}`" :key="tag">{{ tag }}</nuxt-link>
        </div>
      </div>

      <div class="tp-product-details-action-pesan-sekarang">
        <a :href="`https://wa.me/919826000000?text=Halo, saya ingin memesan produk ${product.name}`"
          class="tp-product-pesan-sekarang list-item-pesan-sekarang">
          <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
          <span>Pesan Sekarang!</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/pinia/useProductStore';
import { type IProduct } from '@/types/product-d-t';
import { useCartStore } from "@/pinia/useCartStore";
import { useCompareStore } from "@/pinia/useCompareStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";

// store
const compareStore = useCompareStore();
const wishlistStore = useWishlistStore();
const productStore = useProductStore();
const cartStore = useCartStore();
// props
const props = withDefaults(defineProps<{ product: IProduct; isShowBottom?: boolean }>(), {
  isShowBottom: true,
})
let textMore = ref<boolean>(false)
</script>
