<template>
  <div class="tp-shop-widget-content">
    <div
      class="tp-shop-widget-brand-list d-flex align-items-center justify-content-between flex-wrap"
    >
      <div
        v-for="item in brands_data"
        :key="item.id"
        class="tp-shop-widget-brand-item"
      >
        <a
          @click.prevent="handleBrandRoute(item.name)"
          v-if="item.logo"
          class="pointer"
        >
          <img :src="item.logo" alt="logo" />
        </a>
        <a
          @click.prevent="handleBrandRoute(item.name)"
          v-else
          class="pointer"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import brands_data from "@/data/brand-data";
const router = useRouter();

// handle Brand route
const handleBrandRoute = (value: string) => {
  const newBrand = value.toLowerCase().replace("&", "").split(" ").join("-");
    router.push(`/shop?brand=${newBrand}`);
};
</script>
