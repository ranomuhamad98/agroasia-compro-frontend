<template>
    <div v-if="video" class="mb-100">
        <about-youtube-poster
            v-if="isYouTubeVideo && videoId && hasThumbnail"
            :video-id="videoId"
            :second="video.thumbnail_second || 0"
            class="tp-about-video"
        />
        <iframe
            v-else-if="isYouTubeVideo"
            :src="video.video_link"
            frameborder="0"
            allowfullscreen
            class="tp-about-video"
        />
        <video
            v-else
            :src="video.video_link"
            poster="/public/images/about/video-thumbnail.png"
            loop
            playsinline
            controls class="tp-about-video" />
    </div>
</template>

<script setup lang="ts">
import type { AboutVideo } from '@/types/about-api-type';
import { youtubeVideoId } from '@/utils/youtubeTime';

const props = defineProps<{
    video?: Readonly<AboutVideo>;
}>();

const isYouTubeVideo = computed(() => {
    return props.video?.video_link.includes('youtube.com') || props.video?.video_link.includes('youtu.be');
});

const videoId = computed(() => youtubeVideoId(props.video?.video_link || ''))
const hasThumbnail = computed(() => Number.isFinite(props.video?.thumbnail_second))
</script>

<style scoped>
.tp-about-video {
    width: 100vw;
    height: 100%;
    min-height: 350px;
}
</style>