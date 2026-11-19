<template>
    <div class="tp-home-category-wrapper">
        <div class="tp-home-category-base">
            <div class="tp-home-category-title-container">
                <h3 class="tp-home-title">Cari Kategori Belanjaanmu Disini</h3>
                <p class="tp-home-text-base">Produk - produk terbaik dan terpopuler yang bisa kamu cari dari Agro!</p>
            </div>
            <div class="tp-home-category-container">
                <div v-for="(category, index) in categories" :key="category.id" :class="`tp-home-category-card ${randomColors[index]}`">
                    <h4 class="tp-home-category-title">{{ category.name }}</h4>
                    <!-- <p class="tp-home-category-subtitle tp-home-category-card-description">{{ category.product_count }}
                        Produk</p> -->
                    <img :src="category.image" :alt="category.name" class="tp-home-category-image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { Category } from '../../types/home-api-type';

const props = defineProps<{
    categories: DeepReadonly<Category[]>
}>()

// Array of available color classes
const colorClasses = ['color-green-medium', 'color-green-moss', 'color-green-light'];

// Simple hash function to convert string to number
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

// Computed property to deterministically assign colors based on category ID
const randomColors = computed(() => {
    if (!props.categories) return [];
    
    return props.categories.map((category) => {
        // Use hashed category ID to deterministically assign color (same result on server and client)
        const colorIndex = hashString(category.id) % colorClasses.length;
        return colorClasses[colorIndex];
    });
});
</script>