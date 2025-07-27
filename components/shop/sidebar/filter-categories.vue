<template>  
  <div class="tp-shop-widget mb-50">
    <h3 class="tp-shop-widget-title">Product Categories</h3>
    <div v-if="pendingCategories" class="d-flex justify-content-center align-items-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="errorCategories" class="alert alert-danger">{{ errorCategories }}</div>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-categories">
      <ul>
        <li v-for="category in categoriesData" :key="category.id">
          <div class="filter-item checkbox">
            <input 
              type="checkbox"
              :id="category.id"
              class="filter-checkbox-input"
              :checked="isCategoryActive(category.id)"
              @change="(e) => handleCategoryRoute(category.id, e)"
            />
            <label :for="category.id">
              {{ category.name }}
              <!-- <span>({{ category.products.length }})</span> -->
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div> 
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { useCategoriesApi } from "../../../composables/useCategoriesApi";
// import category_data from "@/data/category-data";
const router = useRouter();
const route = useRoute();
const activeCategories = ref<string>("");
const { categoriesData, error: errorCategories, pending: pendingCategories, hasData: hasCategoriesData, refreshData } = useCategoriesApi();

// handle category route
const handleCategoryRoute = (categoryId: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  // Use actual category ID instead of slug
  const currentCategories = target.checked ? categoryId : '';
  activeCategories.value = currentCategories;
  
  router.push({
    path: '/products', 
    query: {
      category: currentCategories
    }
  });
};

// Check if category is active
const isCategoryActive = (categoryId: string): boolean => {
  return activeCategories.value === categoryId;
};

watch(
  () => route.query,
  (newQuery) => {
    const categoryParam = newQuery.category as string;
    if (categoryParam) {
      // Parse category IDs from comma-separated string
      activeCategories.value = categoryParam;
    } else {
      activeCategories.value = "";
    }
  }
);

onMounted(() => {
  const categoryParam = route.query.category as string;
  if (categoryParam) {
    // Parse category IDs from comma-separated string
    activeCategories.value = categoryParam;
  }
});
</script>
