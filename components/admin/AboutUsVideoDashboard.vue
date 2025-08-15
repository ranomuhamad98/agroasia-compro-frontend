<template>
    <div class="card">
        <div class="card-header flex justify-between items-center">
            <h3 class="text-green-800 font-semibold text-xl mb-0 mx-2">About Us Video</h3>
            <div class="flex items-center gap-4">
                <button class="btn-ghost text-green-600 flex items-center gap-2" @click="handleRefresh">
                    <RefreshCcw class="w-4 h-4" />
                    Refresh
                </button>
            </div>
        </div>

        <!-- loading -->
        <div v-if="aboutVideoPending">
            <div class="flex justify-center items-center h-full gap-2 m-2">
                <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
                Loading...
            </div>
        </div>

        <div class="p-4">
            <div class="space-y-2 mb-4">
                <label for="videoUrl" class="text-green-700 font-medium block">Video URL (YouTube)</label>
                <input id="videoUrl" v-model="form.videoUrl" type="url"
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID atau https://youtu.be/VIDEO_ID" 
                    class="input-field" 
                    @input="validateAndConvertUrl" />
                <p class="text-sm text-gray-600">
                    Masukkan URL YouTube biasa, preview akan muncul secara otomatis.
                </p>
            </div>
            
            <div class="space-y-2 mb-4">
                <label class="text-green-700 font-medium block">Video Preview</label>
                <div class="aspect-video border-2 border-green-200 rounded-lg overflow-hidden bg-gray-100">
                    <div v-if="!embedUrl" class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <div class="text-4xl mb-2">📺</div>
                            <p>Masukkan URL YouTube untuk preview video</p>
                        </div>
                    </div>
                    <iframe v-else :src="embedUrl" 
                        class="w-full h-full" 
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            
            <button @click="handleSave" 
                :disabled="!embedUrl" 
                class="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'opacity-50 cursor-not-allowed': isUpdating }">
                <div v-if="isUpdating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <SaveIcon v-else class="w-4 h-4" />
                Save Video
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Loader2Icon, RefreshCcw, SaveIcon } from 'lucide-vue-next';
import { useAboutUsVideoApi } from '@/composables/useAboutUsVideoApi';
import { useSectionManagement } from '@/composables/useSectionManagement';
import { toast } from 'vue3-toastify';

const {
    aboutVideo,
    refreshAboutVideo,
    aboutVideoPending,
} = useAboutUsVideoApi();

const form = ref({
    videoUrl: '',
})

const embedUrl = ref('');
const isUpdating = ref(false);

// Fungsi untuk mengekstrak video ID dari berbagai format URL YouTube
const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
};

// Fungsi untuk mengkonversi URL YouTube ke format embed
const convertToEmbedUrl = (url: string): string => {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
};

// Fungsi untuk validasi dan konversi URL
const validateAndConvertUrl = () => {
    if (!form.value.videoUrl) {
        embedUrl.value = '';
        return;
    }
    
    const converted = convertToEmbedUrl(form.value.videoUrl);
    if (converted) {
        embedUrl.value = converted;
    } else {
        embedUrl.value = '';
    }
};

// Inisialisasi form dengan data yang ada
watch(aboutVideo, (newVal) => {
    if (newVal?.setting?.value) {
        form.value.videoUrl = newVal.setting.value;
        validateAndConvertUrl();
    }
}, { immediate: true });

const {
    updateSection,
} = useSectionManagement();

const handleRefresh = () => {
    refreshAboutVideo();
}

const handleSave = async () => {
    isUpdating.value = true;
    if (!embedUrl.value) {
        toast.error('URL YouTube tidak valid!');
        return;
    }
    try {
        await updateSection('18a211cef8a2de0d96fc0a9bb085a0d7', {
            value: embedUrl.value,
            position: 0,
        });
        handleRefresh();
    } catch (error) {
        toast.error('Gagal menyimpan video URL, silahkan coba lagi');
    } finally {
        isUpdating.value = false;
    }
    
}
</script>