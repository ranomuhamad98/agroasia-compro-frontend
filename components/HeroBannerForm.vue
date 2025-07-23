<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ banner ? 'Edit Hero Banner' : 'Add New Hero Banner' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the hero banner information below.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block">Banner Image</label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div 
                v-if="form.image" 
                class="relative w-full h-40 border-2 border-green-200 rounded-lg overflow-hidden"
              >
                <img 
                  :src="form.image" 
                  alt="Banner preview" 
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="form.image = ''"
                  class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              <div 
                v-else
                class="w-full h-40 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
                @click="selectImage"
              >
                <div class="text-center">
                  <ImageIcon class="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p class="text-green-600 text-sm">Click to select banner image</p>
                </div>
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
          <button type="submit" class="btn-primary" :disabled="!form.image">
            {{ banner ? 'Update' : 'Add' }} Banner
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XIcon, ImageIcon, UploadIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps({
  show: Boolean,
  banner: Object
})

const emit = defineEmits(['close', 'save'])

const adminStore = useAdminStore()
const { uploadFile, selectFile } = useFileUpload()

const uploadError = ref('')

const form = ref({
  image: '',
  title: '',
  subtitle: '',
  isActive: true
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

watch(() => props.banner, (newBanner) => {
  if (newBanner) {
    form.value = { ...newBanner }
  } else {
    form.value = {
      image: '',
      title: '',
      subtitle: '',
      isActive: true
    }
  }
  uploadError.value = ''
}, { immediate: true })

const handleSubmit = () => {
  if (props.banner) {
    adminStore.updateHeroBanner(props.banner.id, form.value)
  } else {
    adminStore.addHeroBanner(form.value)
  }
  emit('close')
}
</script>
