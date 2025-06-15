<template>
    <div class="gallery-container">
        <div class="gallery-wrapper container">
            <div class="gallery-title">
                <h2>Galleries</h2>
                <p>Take a look on our product documentation</p>
            </div>
            <div class="gallery-content">
                <div ref="container" class="gallery-slider keen-slider">
                    <div v-for="image in product.images" :key="image" class="gallery-item keen-slider__slide">
                        <nuxt-img :src="image" :alt="product.name" />
                    </div>
                </div>
                <button class="gallery-nav prev" @click="slider?.prev()">
                    <Icon name="mynaui:arrow-left" class="icon-arrow" />
                </button>
                <button class="gallery-nav next" @click="slider?.next()">
                    <Icon name="mynaui:arrow-right" class="icon-arrow" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';
import { useKeenSlider } from 'keen-slider/vue';

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
    product: IProduct
}>();
</script>

<style scoped>
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
        font-size: 1.2rem;
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