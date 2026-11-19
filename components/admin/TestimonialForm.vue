<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ testimonial ? 'Edit Testimonial' : 'Add New Testimonial' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the testimonial information below.</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="p-4 mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>
      <div v-if="error" class="p-4 mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block">Person Image</label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden" />
              <div class="relative w-24 h-24 mx-auto">
                <div
                  class="relative flex w-full h-full items-center justify-center border-2 border-dashed border-green-200 rounded-full overflow-hidden mx-auto cursor-pointer hover:border-green-400 transition-colors"
                  @click="$refs.fileInput.click()">
                  <img v-if="imagePreview || form.pic" :src="imagePreview || form.pic" alt="Person preview"
                    class="w-full h-full object-cover" />
                  <UserIcon v-else class="w-8 h-8 text-green-400" />
                </div>
                <button v-if="imagePreview || form.pic" type="button" @click.stop="clearImage"
                  class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700">
                  <XIcon class="w-3 h-3" />
                </button>
              </div>
            </div>

            <button type="button" @click="$refs.fileInput.click()" :disabled="isUploading"
              class="w-full max-w-[10rem] px-3 py-2 border border-green-300 rounded-md text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2Icon v-if="isUploading" class="w-4 h-4 animate-spin" />
              <UploadIcon v-else class="w-4 h-4" />
              {{ isUploading ? 'Uploading...' : 'Choose File' }}
            </button>
          </div>
          <p v-if="mediaError" class="text-red-600 text-sm">{{ mediaError }}</p>
        </div>

        <div class="space-y-2">
          <label for="testimonialName" class="text-green-700 font-medium block">Name</label>
          <input id="testimonialName" v-model="form.name" type="text" class="input-field" required />
        </div>

        <div class="space-y-2">
          <label for="testimonialProfession" class="text-green-700 font-medium block">Profession</label>
          <input id="testimonialProfession" v-model="form.profession" type="text" placeholder="e.g., CEO, Company Name"
            class="input-field" required />
        </div>

        <div class="space-y-2">
          <label for="testimonialMessage" class="text-green-700 font-medium block">Testimonial Message</label>
          <textarea id="testimonialMessage" v-model="form.message" rows="3" class="input-field" required></textarea>
        </div>

        <div class="space-y-2">
          <label for="testimonialStatus" class="text-green-700 font-medium block">Status</label>
          <select id="testimonialStatus" v-model="form.status" class="input-field" required>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button type="button" @click="handleCancel" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading || (!form.pic && !imageFile)">
            <span v-if="isLoading" class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ testimonial ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ testimonial ? 'Update' : 'Add' }} Testimonial
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XIcon, UserIcon, UploadIcon, Loader2Icon } from 'lucide-vue-next'
import { ref, watch, computed } from 'vue'
import { useTestimonialManagement } from '@/composables/useTestimonialManagement'
import { useMedia } from '@/composables/useMedia'

const props = defineProps({
  show: Boolean,
  testimonial: Object
})

const emit = defineEmits(['close', 'save'])

const imagePreview = ref('')
const fileInput = ref(null)
const imageFile = ref(null)

const {
  uploadMedia,
  isUploading,
  error: mediaError,
  clearError: clearMediaError
} = useMedia()

const {
  createTestimonial,
  updateTestimonial,
  isLoading: isLoadingTestimonial,
  error,
  successMessage,
  clearMessages
} = useTestimonialManagement()

const isLoading = computed(() => isLoadingTestimonial.value || isUploading.value)

const form = ref({
  pic: '',
  name: '',
  profession: '',
  message: '',
  status: true
})

// Handle file selection
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    console.log('📁 File selected:', file.name)
    clearMediaError()

    // Show preview only - don't upload yet
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    imageFile.value = file

    // Clear any existing pic URL since we have a new file to upload
    form.value.pic = ''

    console.log('✅ File selected and preview generated. Will upload on form submission.')
  } catch (err) {
    console.error('❌ Failed to process selected file:', err)
    clearMediaError()
    imagePreview.value = ''
    imageFile.value = null
  }
}

// Clear image function
const clearImage = () => {
  imagePreview.value = ''
  imageFile.value = null
  form.value.pic = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleCancel = () => {
  clearMessages()
  clearMediaError()
  clearImage()
  emit('close')
}

const handleSubmit = async () => {
  try {
    clearMessages()
    clearMediaError()

    // Upload image first if we have a file selected
    if (imageFile.value) {
      console.log('📤 Uploading image during form submission...')
      const fileName = form.value.name?.trim() || 'Untitled Testimonial'
      const altText = `Testimonial image: ${fileName}`

      const mediaItemRaw = await uploadMedia(imageFile.value, altText)
      const mediaItem = mediaItemRaw[0]
      form.value.pic = mediaItem.image_medium
      console.log('✅ Image uploaded successfully:', mediaItem.image_medium)
    }

    // Validate that we have an image
    if (!form.value.pic) {
      throw new Error('Please select an image for the testimonial')
    }

    if (props.testimonial?.id) {
      // Update existing testimonial
      const updatedTestimonial = await updateTestimonial(props.testimonial.id, form.value)
      if (updatedTestimonial) {
        emit('save', updatedTestimonial)
        // emit('close')
      }
    } else {
      // Create new testimonial
      const newTestimonial = await createTestimonial(form.value)
      console.log('👻 New testimonial been created 1:', newTestimonial)
      if (newTestimonial) {
        console.log('👻 New testimonial been created:', newTestimonial)
        emit('save', newTestimonial)
        // emit('close')
      }
    }
  } catch (err) {
    // Error is handled by the composable
    console.error('Form submission error:', err)
  }
}

watch(() => props.testimonial, (newTestimonial) => {
  if (newTestimonial) {
    // Edit mode - populate form with existing data
    form.value = {
      pic: newTestimonial.pic || '',
      name: newTestimonial.name || '',
      profession: newTestimonial.profession || '',
      message: newTestimonial.message || '',
      status: newTestimonial.status ?? true
    }
    imagePreview.value = ''
    imageFile.value = null
  } else {
    // Add mode - reset form
    form.value = {
      pic: '',
      name: '',
      profession: '',
      message: '',
      status: true
    }
    imagePreview.value = ''
    imageFile.value = null
  }
  clearMediaError()
  clearMessages()
}, { immediate: true })

watch(() => props.show, (newShow) => {
  if (!newShow) {
    clearMessages()
    clearMediaError()
    clearImage()
  }
})
</script>
