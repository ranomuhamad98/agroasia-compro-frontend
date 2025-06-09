<template>
  <div class="tp-product-details-wrapper has-sticky">
    <div class="tp-product-details-category">
      <span>{{product.parentCategory}}</span>
    </div>
    <h3 class="tp-product-details-title">{{product.name}}</h3>

    <!-- inventory details -->
    <div class="tp-product-details-inventory d-flex align-items-center mb-10">
      <div class="tp-product-details-stock mb-10">
          <span>{{ product.quantity === 0 ? 'Out of Stock' : 'In Stock' }}</span>
      </div>
      <div class="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div class="tp-product-details-rating">
            <span><i class="fa-solid fa-star"></i></span>
            <span><i class="fa-solid fa-star"></i></span>
            <span><i class="fa-solid fa-star"></i></span>
            <span><i class="fa-solid fa-star"></i></span>
            <span><i class="fa-solid fa-star"></i></span>
          </div>
          <div class="tp-product-details-reviews">
            <span>({{product.reviews?.length}} Reviews)</span>
          </div>
      </div>
    </div>
    <p>{{ textMore ? product.description : `${product.description.substring(0, 100)}...` }} <span @click="textMore = !textMore">{{textMore ? 'See less' : 'See more'}}</span></p>

    <!-- price -->
    <div class="tp-product-details-price-wrapper mb-20">
      <div v-if="product.discount > 0">
        <span class="tp-product-details-price new-price">${{(Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2)}} {{ " " }}</span>
        <span class="tp-product-details-price old-price">
          ${{ product.price }}
        </span>
      </div>
      <span v-else class="tp-product-details-price new-price">${{ product.price.toFixed(2) }}</span>
   </div>

  <!-- product countdown start -->
  <div v-if="product.offerDate?.endDate">
    <product-details-countdown :product="product"/>
  </div>
  <!-- product countdown end -->

    <!-- actions -->
    <div class="tp-product-details-action-wrapper">
      <h3 class="tp-product-details-action-title">Quantity</h3>
      <div class="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          <div class="tp-product-details-quantity">
            <div class="tp-product-quantity mb-15 mr-15">
                <span class="tp-cart-minus" @click="cartStore.decrement">
                  <svg-minus/>                                                            
                </span>
                <input class="tp-cart-input" type="text" :value="cartStore.orderQuantity" disabled>
                <span class="tp-cart-plus" @click="cartStore.increment">
                  <svg-plus-sm/>
                </span>
            </div>
          </div>
          <div class="tp-product-details-add-to-cart mb-15 w-100">
            <button @click="cartStore.addCartProduct(product)" class="tp-product-details-add-to-cart-btn w-100">Add To Cart</button>
          </div>
      </div>
      <nuxt-link :href="`/product-details/${product.id}`" class="tp-product-details-buy-now-btn w-100 text-center">Buy Now</nuxt-link>
    </div>

    <div v-if="isShowBottom">
      <div class="tp-product-details-query">
      <div class="tp-product-details-query-item d-flex align-items-center">
          <span>SKU:  </span>
          <p>{{product.sku}}</p>
      </div>
      <div class="tp-product-details-query-item d-flex align-items-center">
          <span>Category:  </span>
          <p>{{product.parentCategory}}</p>
      </div>
    </div>
    <div class="tp-product-details-social">
      <span>Share: </span>
      <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
      <a href="#"><i class="fa-brands fa-twitter"></i></a>
      <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
      <a href="#"><i class="fa-brands fa-vimeo-v"></i></a>
    </div>
    <div class="tp-product-details-msg mb-15">
      <ul>
          <li>30 days easy returns</li>
          <li>Order yours before 2.30pm for same day dispatch</li>
      </ul>
    </div>
    <div class="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
      <p>Guaranteed safe <br> & secure checkout</p>
      <img src="/images/product/icons/payment-option.png" alt="">
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
const props = withDefaults(defineProps<{product:IProduct;isShowBottom?:boolean}>(), {
  isShowBottom:true,
})
let textMore = ref<boolean>(false)
</script>
