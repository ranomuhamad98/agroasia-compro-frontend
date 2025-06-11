<template>
    <div class="tp-home-testimoni">
        <div class="container">
            <div class="title">
                <p class="title__main">Let's Hear What They Say About Agro</p>
                <p class="title__sub">Here's all the success story of our farmers, mitra, and partners </p>
            </div>
            <div class="content" style="perspective: 1000px">
                <div ref="sliderRef" class="keen-slider">
                    <div v-for="item in testimoni" :key="item.name" class="keen-slider__slide content__item">
                        <div class="item__header">
                            <nuxt-img class="image" :src="item.avatar" :alt="item.name" width="70" height="70" />
                        </div>
                        <div class="item__content">
                            <p class="item__name">{{ item.name }}</p>
                            <p class="item__role">{{ item.role }}</p>
                            <p class="item__description">{{ item.description }}</p>
                        </div>
                    </div>
                </div>

                <div class="dots">
                    <button v-for="(_slide, idx) in testimoni" :key="idx" :class="{ dot: true, active: currentSlide === idx }"
                        @click="slider?.moveToIdx(idx)" />
                </div>

                <div v-if="slider" class="slider-controls">
                    <button @click="slider.prev()" class="nav-button nav-button--prev">
                        <icon name="mdi:arrow-left" />
                    </button>
                    <button @click="slider.next()" class="nav-button nav-button--next">
                        <icon name="mdi:arrow-right" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue'
import { ref } from 'vue'

const currentSlide = ref(0)
const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
        perView: 1, 
        spacing: 10,
    },
    slideChanged(s) {
        currentSlide.value = s.track.details.rel
    }
})

const testimoni = [
    {
        name: 'Sarah Johnson',
        role: 'Regular Customer',
        description: 'The quality of their organic products is exceptional. I love how fresh everything is and the customer service is outstanding.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
        name: 'Michael Chen',
        role: 'Business Owner',
        description: 'As a restaurant owner, I rely on consistent quality. Their produce has never disappointed me and delivery is always on time.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    {
        name: 'Emily Rodriguez',
        role: 'Food Blogger',
        description: 'I\'ve been documenting my cooking journey using their ingredients. The freshness and taste make such a difference in my recipes.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
    {
        name: 'David Wilson',
        role: 'Health Coach',
        description: 'I recommend their products to all my clients. The organic selection is impressive and you can taste the difference in quality.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
]
</script>