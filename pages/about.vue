<template>
  <div>
    <breadcrumb-with-image title="About Us" :subtitle="['Home','About Us']" color="var(--tp-common-white)" />
    
    <about-know-more />
    <!-- about area start -->
    <!-- <about-area/> -->
    <!-- about area end -->

    <!-- counter area start -->
    <!-- <counter-area/>
    <!-- counter area end -->

    <!-- history area start -->
    <!-- <history-area/> -->
    <!-- history area end -->

    <!-- work area start -->
    <!-- <work-area/> -->
    <!-- work area end -->

    <!-- author area start -->
    <!-- <author-area/> -->
    <!-- author area end -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "About Page" });
</script>
