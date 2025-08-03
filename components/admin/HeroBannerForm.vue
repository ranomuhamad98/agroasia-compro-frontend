<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ banner ? 'Edit Slider' : 'Add New Slider' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the slider information below.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block">Slider Image</label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div 
                v-if="form.image" 
                class="relative w-full h-40 border-2 border-green-200 rounded-lg overflow-hidden"
              >
                <img 
                  :src="form.image" 
                  alt="Slider preview" 
                  class="w-full h-full object-cover"
                  @load="console.log('🖼️ Image loaded successfully:', form.image)"
                  @error="console.error('❌ Image failed to load:', form.image)"
                />
                <button
                  type="button"
                  @click="clearImage"
                  class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              <div 
                v-else
                class="w-full h-40 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center transition-colors"
                :class="isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-green-400'"
                @click="!isUploading && selectImage()"
              >
                <div class="text-center">
                  <ImageIcon class="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p class="text-green-600 text-sm">Click to select slider image</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              @click="selectImage"
              :disabled="isUploading"
              class="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isUploading" class="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
              <UploadIcon v-else class="w-4 h-4" />
              {{ isUploading ? 'Uploading...' : (form.image ? 'Change' : 'Upload') }}
            </button>
          </div>
          <p v-if="uploadError || mediaError" class="text-red-600 text-sm">{{ uploadError || mediaError }}</p>
          <p v-if="uploadSuccess" class="text-green-600 text-sm">✅ Image uploaded successfully!</p>
        </div>
        
        <div class="space-y-2">
          <label for="bannerTitle" class="text-green-700 font-medium block">Title</label>
          <input
            id="bannerTitle"
            v-model="form.title"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div class="space-y-2">
          <label for="bannerSubtitle" class="text-green-700 font-medium block">Subtitle</label>
          <input
            id="bannerSubtitle"
            v-model="form.subtitle"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="buttonTitle" class="text-green-700 font-medium block">Button Text</label>
            <input
              id="buttonTitle"
              v-model="form.buttonTitle"
              type="text"
              class="input-field"
              placeholder="e.g., Shop Now, Learn More"
            />
          </div>
          
          <div class="space-y-2">
            <label for="buttonLink" class="text-green-700 font-medium block">Button Link</label>
            <input
              id="buttonLink"
              v-model="form.buttonLink"
              type="url"
              class="input-field"
              placeholder="e.g., /shop, https://example.com"
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <label for="position" class="text-green-700 font-medium block">Position</label>
          <input
            id="position"
            v-model.number="form.position"
            type="number"
            min="0"
            class="input-field"
            placeholder="Display order (0 = first)"
          />
        </div>
        
        <div class="flex items-center space-x-2">
          <input
            id="bannerIsActive"
            v-model="form.isActive"
            type="checkbox"
            class="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
          />
          <label for="bannerIsActive" class="text-green-700 font-medium">
            Active (Display on website)
          </label>
        </div>
        
        <div class="flex justify-end space-x-2 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!form.image || isUploading || isSubmitting || (!form.serverImageUrl && !props.banner)">
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <div class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              {{ props.banner ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>{{ props.banner ? 'Update' : 'Create' }} Slider</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XIcon, ImageIcon, UploadIcon } from 'lucide-vue-next'
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useMedia } from '@/composables/useMedia'
import { useSlider } from '@/composables/useSlider'

const props = defineProps({
  show: Boolean,
  banner: Object
})

const { createSlider, refreshSliders } = useSlider()

const emit = defineEmits(['close', 'save'])

const adminStore = useAdminStore()
const { uploadMedia, isUploading, error: mediaError } = useMedia()

const uploadError = ref('')
const uploadSuccess = ref(false)
const isSubmitting = ref(false)

const form = ref({
  image: '',
  title: '',
  subtitle: '',
  buttonTitle: '',
  buttonLink: '',
  position: 0,
  isActive: true,
  previousObjectUrl: null,
  serverImageUrl: '' // Store the actual server URL for submission
})

const selectImage = async () => {
  try {
    console.log('🎯 Starting image selection, current form state:', form.value)
    uploadError.value = ''
    uploadSuccess.value = false
    
    // Create file input for selection
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    const file = await new Promise((resolve) => {
      input.onchange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
          resolve(selectedFile)
        }
      }
      input.click()
    })
    
    if (!file) return
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      uploadError.value = 'Invalid file type. Please upload an image file.'
      return
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      uploadError.value = 'File size too large. Maximum size is 5MB.'
      return
    }
    
    // Create preview URL immediately from the selected file
    const previewUrl = URL.createObjectURL(file)
    form.value.image = previewUrl
    console.log('✅ Image preview set immediately:', form.value.image)
    
    // Clean up any previous object URL to prevent memory leaks
    if (form.value.previousObjectUrl) {
      URL.revokeObjectURL(form.value.previousObjectUrl)
    }
    form.value.previousObjectUrl = previewUrl
    
    // Generate alt text from title or use default
    const altText = form.value.title || 'Slider image'
    
    console.log('🔄 Starting background media upload:', { 
      fileName: file.name, 
      fileSize: file.size, 
      altText 
    })
    
    // Upload file to server in background (for storage, but not for preview)
    try {
      const mediaItem = await uploadMedia(file, altText)
      console.log('✅ Background upload successful:', mediaItem)
      
      // Store the server URL for form submission
      let serverUrl = null;
      if (mediaItem && mediaItem.media[0]) {
        serverUrl = mediaItem.media[0].image_original
      }
      
      if (serverUrl) {
        form.value.serverImageUrl = serverUrl
        console.log('✅ Server image URL stored:', serverUrl)
      }
      
      uploadSuccess.value = true
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        uploadSuccess.value = false
      }, 3000)
    } catch (uploadError) {
      console.error('❌ Background upload failed:', uploadError)
      // Show error since we need server URL for submission
      uploadError.value = 'Upload failed. Please try again.'
    }
    
  } catch (error) {
    console.error('❌ Image selection error:', error)
    uploadError.value = error.message || 'Failed to select image'
    uploadSuccess.value = false
  }
}

// Function to clear image and clean up object URL
const clearImage = () => {
  // Clean up object URL if it exists
  if (form.value.previousObjectUrl) {
    URL.revokeObjectURL(form.value.previousObjectUrl)
    form.value.previousObjectUrl = null
  }
  
  form.value.image = ''
  form.value.serverImageUrl = ''
  uploadSuccess.value = false
  uploadError.value = ''
  console.log('🗑️ Image cleared and object URL revoked')
}

// Function to clear all form data (used after successful creation)
const clearFormData = () => {
  // Clean up object URL if it exists
  if (form.value.previousObjectUrl) {
    URL.revokeObjectURL(form.value.previousObjectUrl)
    form.value.previousObjectUrl = null
  }
  
  // Reset all form fields to default values
  form.value = {
    image: '',
    title: '',
    subtitle: '',
    buttonTitle: '',
    buttonLink: '',
    position: 0,
    isActive: true,
    previousObjectUrl: null,
    serverImageUrl: ''
  }
  
  // Reset upload states
  uploadSuccess.value = false
  uploadError.value = ''
  
  console.log('🧹 All form data cleared')
}

// Watch for form.image changes
watch(() => form.value.image, (newImage, oldImage) => {
  console.log('📸 Form image changed:', { from: oldImage, to: newImage })
}, { immediate: true })

// Watch for modal show/hide to ensure fresh state
watch(() => props.show, (isShowing) => {
  if (isShowing && !props.banner) {
    // Modal opened for new banner creation - ensure fresh form
    console.log('🆕 Modal opened for new banner - ensuring fresh form')
    clearFormData()
  }
})

watch(() => props.banner, (newBanner) => {
  // Clean up any existing object URL before resetting form
  if (form.value.previousObjectUrl) {
    URL.revokeObjectURL(form.value.previousObjectUrl)
  }
  
  if (newBanner) {
    // Editing existing banner - populate form with existing data
    form.value = { 
      ...newBanner,
      // Map existing slider data to form structure
      buttonTitle: newBanner.button_title || '',
      buttonLink: newBanner.button_link || '',
      subtitle: newBanner.sub_title || newBanner.subtitle || '',
      image: newBanner.image_link || newBanner.image || '',
      serverImageUrl: newBanner.image_link || newBanner.image || '',
      previousObjectUrl: null // Don't copy this internal property
    }
    console.log('📝 Form populated for editing banner:', newBanner.id)
  } else {
    // Creating new banner - start with fresh form
    clearFormData()
    console.log('➕ Form reset for new banner creation')
  }
  // Reset upload states
  uploadError.value = ''
  uploadSuccess.value = false
}, { immediate: true })

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    uploadError.value = ''
    
    // Check if we have a server image URL for new uploads
    if (!form.value.serverImageUrl && !props.banner) {
      uploadError.value = 'Please wait for image upload to complete'
      return
    }
    
    // Prepare slider data according to SliderData interface
    const sliderData = {
      image_link: form.value.serverImageUrl || form.value.image,
      sub_title: form.value.subtitle,
      title: form.value.title,
      button_title: form.value.buttonTitle || '',
      button_link: form.value.buttonLink || '',
      position: form.value.position || 0
    }
    
    console.log('🎨 Submitting slider data:', sliderData)
    
    // Create or update slider
    if (props.banner) {
      // TODO: Implement update slider functionality when available
      console.log('📝 Updating existing slider...')
      await createSlider(sliderData) // For now, create a new one
      adminStore.updateHeroBanner(props.banner.id, form.value)
    } else {
      console.log('➕ Creating new slider...')
      await createSlider(sliderData)
      adminStore.addHeroBanner(form.value)
    }
    
    console.log('✅ Slider created/updated successfully')
    
    // Clear form data for new banners (don't cache)
    if (!props.banner) {
      console.log('🧹 Clearing form data for new banner')
      clearFormData()
      
      // Small delay to ensure form is cleared before closing
      await nextTick()
    }
    
    emit('close')
    
  } catch (error) {
    console.error('❌ Submit error:', error)
    uploadError.value = error.message || 'Failed to save slider'
  } finally {
    isSubmitting.value = false
  }
}

// Cleanup object URL when component is unmounted
onUnmounted(() => {
  if (form.value.previousObjectUrl) {
    URL.revokeObjectURL(form.value.previousObjectUrl)
    console.log('🧹 Component unmounted, object URL cleaned up')
  }
})
</script>
