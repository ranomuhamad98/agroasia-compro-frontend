<template>
  <div>
    <breadcrumb-with-image title="About Us" :subtitle="['Home','About Us']" color="var(--tp-common-white)" />
    <about-know-more />
    <about-with-video />
    <about-petani-kami />
    <about-our-values />
    <about-galleries />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "About Page" });
</script>
