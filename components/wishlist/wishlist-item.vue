<template>
  <tr>
    <!-- img -->
    <td class="tp-cart-img">
      <nuxt-link :href="`/product-details/${item.id}`" style="background-color: #F2F3F5;display: block;">
        <img :src="item.images[0]" alt="image"/>
      </nuxt-link>
    </td>
    <!-- title -->
    <td class="tp-cart-title">
      <nuxt-link :href="`/product-details/${item.id}`">{{item.name}}</nuxt-link>
    </td>
    <!-- price -->
    <td class="tp-cart-price"><span>${{item.price.toFixed(2)}}</span></td>

    <td class="tp-cart-add-to-cart">
      <button v-if="!isItemInCart(item)" @click="cartStore.addCartProduct(item)" type="button" class="tp-btn tp-btn-2 tp-btn-blue">
        Add To Cart
      </button>
      <nuxt-link v-if="isItemInCart(item)" :href="`/cart`" class="tp-btn tp-btn-2 tp-btn-blue">
        View Cart
      </nuxt-link>
    </td>

    <!-- action -->
    <td class="tp-cart-action">
      <button class="tp-cart-action-btn" @click="wishlistStore.removeWishlist(item)">
        <svg-remove />
        <span>Remove</span>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useWishlistStore } from "@/pinia/useWishlistStore";
import { useCartStore } from "@/pinia/useCartStore";
import { type IProduct } from '@/types/product-d-t';
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

const props = defineProps<{item:IProduct}>()

function isItemInCart(product: IProduct) {
  return cartStore.cart_products.some((prd) => prd.id === product.id);
}
</script>
