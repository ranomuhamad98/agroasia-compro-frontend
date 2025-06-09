<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-categories">
      <ul>
        <li v-for="category in category_data" :key="category.id">
          <a
            @click.prevent="handleCategoryRoute(category.parentName)"
            :class="`pointer ${
              activeQuery ===
              category.parentName.toLowerCase().replace('&', '').split(' ').join('-')
                ? 'active'
                : ''
            }`"
          >
            {{ category.parentName }}
            <span>{{ category.products.length }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import category_data from "@/data/category-data";
const router = useRouter();
const route = useRoute();
const activeQuery = ref<string>("");

// handle category route
const handleCategoryRoute = (value: string) => {
  const newCategory = value.toLowerCase().replace("&", "").split(" ").join("-");
    router.push(`/shop?category=${newCategory}`);
};
watch(
  () => route.query,
  (newStatus) => {
    activeQuery.value = newStatus.category;
  }
);
onMounted(() => {
  activeQuery.value = route.query.category;
});
</script>
