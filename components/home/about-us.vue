<template>
    <div class="tp-home-about-base">
        <div class="tp-home-about-container">
            <div class="tp-home-about-image">
                <img :src="props.aboutUs.media_link" alt="about-us" />
            </div>
            <div class="tp-home-about-content">
                <div class="tp-home-about-title">
                    <img src="/images/home/about/icon.png" alt="about-us-icon" />
                    <h3>About Us</h3>
                </div>
                <div class="tp-home-about-content-container">
                    <p class="tp-home-title">{{ props.aboutUs.title }}</p>
                    <p class="tp-home-text-base">{{ props.aboutUs.sub_title }}</p>

                    <div v-for="item in props.aboutUs.list" :key="item.title" class="tp-home-about-content-list">
                        <div class="tp-home-about-content-list-header">
                            <img src="/images/home/about/check.png" alt="check" />
                            <p class="tp-home-subtitle">{{ item.title }}</p>
                        </div>
                        <div class="tp-home-about-content-list-description">
                            <p>{{ item.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { AboutUs } from '../../types/home-api-type';

const props = defineProps<{
    aboutUs: DeepReadonly<AboutUs>
}>()

// Array of available color classes
const colorClasses = ['color-green-medium', 'color-green-moss', 'color-green-light'];

// Computed property to generate random colors for each list item
const randomColors = computed(() => {
    if (!props.aboutUs?.list) return [];
    
    return props.aboutUs.list.map(() => {
        const randomIndex = Math.floor(Math.random() * colorClasses.length);
        return colorClasses[randomIndex];
    });
});
</script>