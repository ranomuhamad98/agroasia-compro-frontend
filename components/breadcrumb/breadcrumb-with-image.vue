<template>
  <div class="d-flex align-items-center justify-content-start position-relative tp-shop-top-banner">
    <div class="container">
      <section class="breadcrumb__area include-bg pt-100 pb-50" :style="`background-color:${bg_clr && '#EFF1F5'}`">
        <div class="container">
          <div class="row">
            <div class="col-xxl-12">
              <div :class="`breadcrumb__content p-relative z-index-1 ${center && 'text-center'}`">
                <h3 class="breadcrumb__title" :style="`color:${color}`">{{ title }}</h3>
                <div class="d-flex align-items-center justify-content-start gap-2 flex-wrap">
                  <span v-for="(item, index) in subtitle" :key="item" :style="`color:${color}`" class="breadcrumb-items">{{ item }}
                    <span v-if="index !== subtitle.length - 1" class="breadcrumb-separator"> <Icon name="mdi:chevron-right" /></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="min-h-300 w-100 position-absolute top-0 start-0 w-100 h-100"
      style="background-color: rgba(0, 0, 0, 0.5);">
      <lazy-nuxt-img src="/images/product/list/bg.png" alt="products-banner" width="100%" height="300"
        class="object-fit-cover h-100 w-100" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string[];
  bg_clr?: boolean;
  center?: boolean;
  color?: string;
}>();
</script>

<style scoped>
.breadcrumb-items {
  font-size: 1rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-separator {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>