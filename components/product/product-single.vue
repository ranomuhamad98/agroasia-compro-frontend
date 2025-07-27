<template>
 <div class="tp-product-item-5 p-relative white-bg mb-40">
    <!-- Loading placeholder -->
    <div v-if="isLoading" class="loading-placeholder">
      <div class="tp-product-thumb-5 w-img fix mb-15">
        <div class="shop-area__img-link">
          <div class="shop-area__img-skeleton"></div>
        </div>
      </div>
      <div class="tp-product-content-5 mt-4 mb-2">
        <div class="skeleton-title"></div>
        <div class="skeleton-summary"></div>
      </div>
      <div class="skeleton-button"></div>
    </div>

    <!-- Actual content -->
    <template v-else-if="product">
      <div class="tp-product-thumb-5 w-img fix mb-15">
          <nuxt-link :href="`/product-details/${product.id}`" class="shop-area__img-link">
            <img 
              :src="product.image" 
              :alt="product.name"
              :aria-label="product.name"
              :title="product.name"
              loading="lazy"
              decoding="async"
              class="shop-area__img"
            />
          </nuxt-link>
      </div>
      <div class="tp-product-content-5 mt-4 mb-2">
          <h3 class="tp-product-title-5 text-center font-weight-bold">
            <nuxt-link :href="`/product-details/${product.id}`">{{ product.name }}</nuxt-link>
          </h3>
          <p class="text-center text-truncate px-4">{{ product.summary }}</p>
      </div>
      <div>
        <a 
        :href="`https://wa.me/919826000000?text=Halo, saya ingin memesan produk ${product.name}`" 
        class="tp-product-pesan-sekarang">
          <Icon name="ri:whatsapp-fill" style="font-size: 1.2rem;" />
          <span>Pesan Sekarang</span>
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/pinia/useCartStore';
import { useCompareStore } from '@/pinia/useCompareStore';
import { useUtilityStore } from '@/pinia/useUtilityStore';
import { useWishlistStore } from '@/pinia/useWishlistStore';
import type { IProduct } from '@/types/product-d-t';
import type { Product } from '@/types/products-api-type';
import type { DeepReadonly } from 'vue';

const props = defineProps<{
  product?: DeepReadonly<Product>
  isLoading?: boolean
  }>();

  // console.log(product);
  console.log(props.product);

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

<style scoped>
.shop-area__img-link {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  background-color: #f2f3f5;
}
.shop-area__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Loading skeleton styles */
.loading-placeholder {
  animation: pulse 1.5s ease-in-out infinite;
}

.shop-area__img-skeleton {
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 12px;
  width: 80%;
}

.skeleton-summary {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 16px;
  width: 90%;
}

.skeleton-button {
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
  margin: 0 auto;
  width: 60%;
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
</style>