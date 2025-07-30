<template>
  <main>
    <!-- Loading State -->
    <div v-if="isPending || isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="ms-3">
        <p class="mb-0">Loading home data...</p>
        <small class="text-muted">Fetching from API...</small>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container my-5">
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="me-3">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1">
          <h5 class="alert-heading mb-2">Unable to Load Content</h5>
          <p class="mb-2">{{ error }}</p>
          <button @click="refresh" class="btn btn-outline-danger btn-sm" :disabled="isPending">
            <i class="fas fa-refresh me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="hasData">
      <home-hero :slides="slider"></home-hero>
      <home-about-us :about-us="aboutUs"></home-about-us>
      <home-category-list :categories="categories"></home-category-list>
      <home-top-product 
        :top-products="topProducts" 
        :top-product-section="topProductSection"
      ></home-top-product>
      <home-programs :program="program"></home-programs>
      <home-spotlight :featured="featured"></home-spotlight>
      <home-testimoni :testimonials="testimonials"></home-testimoni>
      <home-faq :faq="faq" :header="header"></home-faq>
    </template>

    <!-- Fallback when no data -->
    <div v-else class="container my-5">
      <div class="alert alert-warning text-center" role="alert">
        <h5 class="alert-heading">No Content Available</h5>
        <p>Please check back later or contact support if this problem persists.</p>
        <button @click="refresh" class="btn btn-outline-warning btn-sm">
          <i class="fas fa-refresh me-2"></i>
          Refresh
        </button>
      </div>
    </div>
    
    <!-- Debug Component (only in development) -->
    <!-- <debug-api-status /> -->
  </main>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({ title: "Agro Asia Berdikari" });

// Use the home API composable
const { 
  homeData, 
  aboutUs, 
  categories, 
  topProducts, 
  topProductSection,
  program, 
  featured, 
  testimonials, 
  faq, 
  slider,
  header,
  isLoading, 
  isPending, 
  error, 
  hasData,
  refresh 
} = useHomeApi();

// Debug current state on mount
onMounted(() => {
  
  // Force refresh if no data after mount
  nextTick(() => {
    if (!hasData.value && !isPending.value && !error.value) {
      console.log('🔄 No data found, forcing refresh...');
      refresh();
    }
  });
});
</script>
