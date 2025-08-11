<template>
    <div class="mt-0 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
            <div class="p-6">
                <h3 class="text-green-800 text-xl font-semibold">
                    {{ props.person ? 'Edit Petani' : 'Tambah Petani Baru' }}
                </h3>
                <p class="text-green-600 mt-1">Isi informasi petani di bawah ini.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6 px-6 pb-6">
                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image *
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
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                                    <p class="mt-2 text-sm text-gray-600">Klik untuk memilih gambar</p>
                                    <p class="text-xs text-gray-500">PNG, JPG, GIF kurang dari 1MB</p>
                                </div>
                                <div v-else class="space-y-2">
                                    <img :src="previewUrl" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg" />
                                    <p class="text-sm text-gray-600">{{ selectedFile.name }}</p>
                                    <button 
                                        type="button" 
                                        @click="removeSelectedFile"
                                        class="text-sm text-red-600 hover:text-red-800"
                                    >
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
                                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- URL Input -->
                        <div v-if="uploadMethod === 'url'">
                            <input 
                                v-model="form.image_link" 
                                type="url" 
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg" 
                            />
                        </div>

                        <!-- Current Image Preview (for edit mode) -->
                        <div v-if="props.person?.image_link && !selectedFile" class="mt-3">
                            <p class="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                            <img :src="props.person.image_link" alt="Current image" class="h-24 w-24 object-cover rounded-lg border" />
                        </div>
                    </div>
                </div>

                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                        Nama *
                    </label>
                    <input id="name" v-model="form.name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama petani" />
                </div>

                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                        Jabatan *
                    </label>
                    <input id="title" v-model="form.title" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Jabatan atau posisi" />
                </div>

                <!-- Lokasi -->
                <div>
                    <label for="lokasi" class="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi *
                    </label>
                    <input id="lokasi" v-model="form.lokasi" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Lokasi petani" />
                </div>

                <!-- Bertani Sejak -->
                <div>
                    <label for="bertani_sejak" class="block text-sm font-medium text-gray-700 mb-2">
                        Bertani Sejak (Tahun) *
                    </label>
                    <input id="bertani_sejak" v-model.number="form.bertani_sejak" type="number" min="0" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2020" />
                </div>

                <!-- Bermitra Sejak -->
                <div>
                    <label for="bermitra_sejak" class="block text-sm font-medium text-gray-700 mb-2">
                        Bermitra Sejak (Tahun) *
                    </label>
                    <input id="bermitra_sejak" v-model.number="form.bermitra_sejak" type="number" min="0" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2022" />
                </div>

                <!-- Keterangan -->
                <div>
                    <label for="keterangan" class="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan *
                    </label>
                    <textarea id="keterangan" v-model="form.keterangan" required rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Deskripsi tentang petani"></textarea>
                </div>

                <!-- Status -->
                <div>
                    <label class="flex items-center">
                        <input v-model="form.status" type="checkbox"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span class="ml-2 text-sm text-gray-700">Status Aktif</span>
                    </label>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end space-x-4">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Close
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? 'Menyimpan...' : props.person ? 'Edit' : 'Tambah' }}
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
import type { OurPeopleData, OurPeoplePayload } from '@/types/about-api-type';
import { toast } from 'vue3-toastify';

const emit = defineEmits(['close', 'save']);

const props = defineProps({
    person: {
        type: Object as PropType<OurPeopleData>,
        required: false,
    },
});

const { createOurPeople, updateOurPeople, isLoading, error, clearError } = useOurPeopleManagement();
const { uploadMedia, isUploading } = useMedia();

// Form state
const form = ref<OurPeoplePayload>({
    image_link: props.person?.image_link || '',
    name: props.person?.name || '',
    title: props.person?.title || '',
    lokasi: props.person?.lokasi || '',
    bertani_sejak: props.person?.bertani_sejak || 0,
    bermitra_sejak: props.person?.bermitra_sejak || 0,
    keterangan: props.person?.keterangan || '',
    status: props.person?.status || true,
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
        if (!form.value.name.trim()) {
            throw new Error('Nama harus diisi');
        }
        if (!form.value.title.trim()) {
            throw new Error('Jabatan harus diisi');
        }
        if (!form.value.lokasi.trim()) {
            throw new Error('Lokasi harus diisi');
        }
        if (!form.value.keterangan.trim()) {
            throw new Error('Keterangan harus diisi');
        }
        if (form.value.bertani_sejak < 0) {
            throw new Error('Tahun bertani tidak boleh negatif');
        }
        if (form.value.bermitra_sejak < 0) {
            throw new Error('Tahun bermitra tidak boleh negatif');
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
                const uploadedMedia = await uploadMedia(selectedFile.value, `Profile image for ${form.value.name}`);
                
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
        if (props.person) {
            const response = await updateOurPeople(props.person.id, form.value);
            successMessage.value = `Berhasil mengubah petani: ${form.value.name}`;
        } else {
            const response = await createOurPeople(form.value);
            successMessage.value = `Berhasil menambahkan petani: ${form.value.name}`;
        }

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
        name: '',
        title: '',
        lokasi: '',
        bertani_sejak: 0,
        bermitra_sejak: 0,
        keterangan: '',
        status: true,
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
