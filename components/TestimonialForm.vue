<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Buat Testimoni Baru</h2>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Profile Picture URL -->
      <div>
        <label for="pic" class="block text-sm font-medium text-gray-700 mb-2">
          URL Foto Profil *
        </label>
        <input
          id="pic"
          v-model="formData.pic"
          type="url"
          required
          placeholder="https://example.com/photo.jpg"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Nama *
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <!-- Profession -->
      <div>
        <label for="profession" class="block text-sm font-medium text-gray-700 mb-2">
          Profesi *
        </label>
        <input
          id="profession"
          v-model="formData.profession"
          type="text"
          required
          placeholder="Contoh: CEO, Manager, Developer"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Pesan Testimoni *
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          rows="4"
          placeholder="Tulis testimoni Anda tentang layanan kami..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
      
      <!-- Status -->
      <div>
        <label class="flex items-center">
          <input
            v-model="formData.status"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="ml-2 text-sm text-gray-700">
            Aktifkan testimoni ini
          </span>
        </label>
      </div>
      
      <!-- Submit Button -->
      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Membuat Testimoni...
          </span>
          <span v-else>
            Buat Testimoni
          </span>
        </button>
        
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreateTestimonialRequest } from '@/types/testimonial-api-type'

// Use the testimonial management composable
const { createTestimonial, isLoading, error, successMessage, clearMessages } = useTestimonialManagement()

// Form data
const formData = ref<CreateTestimonialRequest>({
  pic: '',
  name: '',
  profession: '',
  message: '',
  status: true
})

// Handle form submission
const handleSubmit = async () => {
  try {
    clearMessages()
    
    const result = await createTestimonial(formData.value)
    
    if (result) {
      // Reset form on success
      resetForm()
      
      // Emit success event
      emit('testimonial-created', result)
    }
  } catch (err) {
    console.error('Failed to create testimonial:', err)
  }
}

// Reset form
const resetForm = () => {
  formData.value = {
    pic: '',
    name: '',
    profession: '',
    message: '',
    status: true
  }
  clearMessages()
}

// Emit events
const emit = defineEmits<{
  'testimonial-created': [testimonial: any]
}>()

// Clear messages when component unmounts
onUnmounted(() => {
  clearMessages()
})
</script>
