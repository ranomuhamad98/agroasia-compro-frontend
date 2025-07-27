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
              @change="handleCategoryRoute(category.id)"
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
const activeCategories = ref<string[]>([]);
const { categoriesData, error: errorCategories, pending: pendingCategories, hasData: hasCategoriesData, refreshData } = useCategoriesApi();

// handle category route
const handleCategoryRoute = (categoryId: string) => {
  const categorySlug = categoryId.toLowerCase().replace("&", "").split(" ").join("-");
  
  // Toggle category in selection
  const currentIndex = activeCategories.value.indexOf(categorySlug);
  if (currentIndex > -1) {
    // Remove category if already selected
    activeCategories.value.splice(currentIndex, 1);
  } else {
    // Add category if not selected
    activeCategories.value.push(categorySlug);
  }
  
  // Update URL with multiple categories
  const query = { ...route.query };
  if (activeCategories.value.length > 0) {
    query.category = activeCategories.value.join(',');
  } else {
    delete query.category;
  }
  
  router.push({ 
    path: '/products', 
    query 
  });
};

// Check if category is active
const isCategoryActive = (categoryId: string): boolean => {
  const categorySlug = categoryId.toLowerCase().replace("&", "").split(" ").join("-");
  return activeCategories.value.includes(categorySlug);
};

watch(
  () => route.query,
  (newQuery) => {
    const categoryParam = newQuery.category as string;
    if (categoryParam) {
      activeCategories.value = categoryParam.split(',').filter(Boolean);
    } else {
      activeCategories.value = [];
    }
  }
);

onMounted(() => {
  const categoryParam = route.query.category as string;
  if (categoryParam) {
    activeCategories.value = categoryParam.split(',').filter(Boolean);
  } else {
    activeCategories.value = [];
  }
});
</script>
