<template>
    <div class="tp-home-spotlight">
        <div v-for="item in props.featured" :key="item.title" class="content__item">
            <div class="item__header">
                <nuxt-img class="image" :src="item.icon" :alt="item.title" height="90" />
            </div>
            <div class="item__content">
                <p class="item__title capitalize">{{ item.title }}</p>
                <p class="item__description capitalize">{{ item.content }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { Featured } from '../../types/home-api-type';

const props = defineProps<{
    featured: DeepReadonly<Featured[]>
}>()

const spotlight = [
    {
        title: '100% Natural',
        description: 'From handpicked sellers',
        icon: '/images/home/spotlight/branch.png',
    },
    {
        title: 'Shipping to 12+ Countries',
        description: 'always trusted for export',
        icon: '/images/home/spotlight/truck.png',
    },
    {
        title: 'Trusted by 1000+ Customer',
        description: 'customer satisfaction is our goal',
        icon: '/images/home/spotlight/vegetable.png',
    },
    {
        title: '5+ years dedication',
        description: 'we proud to always growth & committed to quality',
        icon: '/images/home/spotlight/year.png',
    }
    
]
</script>