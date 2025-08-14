<template>
  <div>
    <breadcrumb-with-image title="Products" :subtitle="['Home', 'Products']" color="#FFFFFF" />

    <shop-area />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "Products List Page" });
</script>
