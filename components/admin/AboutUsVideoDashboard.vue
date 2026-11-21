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
                <label for="thumbnailAt" class="text-green-700 font-medium block">Thumbnail (menit:detik)</label>
                <input id="thumbnailAt" v-model="form.thumbnailAt" type="text"
                    placeholder="4:49"
                    class="input-field" />
                <p class="text-sm text-gray-600">
                    Frame pada waktu ini yang tampil sebelum video diputar. Contoh: 4:49.
                </p>
                <p v-if="thumbnailError" class="text-sm text-red-600">{{ thumbnailError }}</p>
                <p v-else-if="!thumbnailSetting" class="text-sm text-amber-700">
                    Baris pengaturan thumbnail belum ada. Jalankan SQL insert-nya dulu, lalu refresh.
                </p>
            </div>
            
            <div class="space-y-2 mb-4">
                <label class="text-green-700 font-medium block">Video Preview</label>
                <div class="aspect-video border-2 border-green-200 rounded-lg overflow-hidden bg-gray-100">
                    <div v-if="!videoId" class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <div class="text-4xl mb-2">📺</div>
                            <p>Masukkan URL YouTube untuk preview video</p>
                        </div>
                    </div>
                    <about-youtube-poster
                        v-else
                        :key="`${videoId}-${thumbnailSecond ?? 0}`"
                        :video-id="videoId"
                        :second="thumbnailSecond ?? 0"
                        :play-from-start="false"
                    />
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
import { useSectionSettingsApi } from '@/composables/useSectionSettingsApi';
import { useSectionManagement } from '@/composables/useSectionManagement';
import { formatThumbnailTime, isReadyThumbnailTime, parseThumbnailTime, youtubeVideoId } from '@/utils/youtubeTime';
import { toast } from 'vue3-toastify';

const {
    sectionSettings,
    refresh,
    pending: aboutVideoPending,
} = useSectionSettingsApi('page_about_us');

const form = ref({
    videoUrl: '',
    thumbnailAt: '',
})

const embedUrl = ref('');
const isUpdating = ref(false);
const formReady = ref(false);

const videoSetting = computed(() => sectionSettings.value.find((item) => item.tipe === 'video_link'))
const thumbnailSetting = computed(() => sectionSettings.value.find((item) => item.tipe === 'video_thumbnail_second'))
const videoId = computed(() => youtubeVideoId(embedUrl.value))
const thumbnailSecond = computed(() => {
    if (!isReadyThumbnailTime(form.value.thumbnailAt)) return null
    return parseThumbnailTime(form.value.thumbnailAt)
})
const thumbnailError = computed(() => {
    if (!form.value.thumbnailAt.trim()) return ''
    return thumbnailSecond.value === null ? 'Gunakan format menit:detik, misalnya 4:49.' : ''
})

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
watch(sectionSettings, (settings) => {
    if (formReady.value || !settings.length) return
    if (videoSetting.value?.value) {
        form.value.videoUrl = videoSetting.value.value
        validateAndConvertUrl()
    }
    if (thumbnailSetting.value?.value) {
        const seconds = Number.parseInt(thumbnailSetting.value.value, 10)
        if (Number.isFinite(seconds) && seconds >= 0) {
            form.value.thumbnailAt = formatThumbnailTime(seconds)
        }
    }
    formReady.value = true
}, { immediate: true });

const {
    updateSection,
} = useSectionManagement();

const handleRefresh = () => {
    formReady.value = false
    refresh();
}

const handleSave = async () => {
    if (!embedUrl.value || !videoSetting.value) {
        toast.error('URL YouTube tidak valid!');
        isUpdating.value = false;
        return;
    }
    if (form.value.thumbnailAt.trim() && thumbnailSecond.value === null) {
        toast.error('Waktu thumbnail tidak valid. Contoh: 4:49');
        return;
    }
    isUpdating.value = true;
    try {
        await updateSection(videoSetting.value.id, {
            value: embedUrl.value,
            position: videoSetting.value.position ?? 0,
        });
        if (form.value.thumbnailAt.trim()) {
            if (!thumbnailSetting.value) {
                toast.error('Baris thumbnail belum ada di database. Jalankan SQL insert-nya dulu.');
            } else {
                await updateSection(thumbnailSetting.value.id, {
                    value: String(thumbnailSecond.value),
                    position: thumbnailSetting.value.position ?? 1,
                });
            }
        }
        handleRefresh();
    } catch (error) {
        toast.error('Gagal menyimpan video URL, silahkan coba lagi');
    } finally {
        isUpdating.value = false;
    }
}
</script>