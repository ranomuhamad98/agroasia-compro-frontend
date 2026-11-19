<template>
  <div class="tp-shop-widget mb-50">
    <h3 class="tp-shop-widget-title">Highlight</h3>
    <div class="tp-shop-widget-content">
      <div class="tp-shop-widget-categories">
        <ul>
          <li>
            <div class="filter-item checkbox">
              <input
                id="top-products"
                type="checkbox"
                class="filter-checkbox-input"
                :checked="isTop"
                @change="toggleTop"
              />
              <label for="top-products">Top products</label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const isTop = computed(() => route.query.top === '1');

const toggleTop = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  const query = { ...route.query };
  if (checked) query.top = '1';
  else delete query.top;
  router.push({ path: '/products', query });
};
</script>
