<template>
    <div v-if="video" class="mb-100">
        <iframe
            v-if="isYouTubeVideo"
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

const props = defineProps<{
    video?: Readonly<AboutVideo>;
}>();

const isYouTubeVideo = computed(() => {
    return props.video?.video_link.includes('youtube.com') || props.video?.video_link.includes('youtu.be');
});
</script>

<style scoped>
.tp-about-video {
    width: 100vw;
    height: 100%;
    min-height: 350px;
}
</style>