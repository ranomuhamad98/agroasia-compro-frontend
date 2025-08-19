<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
            <div class="p-6 border-b border-green-200">
                <h3 class="text-green-800 text-xl font-semibold">
                    Edit Section
                </h3>
                <p class="text-green-600 mt-1">Fill in the section information below.</p>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage"
                class="p-4 mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ successMessage }}
            </div>
            <div v-if="error" class="p-4 mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">

                <div class="space-y-2">
                    <label for="sectionPosition" class="text-green-700 font-medium block">Position</label>
                    <input id="sectionPosition" v-model="form.position" type="number" class="input-field" required />
                </div>
                <div v-if="!isImageTipe(props.data?.tipe)" class="space-y-2">
                    <label for="sectionContent" class="text-green-700 font-medium block">Content</label>
                    <textarea id="sectionContent" v-model="form.value" type="text"
                        placeholder="e.g., CEO, Company Name" class="input-field" />
                </div>

                <div v-else class="space-y-2">
                    <label class="text-green-700 font-medium block">Media Link</label>
                    <div class="space-y-4">
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input v-model="uploadMethod" type="radio" value="file"
                                    class="mr-2 text-green-600 focus:ring-green-500" />
                                <span class="text-sm text-gray-700">Upload Media</span>
                            </label>
                            <label class="flex items-center">
                                <input v-model="uploadMethod" type="radio" value="url"
                                    class="mr-2 text-green-600 focus:ring-green-500" />
                                <span class="text-sm text-gray-700">Media Link</span>
                            </label>
                        </div>

                        <div v-if="uploadMethod === 'file'" class="space-y-3">
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept="image/*"
                                    @change="handleFileSelect"
                                    class="hidden"
                                />
                                <div v-if="!selectedFile" @click="fileInput?.click()" class="cursor-pointer">
                                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <p class="mt-2 text-sm text-gray-600">Klik untuk memilih media</p>
                                    <p class="text-xs text-gray-500">PNG, JPG, GIF kurang dari 10MB</p>
                                </div>
                                <div v-else class="space-y-2">
                                    <img :src="previewUrl" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg" />
                                    <p class="text-sm text-gray-600">{{ selectedFile?.name }}</p>
                                    <button type="button" @click="removeSelectedFile" class="text-sm text-red-600 hover:text-red-800">Hapus file</button>
                                </div>
                            </div>
                            <div v-if="isUploading" class="space-y-2">
                                <div class="flex items-center justify-between text-sm text-gray-600">
                                    <span>Mengupload media...</span>
                                    <span>{{ uploadProgress }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-green-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadMethod === 'url'">
                            <input
                                v-model="form.value"
                                type="url"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div v-if="props.data?.value && !selectedFile" class="mt-3">
                            <p class="text-sm text-gray-600 mb-2">Media saat ini:</p>
                            <img :src="props.data.value" alt="Current image" class="h-24 w-24 object-cover rounded-lg border" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" @click="handleCancel" class="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading" class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                            </div>
                            Updating...
                        </span>
                        <span v-else>
                            Update Section
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSectionManagement } from '@/composables/useSectionManagement'
import type { Section } from '@/types/sections-api-types'
import { toast } from 'vue3-toastify'

const props = defineProps({
    data: {
        type: Object as PropType<Section | null>,
        required: true
    }
})

const emit = defineEmits(['close', 'save'])

const {
    updateSection,
    isLoading,
    error,
    successMessage,
    clearMessages
} = useSectionManagement()

const form = ref({
    value: props.data?.value || '',
    position: props.data?.position || 0,
})

const handleSubmit = async () => {
    try {
        clearMessages()

        // Handle image upload if tipe is image-like and file selected
        if (isImageTipe(props.data?.tipe) && uploadMethod.value === 'file' && selectedFile.value) {
            try {
                uploadProgress.value = 0
                const progressInterval = setInterval(() => {
                    if (uploadProgress.value < 90) {
                        uploadProgress.value += 10
                    }
                }, 100)

                const uploadedMedia = await uploadMedia(selectedFile.value, `Section ${props.data?.section || props.data?.tipe || 'Image'}`)
                if (uploadedMedia && uploadedMedia.length > 0) {
                    form.value.value = uploadedMedia[0].image_original
                } else {
                    throw new Error('Gagal mengupload gambar')
                }

                clearInterval(progressInterval)
                uploadProgress.value = 100
                await new Promise(resolve => setTimeout(resolve, 200))
            } catch (uploadError: any) {
                throw new Error(uploadError?.message || 'Gagal mengupload gambar')
            }
        }

        // Update existing section
        const updatedSection = await updateSection(props.data?.id || '', form.value as Section)
        if (updatedSection) {
            emit('save', updatedSection)
        }
    } catch {
        toast.error('Gagal mengupdate section')
    }
}

const handleCancel = () => {
    emit('close')
}

const imageLikeTipes = ['icon', 'image_link', 'logo', 'about_us_media_link', 'jumbotron_image']
const isImageTipe = (tipe?: string) => !!tipe && imageLikeTipes.includes(tipe.toLowerCase())

// Media upload state and helpers (for image-like tipe)
const { uploadMedia, isUploading } = useMedia()
const uploadMethod = ref<'file' | 'url'>('file')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran file tidak boleh lebih dari 10MB')
            return
        }
        selectedFile.value = file
        previewUrl.value = URL.createObjectURL(file)
    }
}

const removeSelectedFile = () => {
    selectedFile.value = null
    previewUrl.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>