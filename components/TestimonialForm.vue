<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ testimonial ? 'Edit Testimonial' : 'Add New Testimonial' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the testimonial information below.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block">Person Image</label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div 
                v-if="form.image" 
                class="relative w-24 h-24 border-2 border-green-200 rounded-full overflow-hidden mx-auto"
              >
                <img 
                  :src="form.image" 
                  alt="Person preview" 
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="form.image = ''"
                  class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <XIcon class="w-3 h-3" />
                </button>
              </div>
              <div 
                v-else
                class="w-24 h-24 border-2 border-dashed border-green-300 rounded-full flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors mx-auto"
                @click="selectImage"
              >
                <UserIcon class="w-8 h-8 text-green-400" />
              </div>
            </div>
            <button
              type="button"
              @click="selectImage"
              class="btn-secondary flex items-center gap-2"
            >
              <UploadIcon class="w-4 h-4" />
              {{ form.image ? 'Change' : 'Upload' }}
            </button>
          </div>
          <p v-if="uploadError" class="text-red-600 text-sm">{{ uploadError }}</p>
        </div>
        
        <div class="space-y-2">
          <label for="testimonialName" class="text-green-700 font-medium block">Name</label>
          <input
            id="testimonialName"
            v-model="form.name"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div class="space-y-2">
          <label for="testimonialPersonInfo" class="text-green-700 font-medium block">Person Information</label>
          <input
            id="testimonialPersonInfo"
            v-model="form.personInfo"
            type="text"
            placeholder="e.g., CEO, Company Name"
            class="input-field"
            required
          />
        </div>
        
        <div class="space-y-2">
          <label for="testimonialDescription" class="text-green-700 font-medium block">Testimonial Description</label>
          <textarea
            id="testimonialDescription"
            v-model="form.description"
            rows="3"
            class="input-field"
            required
          ></textarea>
        </div>
        
        <div class="space-y-2">
          <label for="testimonialFlag" class="text-green-700 font-medium block">Display Location</label>
          <select
            id="testimonialFlag"
            v-model="form.flag"
            class="input-field"
            required
          >
            <option value="">Select display location</option>
            <option value="home">Home Page</option>
            <option value="about">About Us Page</option>
          </select>
        </div>
        
        <div class="flex justify-end space-x-2 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="!form.image">
            {{ testimonial ? 'Update' : 'Add' }} Testimonial
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XIcon, UserIcon, UploadIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps({
  show: Boolean,
  testimonial: Object
})

const emit = defineEmits(['close', 'save'])

const adminStore = useAdminStore()
const { uploadFile, selectFile } = useFileUpload()

const uploadError = ref('')

const form = ref({
  image: '',
  name: '',
  personInfo: '',
  description: '',
  flag: 'home'
})

const selectImage = async () => {
  try {
    uploadError.value = ''
    const file = await selectFile()
    const imageUrl = await uploadFile(file)
    form.value.image = imageUrl
  } catch (error) {
    uploadError.value = error.message
  }
}

watch(() => props.testimonial, (newTestimonial) => {
  if (newTestimonial) {
    form.value = { ...newTestimonial }
  } else {
    form.value = {
      image: '',
      name: '',
      personInfo: '',
      description: '',
      flag: 'home'
    }
  }
  uploadError.value = ''
}, { immediate: true })

const handleSubmit = () => {
  if (props.testimonial) {
    adminStore.updateTestimonial(props.testimonial.id, form.value)
  } else {
    adminStore.addTestimonial(form.value)
  }
  emit('close')
}
</script>
