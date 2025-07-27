<template>
    <div class="tp-home-product">
        <div class="container">
            <div class="container__left">
                <div class="title">
                    <p class="title__main">100% Geniuine Products</p>
                    <p class="title__sub">We Provide</p>
                </div>
                <div class="content">
                    <div v-for="item in services" :key="item.title" class="content__item">
                        <div class="item__header">
                            <nuxt-img class="item__icon" src="/images/home/about/check.png" alt="check" width="26"
                                height="26" />
                        </div>
                        <div>
                            <p class="item__title">{{ item.title }}</p>
                            <p class="item__description">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
                <nuxt-img class="thumbnail" :src="props.topProductSection.image" alt="thumbnail" width="400"
                    height="100%" />
            </div>
            <div class="container__right">
                <div class="title">
                    <p class="title__sub">{{ props.topProductSection.title }}</p>
                    <p class="title__main">Top Products</p>
                </div>
                <div class="content">
                    <div v-for="item in topProducts" :key="item.id" class="content__item">
                        <div class="item__header">
                            <nuxt-img class="image" :src="item.image" alt="check"
                                width="90" height="90" />
                        </div>
                        <div class="item__content">
                            <p class="item__title">{{ item.name }}</p>
                            <p class="item__description">{{ item.summary.slice(0, 100) }}...</p>
                            <a :href="`https://wa.me?text=I'm interested in ${item.name}`" target="_blank"
                                rel="noopener" class="item__button">
                                <icon name="mdi:whatsapp" class="item__button-icon" />
                                <span>Pesan Sekarang!</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TopProductSection } from '../../types/home-api-type';

const props = defineProps<{
    topProducts: readonly any[]
    topProductSection: Readonly<TopProductSection>
}>()

const services = [
    {
        title: 'Export Management',
        description: 'End-to-end export handling from farm to global market.',
    },
    {
        title: 'Direct Product Sales',
        description: 'Supplying quality goods directly from trusted farmers.',
    },
    {
        title: 'Farmer Empowerment',
        description: 'Training and support from planting to harvest.'
    }
]
const products = [
    {
        title: 'Corn',
        description: 'Lorem ipsum dolor sit amet',
        image: '/images/home/product/corn.png',
    },
    {
        title: 'Nut Meg',
        description: 'Lorem ipsum dolor sit amet',
        image: '/images/home/product/nut-meg.png',
    },
    {
        title: 'Black Pepper',
        description: 'Lorem ipsum dolor sit amet',
        image: '/images/home/product/black-peper.png',
    },
    {
        title: 'Palm Sugar',
        description: 'Lorem ipsum dolor sit amet',
        image: '/images/home/product/palm-sugar.png',
    },

]
</script>