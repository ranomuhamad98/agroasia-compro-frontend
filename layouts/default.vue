<template>
  <div v-if="!$route.meta.layout">
    <Header></Header>
    <main>
      <slot />
    </main>
    <Footer></Footer>
    <modal-product/>
    <back-to-top />
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>
