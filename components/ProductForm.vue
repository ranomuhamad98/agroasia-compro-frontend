<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ product ? 'Edit Product' : 'Add New Product' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the product information below.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block">Product Image</label>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div 
                v-if="form.image" 
                class="relative w-full h-32 border-2 border-green-200 rounded-lg overflow-hidden"
              >
                <img 
                  :src="form.image" 
                  alt="Product preview" 
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
                class="w-full h-32 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
                @click="selectImage"
              >
                <div class="text-center">
                  <ImageIcon class="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p class="text-green-600 text-sm">Click to select image</p>
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
          <label for="productName" class="text-green-700 font-medium block">Product Name</label>
          <input
            id="productName"
            v-model="form.name"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div class="space-y-2">
          <label for="productDescription" class="text-green-700 font-medium block">Description</label>
          <textarea
            id="productDescription"
            v-model="form.description"
            rows="3"
            class="input-field"
            required
          ></textarea>
        </div>
        
        <div class="space-y-2">
          <label for="productCategory" class="text-green-700 font-medium block">Category</label>
          <select
            id="productCategory"
            v-model="form.category"
            class="input-field"
            required
          >
            <option value="">Select category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label for="productAdditionalInfo" class="text-green-700 font-medium block">Additional Information</label>
          <textarea
            id="productAdditionalInfo"
            v-model="form.additionalInfo"
            rows="2"
            class="input-field"
          ></textarea>
        </div>
        
        <div class="flex items-center space-x-2">
          <input
            id="productIsTop"
            v-model="form.isTop"
            type="checkbox"
            :disabled="!canSetAsTop"
            class="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
          />
          <label for="productIsTop" class="text-green-700 font-medium">
            Display on Home Page (Top Product)
            <span v-if="!canSetAsTop" class="text-sm text-red-500 ml-2">Maximum 4 top products allowed</span>
          </label>
        </div>
        
        <div class="flex justify-end space-x-2 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="!form.image">
            {{ product ? 'Update' : 'Add' }} Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XIcon, ImageIcon, UploadIcon } from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps({
  show: Boolean,
  product: Object
})

const emit = defineEmits(['close', 'save'])

const adminStore = useAdminStore()
const { uploadFile, selectFile } = useFileUpload()

const categories = ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Spices']
const uploadError = ref('')

const form = ref({
  image: '',
  name: '',
  description: '',
  category: '',
  additionalInfo: '',
  isTop: false
})

const canSetAsTop = computed(() => {
  return !form.value.isTop || adminStore.topProductsCount < 4 || props.product?.isTop
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

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct }
  } else {
    form.value = {
      image: '',
      name: '',
      description: '',
      category: '',
      additionalInfo: '',
      isTop: false
    }
  }
  uploadError.value = ''
}, { immediate: true })

const handleSubmit = () => {
  if (props.product) {
    adminStore.updateProduct(props.product.id, form.value)
  } else {
    adminStore.addProduct(form.value)
  }
  emit('close')
}
</script>
