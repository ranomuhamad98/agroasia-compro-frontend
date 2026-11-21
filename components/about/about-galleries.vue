<template>
    <div v-if="props.gallery.length > 0" class="gallery-container mb-100 mt-100">
        <div class="gallery-wrapper container">
            <div class="gallery-title">
                <h2>Galleries</h2>
                <p>A look at our people, farms, and partnerships</p>
            </div>
            <div class="gallery-content" @mouseenter="pauseForHover" @mouseleave="resumeAfterHover">
                <div ref="container" class="gallery-slider keen-slider" @click="openGalleryImage">
                    <div v-for="image in props.gallery" :key="image.image_link" class="gallery-item keen-slider__slide">
                        <img :src="image.image_link" :alt="image.alt" />
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
    <div v-if="selectedImage" class="gallery-lightbox" @click.self="selectedImage = null">
        <button type="button" class="gallery-lightbox__close" aria-label="Close photo" @click="selectedImage = null">
            <X class="w-6 h-6" />
        </button>
        <figure class="gallery-lightbox__frame">
            <img :src="selectedImage.image_link" :alt="selectedImage.alt || ''" />
            <figcaption v-if="selectedImage.alt">{{ selectedImage.alt }}</figcaption>
        </figure>
    </div>
</template>

<script setup lang="ts">
import type { Gallery } from '@/types/about-api-type';
import { useKeenSlider } from 'keen-slider/vue.es';
import type { DeepReadonly } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
    gallery: DeepReadonly<Gallery[]>
}>()

const selectedImage = ref<Gallery | null>(null)
const hovered = ref(false)
const AUTOPLAY_MS = 3000
let stopAutoplay = () => {}
let scheduleAutoplay = () => {}

const [container, slider] = useKeenSlider({
    loop: true,
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
}, [
    (instance) => {
        let autoplayTimer: ReturnType<typeof setTimeout> | undefined
        stopAutoplay = () => clearTimeout(autoplayTimer)
        scheduleAutoplay = () => {
            clearTimeout(autoplayTimer)
            if (hovered.value || selectedImage.value) return
            if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            if (props.gallery.length < 2) return
            autoplayTimer = setTimeout(() => instance.next(), AUTOPLAY_MS)
        }
        instance.on('created', scheduleAutoplay)
        instance.on('dragStarted', stopAutoplay)
        instance.on('animationEnded', scheduleAutoplay)
        instance.on('updated', scheduleAutoplay)
    }
])

function pauseForHover() {
    hovered.value = true
    stopAutoplay()
}

function resumeAfterHover() {
    hovered.value = false
    scheduleAutoplay()
}

function openGalleryImage(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof Element)) return
    const src = target.closest('.gallery-item')?.querySelector('img')?.getAttribute('src')
    if (!src) return
    const match = props.gallery.find((item) => item.image_link === src)
    if (match) selectedImage.value = match
}

watch(selectedImage, async (image) => {
    if (image) {
        stopAutoplay()
        return
    }
    await nextTick()
    hovered.value = !!container.value?.parentElement?.matches(':hover')
    if (!hovered.value) scheduleAutoplay()
})

onBeforeUnmount(stopAutoplay)

const images = [
    {
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        alt: 'Team working together in modern office'
    },
    {
        img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf',
        alt: 'People collaborating on project'
    },
    {
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        alt: 'Business team meeting in conference room'
    },
    {
        img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        alt: 'Creative team working at desks'
    },
    {
        img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        alt: 'Creative team working at desks'
    },
    {
        img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        alt: 'Creative team working at desks'
    },
]
    

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
        font-family: 'Nunito', "Nunito Fallback: Arial", sans-serif;
    }

    @media (max-width: 768px) {
        margin: 0 2rem 2rem 2rem;
    }
}

.gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid var(--tp-green-light);
    color: var(--tp-green-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
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

    @media (max-width: 768px) {
        padding: 0;
    }
}

.gallery-item {
    height: 200px;
    border: 1rem solid var(--tp-grey-light);
    cursor: pointer;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gallery-lightbox {
    position: fixed;
    inset: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 4.5rem 1.25rem 1.5rem;
    background: rgba(0, 0, 0, 0.72);
}

.gallery-lightbox__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 0;
    border-radius: 999px;
    background: #fff;
    color: #111;
    cursor: pointer;
}

.gallery-lightbox__frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    min-height: 0;
}

.gallery-lightbox__frame img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: calc(100vh - 7.5rem);
    max-height: calc(100dvh - 7.5rem);
    object-fit: contain;
}

.gallery-lightbox__frame figcaption {
    margin-top: 0.75rem;
    color: #fff;
    text-align: center;
}
</style>
