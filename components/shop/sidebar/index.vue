<template>
  <div class="tp-shop-sidebar mr-10">
    <div class="tp-shop-widget mb-50">
      <h3 class="tp-shop-widget-title">Product Categories</h3>
      <shop-sidebar-filter-categories />
    </div>
    <hr class="my-4">
    <div class="tp-shop-widget mb-35">
      <h3 class="tp-shop-widget-title no-border">Price/SQ Ft Filter</h3>
      <shop-sidebar-price-filter />
    </div>
    <!-- reset filter start -->
    <shop-sidebar-reset-filter/>
    <!-- reset filter end -->
  </div>
</template>

<script setup lang="ts">
</script>
