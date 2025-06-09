<template>
  <div class="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
    <nav>
      <div
        class="nav nav-tabs flex-sm-column"
        id="productDetailsNavThumb"
        role="tablist"
      >
        <button
          v-for="(img, i) in product.images"
          :key="i"
          @click="productStore.handleImageActive(img)"
          :class="`nav-link ${img === productStore.activeImg ? 'active' : ''}`"
        >
          <img :src="img" alt="nav-img" />
        </button>
      </div>
    </nav>
    <div class="tab-content m-img" id="productDetailsNavContent">
        <div
          class="tp-product-details-nav-main-thumb"
          style="background-color: #f5f6f8"
        >
          <img :src="productStore.activeImg" alt="prd-image" />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';
import { useProductStore } from "@/pinia/useProductStore";
import { useUtilityStore } from "@/pinia/useUtilityStore";
// props
defineProps<{ product: IProduct }>();

const productStore = useProductStore();
const utilsStore = useUtilityStore();
</script>
