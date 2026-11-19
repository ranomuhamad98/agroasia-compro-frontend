<template>
  <div class="d-flex align-items-center justify-content-start position-relative tp-shop-top-banner">
    <div class="container">
      <section class="breadcrumb__area include-bg pt-100 pb-50" :style="`background-color:${bg_clr && '#EFF1F5'}`">
        <div class="container">
          <div class="row">
            <div class="col-xxl-12">
              <div :class="`breadcrumb__content p-relative z-index-1 ${center && 'text-center'}`">
                <h3 class="breadcrumb__title" :style="`color:${color}`">{{ title }}</h3>
                <nav class="breadcrumb-trail" :style="`color:${color}`" aria-label="Breadcrumb">
                  <template v-for="(item, index) in subtitle" :key="`${item}-${index}`">
                    <nuxt-link v-if="index !== subtitle.length - 1" :to="crumbLink(item)" class="breadcrumb-items">{{ item }}</nuxt-link>
                    <span v-else class="breadcrumb-items is-current">{{ item }}</span>
                    <svg v-if="index !== subtitle.length - 1" class="breadcrumb-separator" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.42L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.58-4.58a1 1 0 0 0 0-1.42L10.71 6.7a1 1 0 0 0-1.42 0Z"/>
                    </svg>
                  </template>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="min-h-300 w-100 position-absolute top-0 start-0 w-100 h-100"
      style="background-color: rgba(0, 0, 0, 0.5);">
      <img :src="image || '/images/product/list/bg.png'" alt="products-banner" width="100%" height="300"
        class="object-fit-cover h-100 w-100" loading="lazy" decoding="async" />
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
  image?: string;
}>();

const crumbLink = (item: string) => {
  if (item === 'Home') return '/'
  if (item === 'Products') return '/products'
  return '/'
}
</script>

<style scoped>
.breadcrumb-trail {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.breadcrumb-items {
  color: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  text-decoration: none;
}

a.breadcrumb-items:hover {
  text-decoration: underline;
}

.breadcrumb-items.is-current {
  opacity: 0.9;
}

.breadcrumb-separator {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: block;
}
</style>