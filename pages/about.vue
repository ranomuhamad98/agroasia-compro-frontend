<template>
  <div v-if="hasData">
    <breadcrumb-with-image
      :title="pageTitle"
      :subtitle="['Home', pageTitle]" color="var(--tp-common-white)"
      :image="jumbotron?.image"
    />
    <about-know-more
      :milestones="milestones"
    />
    <about-with-video
      :video="video"
    />
    <about-petani-kami
      :our-people="ourPeople"
    />
    <about-our-values
      :our-values="ourValues"
    />
    <about-galleries
      :gallery="gallery"
    />
  </div>
  <div v-else>
    <div class="container my-5">
      <div class="alert alert-warning text-center" role="alert">
        <h5 class="alert-heading">No Content Available</h5>
        <p>Please check back later or contact support if this problem persists.</p>
        <button @click="refreshAboutData" class="btn btn-outline-warning btn-sm">
          <i class="fas fa-refresh me-2"></i>
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "About Page - Agro Asia Berdikari" });

const {
  jumbotron,
  video,
  milestones,
  ourPeople,
  ourValues,
  gallery,
  pending,
  error,
  hasData,
  refreshAboutData
} = useAboutApi();

const pageTitle = computed(() => {
  return jumbotron?.value?.title || 'About Us';
})

onMounted(() => {
  nextTick(() => {
    if (!hasData.value && !pending.value && !error.value) {
      console.log('🔄 No data found, forcing refresh...');
      refreshAboutData();
    }
  });
})
</script>
