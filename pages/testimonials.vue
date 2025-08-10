<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Testimonials Demo</h1>
        <p class="text-gray-600">Demonstrating the testimonials API with different filter options</p>
      </div>

      <!-- Filter Controls -->
      <div class="mb-6 p-6 bg-white rounded-lg shadow-sm border">
        <h2 class="text-lg font-semibold mb-4">Filter Options</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="loadAllTestimonials"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              filterType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            All Testimonials
          </button>
          <button 
            @click="loadActiveTestimonials"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              filterType === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Active Only
          </button>
          <button 
            @click="loadInactiveTestimonials"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              filterType === 'inactive' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Inactive Only
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading testimonials...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Testimonials Grid -->
      <div v-if="testimonials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-start space-x-4">
            <img 
              :src="testimonial.pic || '/placeholder.svg?height=60&width=60'" 
              :alt="testimonial.name"
              class="w-15 h-15 rounded-full object-cover border-2 border-gray-200" 
            />
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ testimonial.name }}</h3>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full',
                  testimonial.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                ]">
                  {{ testimonial.status ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <p class="text-sm font-medium text-gray-600 mb-2">{{ testimonial.profession }}</p>
              <p class="text-sm text-gray-700 leading-relaxed">{{ testimonial.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center py-12">
        <div class="text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ filterType === 'all' ? 'No testimonials available.' : `No ${filterType} testimonials found.` }}
          </p>
        </div>
      </div>

      <!-- API Info -->
      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">API Information</h2>
        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Current Filter:</strong> {{ filterType }}</p>
          <p><strong>Total Testimonials:</strong> {{ testimonials.length }}</p>
          <p><strong>Active Testimonials:</strong> {{ activeCount }}</p>
          <p><strong>Inactive Testimonials:</strong> {{ inactiveCount }}</p>
        </div>
        
        <div class="mt-4 p-4 bg-white rounded border">
          <h3 class="font-semibold mb-2">API Endpoints Used:</h3>
          <div class="space-y-1 text-sm font-mono text-gray-700">
            <div>GET /api/testimonials (all testimonials)</div>
            <div>GET /api/testimonials?active_only=true (active only)</div>
            <div>GET /api/testimonials?active_only=false (inactive only)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTestimonialManagement } from '@/composables/useTestimonialManagement'

// Use the testimonial management composable
const { 
  getTestimonials, 
  isLoading, 
  error, 
  successMessage 
} = useTestimonialManagement()

// Reactive state
const testimonials = ref([])
const filterType = ref('all')

// Computed properties
const activeCount = computed(() => testimonials.value.filter(t => t.status).length)
const inactiveCount = computed(() => testimonials.value.filter(t => !t.status).length)

// Load all testimonials
const loadAllTestimonials = async () => {
  filterType.value = 'all'
  testimonials.value = await getTestimonials()
}

// Load active testimonials only
const loadActiveTestimonials = async () => {
  filterType.value = 'active'
  testimonials.value = await getTestimonials(true)
}

// Load inactive testimonials only
const loadInactiveTestimonials = async () => {
  filterType.value = 'inactive'
  testimonials.value = await getTestimonials(false)
}

// Load testimonials on page mount
onMounted(async () => {
  await loadAllTestimonials()
})
</script>
