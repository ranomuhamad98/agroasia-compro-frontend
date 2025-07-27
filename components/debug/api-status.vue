<template>
  <div v-if="showDebug" class="position-fixed bottom-0 end-0 m-3" style="z-index: 9999;">
    <div class="card border-primary" style="min-width: 300px;">
      <div class="card-header bg-primary text-white py-2">
        <small class="fw-bold">🔧 API Debug Status</small>
        <button @click="showDebug = false" class="btn-close btn-close-white float-end" style="font-size: 0.7rem;"></button>
      </div>
      <div class="card-body p-2">
        <div class="row g-1 text-small">
          <div class="col-6">
            <strong>Status:</strong><br>
            <span :class="getStatusClass()">{{ getStatusText() }}</span>
          </div>
          <div class="col-6">
            <strong>Data:</strong><br>
            <span class="text-muted">{{ hasData ? '✅ Loaded' : '❌ No Data' }}</span>
          </div>
          <div class="col-6">
            <strong>Loading:</strong><br>
            <span :class="isPending ? 'text-warning' : 'text-muted'">
              {{ isPending ? '⏳ Loading...' : '✅ Ready' }}
            </span>
          </div>
          <div class="col-6">
            <strong>Error:</strong><br>
            <span :class="error ? 'text-danger' : 'text-muted'">
              {{ error ? '❌ Error' : '✅ OK' }}
            </span>
          </div>
        </div>
        
        <hr class="my-2">
        
        <div v-if="hasData" class="text-small">
          <strong>Data Summary:</strong><br>
          <ul class="mb-0 ps-3">
            <li>Categories: {{ categories.length }}</li>
            <li>Products: {{ topProducts.length }}</li>
            <li>FAQ: {{ faq.length }}</li>
          </ul>
        </div>
        
        <div v-if="error" class="text-danger text-small">
          <strong>Error Details:</strong><br>
          <code style="font-size: 0.7rem;">{{ error }}</code>
        </div>
        
        <button @click="refresh" class="btn btn-sm btn-outline-primary w-100 mt-2" :disabled="isPending">
          <i class="fas fa-refresh me-1"></i>
          {{ isPending ? 'Loading...' : 'Refresh API' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get API status from the home API composable
const { 
  categories, 
  topProducts, 
  faq, 
  isPending, 
  error, 
  hasData,
  refresh 
} = useHomeApi();

// Debug panel visibility
const showDebug = ref(true);

// Status helpers
const getStatusClass = () => {
  if (isPending.value) return 'text-warning';
  if (error.value) return 'text-danger';
  if (hasData.value) return 'text-success';
  return 'text-muted';
};

const getStatusText = () => {
  if (isPending.value) return '⏳ Loading';
  if (error.value) return '❌ Error';
  if (hasData.value) return '✅ Success';
  return '❓ Unknown';
};

// Show debug panel only in development
onMounted(() => {
  // Hide in production
  if (process.env.NODE_ENV === 'production') {
    showDebug.value = false;
  }
  
  // Log API status
  console.log('🔧 API Debug component mounted');
});
</script>

<style scoped>
.card {
  font-size: 0.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-small {
  font-size: 0.75rem;
}

ul {
  font-size: 0.7rem;
}
</style> 