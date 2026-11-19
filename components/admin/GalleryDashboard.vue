<template>
    <div class="card">
        <div class="card-header flex justify-between items-center">
            <h3 class="text-green-800 font-semibold text-xl mb-0 mx-2">Image Galleries</h3>
            <div class="flex items-center gap-4">
                <button class="btn-ghost text-green-600 flex items-center gap-2" @click="handleRefresh">
                    <RefreshCcw class="w-4 h-4" />
                    Refresh
                </button>
                <button class="btn-primary flex items-center gap-2" @click="openForm">
                    <PlusIcon class="w-4 h-4" />
                    Add Image
                </button>
            </div>
        </div>

        <!-- loading -->
        <div v-if="galleryLoading">
            <div class="flex justify-center items-center h-full gap-2 m-2">
                <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
                Loading...
            </div>
        </div>

        <div
            class="p-6 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <GalleryCCard v-for="image in gallery" :key="image.id" :data="image" :loading="galleryLoading"
                @delete="handleDelete" />
        </div>
    </div>

    <GalleryCForm v-if="showForm" :data="selectedGallery" @close="showForm = false" @save="handleSave" />
</template>

<script setup lang="ts">
import GalleryCForm from './GalleryCForm.vue';
import { Loader2Icon, PlusIcon, RefreshCcw } from 'lucide-vue-next';
import type { GalleryData } from '@/composables/useGalleryManagement';
import GalleryCCard from './GalleryCCard.vue';

const showForm = ref<boolean>(false);
const selectedGallery = ref<GalleryData | null>(null);

const {
    gallery,
    isLoading: galleryLoading,
    refreshGalleryData,
} = useGalleryApi();

const {
    deleteGallery,
} = useGalleryManagement();

const handleRefresh = () => {
    refreshGalleryData();
}

const handleDelete = (gallery: GalleryData) => {
    deleteGallery(gallery.id).then(() => {
        handleRefresh();
    });
}

const openForm = () => {
    showForm.value = true;
}

const handleSave = () => {
    showForm.value = false;
    handleRefresh();
}
</script>