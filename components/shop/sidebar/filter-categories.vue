<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-categories">
      <ul>
        <li v-for="category in category_data" :key="category.id">
          <div class="filter-item checkbox">
            <input 
              type="checkbox"
              :id="category.parentName"
              class="filter-checkbox-input"
              :checked="activeQuery === category.parentName.toLowerCase().replace('&', '').split(' ').join('-')"
              @change="handleCategoryRoute(category.parentName)"
            />
            <label :for="category.parentName">
              {{ category.parentName }}
              <span>({{ category.products.length }})</span>
            </label>
          </div>
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
    activeQuery.value = newStatus.category as string || "";
  }
);
onMounted(() => {
  activeQuery.value = route.query.category as string || "";
});
</script>
