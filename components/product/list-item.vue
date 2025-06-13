<template>
  <div class="tp-product-list-item d-md-flex">
    <div class="tp-product-list-thumb p-relative fix">
      <nuxt-link :href="`/product-details/${item.id}`" style="height: 310px;background-color: #f2f3f5;">
        <img :src="item.images[0]" alt="product-img" />
      </nuxt-link>
    </div>
    <div class="tp-product-list-content">
      <div class="tp-product-content-2 pt-15">
        <h3 class="tp-product-title-2">
          <nuxt-link :href="`/product-details/${item.id}`">{{ item.name }}</nuxt-link>
        </h3>
        <p>{{ item.description.slice(0, 100) }}</p>
        <div>
          <a :href="`https://wa.me/919826000000?text=Halo, saya ingin memesan produk ${item.name}`"
            class="tp-product-pesan-sekarang list-item-pesan-sekarang">
            <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
            <span>Pesan Sekarang</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from "@/types/product-d-t";
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { useCompareStore } from "@/pinia/useCompareStore";
import { useCartStore } from "@/pinia/useCartStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";

defineProps<{ item: IProduct }>();

const compareStore = useCompareStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilityStore = useUtilityStore();

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
