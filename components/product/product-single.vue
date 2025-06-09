<template>
 <div class="tp-product-item-5 p-relative white-bg mb-40">
    <div class="tp-product-thumb-5 w-img fix mb-15">
        <nuxt-link :href="`/product-details/${product.id}`">
          <img :src="product.images[0]" alt="product-image">
        </nuxt-link>

        <!-- product action -->
        <div class="tp-product-action-2 tp-product-action-5 tp-product-action-greenStyle">
          <div class="tp-product-action-item-2 d-flex flex-column">
          <button
            v-if="!isItemInCart(product)"
            @click="cartStore.addCartProduct(product)"
            type="button" :class="`tp-product-action-btn-2 tp-product-add-cart-btn ${isItemInCart(product)? 'active': ''}`"
          >
            <svg-add-cart />
            <span class="tp-product-tooltip tp-product-tooltip-right">Add to Cart</span>
          </button>
          <nuxt-link
            v-if="isItemInCart(product)"
            href="/cart"
            :class="`tp-product-action-btn-2 tp-product-add-cart-btn ${isItemInCart(product)? 'active': ''}`"
          >
            <svg-add-cart />
            <span class="tp-product-tooltip tp-product-tooltip-right">View Cart</span>
          </nuxt-link>

          <button
            type="button"
            class="tp-product-action-btn-2 tp-product-quick-view-btn"
            data-bs-toggle="modal"
            :data-bs-target="`#${utilityStore.modalId}`"
            @click="utilityStore.handleOpenModal(`product-modal-${product.id}`,product)"
          >
            <svg-quick-view />
            <span class="tp-product-tooltip tp-product-tooltip-right">Quick View</span>
          </button>

          <button
            @click="wishlistStore.add_wishlist_product(product)"
            type="button"
            :class="`tp-product-action-btn-2 tp-product-add-to-wishlist-btn ${isItemInWishlist(product) ? 'active': ''}`"
          >
            <svg-wishlist />
            <span class="tp-product-tooltip tp-product-tooltip-right">
              {{isItemInWishlist(product) ? 'Remove From Wishlist' : 'Add To Wishlist'}}
            </span>
          </button>

          <button
            @click="compareStore.add_compare_product(product)"
            type="button"
            :class="`tp-product-action-btn-2 tp-product-add-to-compare-btn ${isItemInCompare(product) ? 'active': ''}`"
          >
            <svg-compare-2 />
            <span class="tp-product-tooltip tp-product-tooltip-right">
              {{ isItemInCompare(product) ? 'Remove From Compare' : 'Add To Compare' }}
            </span>
          </button>
          </div>
        </div>
    </div>
    <div class="tp-product-content-5">
        <div class="tp-product-tag-5">
          <span><a href="#">{{ product.children }} </a></span>
        </div>
        <h3 class="tp-product-title-5">
          <nuxt-link :href="`/product-details/${product.id}`">{{ product.name }}</nuxt-link>
        </h3>
        <div class="tp-product-rating-5">
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star"></i></span>
          <span><i class="fa-solid fa-star-half-stroke"></i></span>
        </div>
        <div class="tp-product-price-wrapper-5">
          <div v-if="product.discount > 0">
            <span class="tp-product-price-5 new-price">
              ${{(Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2)}} {{ " " }}
            </span>
            <span class="tp-product-price-5 old-price">
              ${{ product.price }}
            </span>
          </div>
          <span v-else class="tp-product-price-5 new-price">${{ product.price.toFixed(2) }}</span>
        </div>
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
