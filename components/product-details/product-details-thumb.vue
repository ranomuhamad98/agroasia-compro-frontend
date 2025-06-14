<template>
  <div class="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
    <div class="tp-product-details-thumb-wrapper-inner">
      <nav>
        <div class="nav nav-tabs" id="productDetailsNavThumb" role="tablist">
          <button v-for="(img, i) in product.images" :key="i" @click="productStore.handleImageActive(img)"
            :class="`nav-link ${img === productStore.activeImg ? 'active' : ''}`">
            <img :src="img" alt="nav-img" />
          </button>
        </div>
      </nav>
      <div class="tab-content m-img" id="productDetailsNavContent">
        <div class="tp-product-details-nav-main-thumb" style="background-color: #f5f6f8">
          <img :src="productStore.activeImg" alt="prd-image" />
          <button class="nav-arrow prev" @click="handlePrevImage" v-if="product.images.length > 1">
            <Icon name="mdi:chevron-left" class="icon" />
          </button>
          <button class="nav-arrow next" @click="handleNextImage" v-if="product.images.length > 1">
            <Icon name="mdi:chevron-right" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';
import { useProductStore } from "@/pinia/useProductStore";
import { useUtilityStore } from "@/pinia/useUtilityStore";

const productStore = useProductStore();
const utilsStore = useUtilityStore();

// Get the product prop
const props = defineProps<{ product: IProduct }>();

// Add navigation functions
const handleNextImage = () => {
  console.log(props.product.images);
  const currentIndex = props.product.images.indexOf(productStore.activeImg);
  const nextIndex = (currentIndex + 1) % props.product.images.length;
  productStore.handleImageActive(props.product.images[nextIndex]);
};

const handlePrevImage = () => {
  const currentIndex = props.product.images.indexOf(productStore.activeImg);
  const prevIndex = (currentIndex - 1 + props.product.images.length) % props.product.images.length;
  productStore.handleImageActive(props.product.images[prevIndex]);
};
</script>

<style scoped>
.tp-product-details-nav-main-thumb {
  position: relative;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid #80B500;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;

  .icon {
    color: #80B500;
    font-size: 1.5rem;
  }

  &:hover {
    background: #80B500;
    .icon {
      color: #FFFFFF;
    }
  }
}

.nav-arrow.prev {
  left: 10px;
}

.nav-arrow.next {
  right: 10px;
}

.nav-arrow i {
  font-size: 16px;
  color: #333;
}
</style>
