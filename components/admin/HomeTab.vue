<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="page-title">Home Page Management</h2>
                <p class="page-subtitle">Manage hero banners for your home page.</p>
            </div>
            <div class="flex items-center gap-3">
                <button @click="getSliders()" :disabled="slidersLoading"
                    class="btn-secondary flex items-center gap-2 disabled:opacity-50" title="Refresh slider list">
                    <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': slidersLoading }" />
                    {{ slidersLoading ? 'Loading...' : 'Refresh' }}
                </button>
                <button @click="openHeroBannerDialog()" class="btn-primary flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    Add Slider
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="slidersLoading" class="flex items-center justify-center py-12">
            <div class="text-center">
                <div
                    class="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3">
                </div>
                <p class="text-green-600">Loading sliders...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="slidersError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center gap-2">
                <AlertCircleIcon class="w-5 h-5 text-red-500" />
                <p class="text-red-700">{{ slidersError }}</p>
                <button @click="getSliders()"
                    class="ml-auto text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-300 hover:bg-red-100">
                    Try Again
                </button>
            </div>
        </div>

        <!-- Not Loaded Yet State -->
        <div v-else-if="sliders.length === 0 && !slidersError && !slidersLoading" class="text-center py-12">
            <ImageIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Welcome to Slider Management</h3>
            <p class="text-gray-500 mb-4">Click "Refresh" to load existing sliders or create your first one.</p>
            <div class="flex justify-center gap-3">
                <button @click="getSliders()" class="btn-secondary">
                    Load Sliders
                </button>
                <button @click="openHeroBannerDialog()" class="btn-primary">
                    Add First Slider
                </button>
            </div>
        </div>

        <!-- Sliders Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="slider in sliders" :key="slider.id" class="card">
                <div class="p-4 border-b border-green-100">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-lg font-semibold text-green-800 mb-0">{{ slider.title }}</h3>
                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                                    Position {{ slider.position }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mb-2" v-html="$sanitize(slider.sub_title)"></p>
                            <div v-if="slider.button_title" class="flex items-center gap-1 text-xs text-gray-500">
                                <LinkIcon class="w-3 h-3" />
                                Button: "{{ slider.button_title }}"
                                <span v-if="slider.button_link" class="truncate max-w-32" :title="slider.button_link">
                                    → {{ slider.button_link }}
                                </span>
                            </div>
                        </div>
                        <div class="flex space-x-1 ml-3">
                            <button @click="openHeroBannerDialog(slider)" class="btn-secondary p-2" title="Edit Slider">
                                <Edit class="w-4 h-4" />
                            </button>
                            <button @click="handleDeleteSlider(slider)"
                                class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                                title="Delete Slider">
                                <Trash2Icon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <div class="relative">
                        <img :src="slider.image_link" :alt="slider.title"
                            class="w-full h-32 object-cover rounded-md mb-3 border border-green-200" />
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>Created: {{ formatDate(slider.input_time) }}</span>
                        <span v-if="slider.update_time !== slider.input_time">
                            Updated: {{ formatDate(slider.update_time) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <HeroBannerForm :show="showHeroBannerDialog" :banner="editingHeroBanner" @close="closeHeroBannerDialog"
        @save="handleSliderSave" />
</template>

<script setup lang="ts">
import { useSlider, type Slider } from '@/composables/useSlider';
import { PlusIcon, Trash2Icon, LinkIcon, ImageIcon, RefreshCwIcon, AlertCircleIcon, Edit } from 'lucide-vue-next'
import { onMounted, ref, type DeepReadonly } from 'vue';
import { toast } from 'vue3-toastify';
import HeroBannerForm from './HeroBannerForm.vue';

const {
    sliders,
    isLoading: slidersLoading,
    error: slidersError,
    getSliders,
    updateSlider,
    deleteSlider,
    refreshSliders
} = useSlider();

onMounted(() => {
    getSliders();
})

const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return 'Invalid date'
    }
}


// Hero Banner dialog
const showHeroBannerDialog = ref(false)
const editingHeroBanner = ref<DeepReadonly<Slider> | undefined>(undefined)

const openHeroBannerDialog = (banner: DeepReadonly<Slider> | undefined = undefined) => {
    editingHeroBanner.value = banner
    showHeroBannerDialog.value = true
}

const closeHeroBannerDialog = () => {
    showHeroBannerDialog.value = false
    editingHeroBanner.value = undefined

    getSliders()
}


// Slider management functions
const handleDeleteSlider = async (slider: DeepReadonly<Slider>) => {

    if (confirm(`Are you sure you want to delete the slider "${slider.title}"?`)) {
        try {
            await deleteSlider(slider.id)
        } catch (error) {
            toast.error('Failed to delete slider. Please try again.')
        }
    }
}

const handleSliderSave = (action: string) => {
    getSliders()
}   


</script>