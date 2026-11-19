<template>
  <div class="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
    <div class="tp-product-details-thumb-wrapper-inner">
      <nav>
        <div class="nav nav-tabs" id="productDetailsNavThumb" role="tablist">
          <button v-for="(img, i) in product.gallery" :key="i"
            :class="`nav-link ${img.image === activeImage ? 'active' : ''}`"
            @click="handleImageActive(img.image)">
            <img :src="img.image" alt="nav-img" />
          </button>
        </div>
      </nav>
      <div class="tab-content m-img" id="productDetailsNavContent">
        <div class="tp-product-details-nav-main-thumb w-[calc(100vw-4rem)] lg:w-[calc(50vw-150px)]" style="background-color: #f5f6f8">
          <img :src="activeImage" alt="prd-image" />
          <button class="nav-arrow prev" @click="handlePrevImage" v-if="product.gallery && product.gallery.length > 1">
            <Icon name="mdi:chevron-left" class="icon" />
          </button>
          <button class="nav-arrow next" @click="handleNextImage" v-if="product.gallery && product.gallery.length > 1">
            <Icon name="mdi:chevron-right" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductDetail } from "@/types/product-detail-api-types";
import type { DeepReadonly } from "vue";

const props = defineProps<{ product: DeepReadonly<ProductDetail> }>();

const activeImage = ref<string>('');

onMounted(() => {
  if (props.product.gallery) {
    activeImage.value = props.product.gallery.find(img => img.status === 'main')?.image || '';
  }
});

// const mainImage = computed(() => {
//   if (!props.product.gallery) return '';
//   const mainImage = props.product.gallery.find(img => img.status === 'main')?.image;
//   if (activeImage.value === '') activeImage.value = mainImage || '';
//   return mainImage;
// });

// Add navigation functions
const handleNextImage = () => {
  if (props.product.gallery.length === 1) return;
  const currentIndex = props.product.gallery.findIndex(img => img.image === activeImage.value);
  const nextIndex = (currentIndex + 1) % props.product.gallery.length;
  activeImage.value = props.product.gallery[nextIndex].image;
};

const handlePrevImage = () => {
  if (props.product.gallery.length === 1) return;
  const currentIndex = props.product.gallery.findIndex(img => img.image === activeImage.value);
  const prevIndex = (currentIndex - 1 + props.product.gallery.length) % props.product.gallery.length;
  activeImage.value = props.product.gallery[prevIndex].image;
};

const handleImageActive = (image_link: string) => {
  activeImage.value = image_link;
};
</script>

<style scoped>
.tp-product-details-nav-main-thumb {
  position: relative;
  height: calc(100vh - 120px);
  overflow: hidden;
  img {
    width: 100%;
    height: calc(100vh - 120px);
    object-fit: contain;
  }
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
