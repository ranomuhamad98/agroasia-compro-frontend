<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-green-200">
        <h2 class="text-xl font-semibold text-green-800">
          {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Category Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-green-700 mb-2">
            Category Name *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter category name"
            class="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="{ 'border-red-300 focus:ring-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-green-700 mb-2">
            Category Image *
          </label>
          
                      <!-- Image Preview -->
            <div v-if="form.image_link || imagePreview" class="mb-3">
              <div class="relative">
                <img
                  :src="imagePreview || form.image_link"
                  alt="Category preview"
                  class="w-full h-32 object-cover rounded-md border border-green-200"
                />
                <div v-if="mediaUploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                  <div class="text-white text-center">
                    <Loader2Icon class="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p class="text-sm">Uploading...</p>
                  </div>
                </div>
              </div>
            </div>

          <!-- Upload Options -->
          <div class="space-y-2">
            <!-- File Upload -->
            <div>
              <label class="block text-sm text-green-600 mb-1">Upload Image</label>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                :disabled="mediaUploading"
                class="w-full px-3 py-2 border border-green-300 rounded-md text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2Icon v-if="mediaUploading" class="w-4 h-4 animate-spin" />
                <UploadIcon v-else class="w-4 h-4" />
                {{ mediaUploading ? 'Uploading...' : 'Choose File' }}
              </button>
            </div>

            <!-- Or URL Input -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div>
              <label class="block text-sm text-green-600 mb-1">Image URL</label>
              <input
                v-model="form.image_link"
                type="text"
                placeholder="https://example.com/image.jpg"
                class="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-300 focus:ring-red-500': errors.image_link }"
              />
              <p v-if="errors.image_link" class="mt-1 text-sm text-red-600">{{ errors.image_link }}</p>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error || mediaError" class="bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex items-center gap-2">
            <AlertCircleIcon class="w-4 h-4 text-red-500" />
            <p class="text-sm text-red-700">{{ error || mediaError }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || mediaUploading"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Loader2Icon v-if="isSubmitting || mediaUploading" class="w-4 h-4 animate-spin" />
            <SaveIcon v-else class="w-4 h-4" />
            {{ isSubmitting ? 'Saving...' : mediaUploading ? 'Uploading...' : 'Save Category' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {
  XIcon,
  UploadIcon,
  SaveIcon,
  Loader2Icon,
  AlertCircleIcon
} from 'lucide-vue-next';
import { useMedia } from '@/composables/useMedia';
import { onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  }
});

// Computed property for editing category
const editingCategory = computed(() => props.category);

const emit = defineEmits(['close', 'save']);

// Form state
const form = ref({
  name: '',
  image_link: ''
});
const isImageFromServer = ref(false);

const errors = ref({});
const error = ref('');
const isSubmitting = ref(false);
const imagePreview = ref('');
const fileInput = ref(null);

// Media composable
const { uploadMedia, isUploading: mediaUploading, error: mediaError, clearError } = useMedia();

// Initialize form when category prop changes
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = {
      name: newCategory.name || '',
      image_link: newCategory.image_link || ''
    };
  } else {
    form.value = {
      name: '',
      image_link: ''
    };
  }
  imagePreview.value = '';
  errors.value = {};
  error.value = '';
  // Clear media errors when form is reset
  if (mediaError.value) {
    clearError();
  }
}, { immediate: true });

// Ensure form is properly initialized on mount
onMounted(() => {
  if (!form.value.name) {
    form.value.name = '';
  }
  if (!form.value.image_link) {
    form.value.image_link = '';
  }
});

// Debug watcher to track form changes
watch(() => form.value.image_link, (newValue, oldValue) => {
  console.log('🔄 Image link changed:', { oldValue, newValue });
});

// Handle file selection
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    console.log('📁 Starting file upload, form state:', form.value);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Generate alt text for the image
    const categoryName = form.value.name?.trim() || 'Untitled Category';
    const altText = `Category image: ${categoryName}`;
    
    console.log('📝 Generated alt text:', altText);

    // Upload file using media composable
    const mediaItemRaw = await uploadMedia(file, altText);
    const mediaItem = mediaItemRaw[0];

    console.log('🔄 Media item:', mediaItem);
    isImageFromServer.value = true;
    
    // Update form with the uploaded image URL
    form.value.image_link = mediaItem.image_original;
    
    // Force reactivity update
    form.value = { ...form.value };
    
    // Small delay to ensure DOM updates
    await nextTick();
    
    console.log('✅ Image uploaded successfully via media system:', mediaItem);
    console.log('📝 Updated form state:', form.value);
  } catch (err) {
    console.error('❌ Failed to upload image:', err);
    error.value = err.message || 'Failed to upload image. Please try again.';
    imagePreview.value = '';
  }
};

// Validate form
const validateForm = () => {
  errors.value = {};
  
  if (!form.value.name?.trim()) {
    errors.value.name = 'Category name is required';
  }

  console.log('🔄 Image link:', form.value.image_link);
  
  if (!form.value.image_link?.trim()) {
    errors.value.image_link = 'Image is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

// URL validation helper
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    isSubmitting.value = true;
    error.value = '';
    
    const categoryData = {
      name: form.value.name?.trim() || '',
      image_link: form.value.image_link?.trim() || ''
    };

    emit('save', categoryData);
    
    // Don't close form here - let parent handle it after successful save
  } catch (err) {
    console.error('❌ Form submission error:', err);
    error.value = err.message || 'Failed to save category';
  } finally {
    isSubmitting.value = false;
  }
};
</script> 