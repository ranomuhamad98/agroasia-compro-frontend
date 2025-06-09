<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-filter price__slider">
      <div id="slider-range" class="mb-10">
        <Slider
          :value="store.priceValues"
          :tooltips="false"
          @change="store.handlePriceChange"
          :max="store.maxProductPrice"
        />
      </div>
      <div
        class="tp-shop-widget-filter-info d-flex align-items-center justify-content-between"
      >
        <span class="input-range">
          ${{ store.priceValues[0] }} - ${{ store.priceValues[1] }}
        </span>
        <button
          @click="handlePriceFilter"
          class="tp-shop-widget-filter-btn"
          type="button"
        >
          Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
const store = useProductFilterStore();
const router = useRouter();
const route = useRoute();

const handlePriceFilter = () => {
  const price_query = `minPrice=${store.priceValues[0]}&maxPrice=${store.priceValues[1]}`
    router.push(`/shop?${price_query}`);
};

onMounted(() => {
  if (route.query.minPrice && route.query.maxPrice) {
    store.priceValues = [
      Number(route.query.minPrice),
      Number(route.query.maxPrice),
    ];
  }
});
</script>
