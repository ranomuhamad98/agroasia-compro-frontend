<template>
    <div class="gallery-container">
        <div class="gallery-wrapper container">
            <div class="gallery-title">
                <h2>Galleries</h2>
                <p>Take a look on our product documentation</p>
            </div>
            <div class="gallery-content">
                <div ref="container" class="gallery-slider keen-slider">
                    <div v-for="image in product.gallery" :key="image.image" class="gallery-item keen-slider__slide">
                        <img :src="image.image" :alt="product.name" />
                    </div>
                </div>
                <button type="button" class="gallery-nav prev" aria-label="Previous photos" @click="slider?.prev()">
                    <svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M14.71 6.71a1 1 0 0 0-1.42 0L8.71 11.3a1 1 0 0 0 0 1.4l4.58 4.59a1 1 0 0 0 1.42-1.42L10.83 12l3.88-3.88a1 1 0 0 0 0-1.41Z"/>
                    </svg>
                </button>
                <button type="button" class="gallery-nav next" aria-label="Next photos" @click="slider?.next()">
                    <svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.42L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.58-4.58a1 1 0 0 0 0-1.42L10.71 6.7a1 1 0 0 0-1.42 0Z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProductDetail } from '@/types/product-detail-api-types';
import type { DeepReadonly } from 'vue';
import { useKeenSlider } from 'keen-slider/vue.es';

const [container, slider] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
        perView: 4,
        spacing: 15,
    },
    breakpoints: {
        '(max-width: 768px)': {
            slides: {
                perView: 2,
                spacing: 15,
            }
        }
    }
})

defineProps<{
    product: DeepReadonly<ProductDetail>
}>();
</script>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.gallery-container {
    background-color: var(--tp-common-white);
    padding: 50px 0;
}

.gallery-content {
    position: relative;
}

.gallery-title {
    margin: 0 4rem 2rem 4rem;
    h2, p {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        margin: 0 2rem 2rem 2rem;
    }
}

.gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--tp-common-white);
    border: 1px solid var(--tp-green-light);
    color: var(--tp-green-light);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    transition: all 0.3s ease;

    .icon-arrow {
        width: 22px;
        height: 22px;
        display: block;
    }

    &:hover {
        background: var(--tp-green-light);
        color: var(--tp-common-white);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.gallery-nav.prev {
    left: 10px;
}

.gallery-nav.next {
    right: 10px;
}

.gallery-slider {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4rem;

    @media (max-width: 768px) {
        padding: 0;
    }
}

.gallery-item {
    height: 200px;
    border: 1rem solid var(--tp-grey-light);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>