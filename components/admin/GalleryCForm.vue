<template>
    <div class="mt-0 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
            <div class="p-6">
                <h3 class="text-green-800 text-xl font-semibold">
                    Tambah Image Baru
                </h3>
                <p class="text-green-600 mt-1">Isi informasi image di bawah ini.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6 px-6 pb-6">
                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Image *
                    </label>

                    <!-- Image Upload Options -->
                    <div class="space-y-4">
                        <!-- Upload Method Toggle -->
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input v-model="uploadMethod" type="radio" value="file"
                                    class="mr-2 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm text-gray-700">Upload File</span>
                            </label>
                            <label class="flex items-center">
                                <input v-model="uploadMethod" type="radio" value="url"
                                    class="mr-2 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm text-gray-700">URL Link</span>
                            </label>
                        </div>

                        <!-- File Upload -->
                        <div v-if="uploadMethod === 'file'" class="space-y-3">
                            <div
                                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect"
                                    class="hidden" />
                                <div v-if="!selectedFile" @click="fileInput?.click()" class="cursor-pointer">
                                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                                        viewBox="0 0 48 48">
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <p class="mt-2 text-sm text-gray-600">Klik untuk memilih gambar</p>
                                    <p class="text-xs text-gray-500">PNG, JPG, GIF kurang dari 1MB</p>
                                </div>
                                <div v-else class="space-y-2">
                                    <img :src="previewUrl" alt="Preview"
                                        class="mx-auto h-32 w-32 object-cover rounded-lg" />
                                    <p class="text-sm text-gray-600">{{ selectedFile.name }}</p>
                                    <button type="button" @click="removeSelectedFile"
                                        class="text-sm text-red-600 hover:text-red-800">
                                        Hapus file
                                    </button>
                                </div>
                            </div>

                            <!-- Upload Progress -->
                            <div v-if="isUploading" class="space-y-2">
                                <div class="flex items-center justify-between text-sm text-gray-600">
                                    <span>Mengupload gambar...</span>
                                    <span>{{ uploadProgress }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        :style="{ width: uploadProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- URL Input -->
                        <div v-if="uploadMethod === 'url'">
                            <input v-model="form.image_link" type="url" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg" />
                        </div>

                        <!-- Current Image Preview (for edit mode) -->
                        <div v-if="!selectedFile" class="mt-3">
                            <p class="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                            <img :src="form.image_link" alt="Current image"
                                class="h-24 w-24 object-cover rounded-lg border" />
                        </div>
                    </div>
                </div>

                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                        Alt *
                    </label>
                    <input id="name" v-model="form.alt" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Image Short Description" />
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end space-x-4">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Close
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? 'Menyimpan...' : 'Tambah' }}
                    </button>
                </div>
            </form>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {{ error }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {{ successMessage }}
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { GalleryPayload } from '@/types/about-api-type';
import { toast } from 'vue3-toastify';

const emit = defineEmits(['close', 'save']);


const { createGallery, isLoading, error, clearError } = useGalleryManagement();
const { uploadMedia, isUploading } = useMedia();

// Form state
const form = ref<GalleryPayload>({
    image_link: '',
    alt: '',
});

// Image upload state
const uploadMethod = ref<'file' | 'url'>('url');
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>('');
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

// UI state
const successMessage = ref<string | null>(null);

// File handling methods
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran file tidak boleh lebih dari 10MB');
            return;
        }

        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

const removeSelectedFile = () => {
    selectedFile.value = null;
    previewUrl.value = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Form submission handler
const handleSubmit = async () => {
    try {
        clearError();
        successMessage.value = null;

        // Validate form
        if (!form.value.alt.trim()) {
            throw new Error('Alt harus diisi');
        }

        // Handle image upload if file is selected
        if (uploadMethod.value === 'file' && selectedFile.value) {
            try {
                // Simulate upload progress
                uploadProgress.value = 0;
                const progressInterval = setInterval(() => {
                    if (uploadProgress.value < 90) {
                        uploadProgress.value += 10;
                    }
                }, 100);

                // Upload the image
                const uploadedMedia = await uploadMedia(selectedFile.value, `Image for ${form.value.alt}`);

                // Set the image link from uploaded media
                if (uploadedMedia && uploadedMedia.length > 0) {
                    form.value.image_link = uploadedMedia[0].image_original;
                } else {
                    throw new Error('Gagal mengupload gambar');
                }

                clearInterval(progressInterval);
                uploadProgress.value = 100;

                // Wait a bit to show 100% progress
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (uploadError: any) {
                throw new Error(`Gagal mengupload gambar: ${uploadError.message}`);
            }
        }

        // Validate image link
        if (!form.value.image_link.trim()) {
            throw new Error('Link gambar harus diisi atau upload file gambar');
        }

        // Submit to API
        const response = await createGallery(form.value);
        successMessage.value = `Berhasil menambahkan image: ${form.value.image_link}`;


        emit('save');
        resetForm();

    } catch (err: any) {
        // Error is handled by the composable
        console.error('Form submission error:', err);
    }
};

// Reset form
const resetForm = () => {
    form.value = {
        image_link: '',
        alt: '',
    };

    // Reset image upload state
    uploadMethod.value = 'url';
    selectedFile.value = null;
    previewUrl.value = '';
    uploadProgress.value = 0;
    if (fileInput.value) {
        fileInput.value.value = '';
    }

    clearError();
    successMessage.value = null;
};
</script>

<style scoped>
.our-people-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
}
</style>
