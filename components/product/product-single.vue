<template>
 <div class="tp-product-item-5 p-relative white-bg mb-40">
    <div class="tp-product-thumb-5 w-img fix mb-15">
        <nuxt-link :href="`/product-details/${product.id}`">
          <img :src="product.images[0]" alt="product-image">
        </nuxt-link>
    </div>
    <div class="tp-product-content-5 mt-4 mb-2">
        <h3 class="tp-product-title-5 text-center font-weight-bold">
          <nuxt-link :href="`/product-details/${product.id}`">{{ product.name }}</nuxt-link>
        </h3>
        <p class="text-center text-truncate px-4">{{ product.description }}</p>
    </div>
    <div>
      <a 
      :href="`https://wa.me/919826000000?text=Halo, saya ingin memesan produk ${product.name}`" 
      class="tp-product-pesan-sekarang">
        <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
        <span>Pesan Sekarang</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/pinia/useCartStore';
import { useCompareStore } from '@/pinia/useCompareStore';
import { useUtilityStore } from '@/pinia/useUtilityStore';
import { useWishlistStore } from '@/pinia/useWishlistStore';
import type { IProduct } from '@/types/product-d-t';

defineProps<{product:IProduct}>();

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilityStore = useUtilityStore();
const compareStore = useCompareStore();

function isItemInWishlist(product: IProduct) {
  return wishlistStore.wishlists.some((prd) => prd.id === product.id);
}
function isItemInCompare(product: IProduct) {
  return compareStore.compare_items.some((prd) => prd.id === product.id);
}
function isItemInCart(product: IProduct) {
  return cartStore.cart_products.some((prd) => prd.id === product.id);
}
</script>
