<template>
  <div>
    <breadcrumb-with-image title="Products" :subtitle="['Home', 'Products']" color="#FFFFFF" />
    <!-- <div class="d-flex align-items-center justify-content-start position-relative tp-shop-top-banner">
      <div class="container">
        <breadcrumb title="Products" subtitle="Home > Products" color="#FFFFFF" />
      </div>
      <div class="min-h-300 w-100 position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5);">
        <lazy-nuxt-img src="/images/product/list/bg.png" alt="products-banner" width="100%" height="300"
          class="object-fit-cover h-100 w-100" />
      </div>
    </div> -->
    <!-- breadcrumb start -->
    <!-- breadcrumb end -->

    <!-- shop area start -->
    <shop-area />
    <!-- shop area end -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "Products List Page" });
</script>
