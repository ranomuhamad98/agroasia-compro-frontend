<template>
  <div class="tp-shop-widget mb-50">
    <h3 class="tp-shop-widget-title">Search Product</h3>
    <form class="product-search" @submit.prevent="applySearch">
      <input
        v-model="text"
        type="search"
        class="form-control"
        placeholder="Name or description"
        aria-label="Search products"
      />
      <button type="submit" class="tp-btn">Search</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const text = ref(typeof route.query.q === 'string' ? route.query.q : '');

watch(() => route.query.q, (value) => {
  text.value = typeof value === 'string' ? value : '';
});

const applySearch = () => {
  const query = { ...route.query };
  const keyword = text.value.trim();
  if (keyword) query.q = keyword;
  else delete query.q;
  router.push({ path: '/products', query });
};
</script>

<style scoped>
.product-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-search .form-control {
  height: 46px;
  border-radius: 8px;
}

.product-search .tp-btn {
  border: 0;
  border-radius: 30px;
}
</style>
