<template>
  <div class="tp-product-list-item d-md-flex">
    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="skeleton-wrapper d-md-flex">
      <div class="skeleton-thumb">
        <div class="skeleton-image"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-text skeleton-line-1"></div>
        <div class="skeleton-text skeleton-line-2"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- Actual Content -->
    <template v-else>
      <div class="tp-product-list-thumb p-relative fix">
        <nuxt-link :href="`/product-details/${item.id}`" style="height: 310px;background-color: #f2f3f5;">
          <img 
            :src="item.image" 
            :alt="item.name"
            :aria-label="item.name"
            :title="item.name"
            loading="lazy"
            decoding="async"
            class="shop-area__img"
          />
        </nuxt-link>
      </div>
      <div class="tp-product-list-content">
        <div class="tp-product-content-2 pt-15">
          <h3 class="tp-product-title-2">
            <nuxt-link :href="`/product-details/${item.id}`">{{ item.name }}</nuxt-link>
          </h3>
          <p>{{ item.summary.slice(0, 100) }}</p>
          <div>
            <a :href="`https://wa.me/919826000000?text=Halo, saya ingin memesan produk ${item.name}`"
              class="tp-product-pesan-sekarang list-item-pesan-sekarang">
              <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
              <span>Pesan Sekarang</span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from "@/types/product-d-t";
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { useCompareStore } from "@/pinia/useCompareStore";
import { useCartStore } from "@/pinia/useCartStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";
import type { DeepReadonly } from "vue";
import type { Product } from "@/types/products-api-type";

defineProps<{ 
  item: DeepReadonly<Product>;
  isLoading?: boolean;
}>();

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

<style scoped>
.shop-area__img {
  width: 100%;
  min-height: 120px;
  height: 100%;
  object-fit: cover;
}

/* Skeleton Loading Styles */
.skeleton-wrapper {
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-thumb {
  width: 310px;
  height: 310px;
  margin-right: 20px;
  flex-shrink: 0;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-content {
  flex: 1;
  padding: 15px 0;
}

.skeleton-title {
  width: 70%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-line-1 {
  width: 100%;
}

.skeleton-line-2 {
  width: 80%;
}

.skeleton-button {
  width: 150px;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-top: 15px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .skeleton-wrapper {
    flex-direction: column;
  }
  
  .skeleton-thumb {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>