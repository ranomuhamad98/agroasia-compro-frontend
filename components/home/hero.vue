<template>
    <div class="tp-home-hero">
        <div ref="sliderRef" class="keen-slider">
            <div v-for="(slide, index) in slides" :key="index" class="keen-slider__slide"
                :style="{ backgroundImage: `url(${slide.image})` }">
                <div class="slide-content">
                    <p>{{ slide.description }}</p>
                    <p>{{ slide.description2 }}</p>
                    <h2>{{ slide.title }}<br>{{ slide.title2 }}</h2>
                    <a class="cta-button" :href="slide.ctaLink">
                        {{ slide.cta }}
                        <Icon name="streamline:interface-arrows-right-arrow-right-keyboard" />
                    </a>
                </div>
            </div>
        </div>
        <button v-if="slider" class="arrow arrow--left" @click="slider.prev()">
            <Icon name="feather:chevron-left" />
        </button>
        <button v-if="slider" class="arrow arrow--right" @click="slider.next()">
            <Icon name="feather:chevron-right" />
        </button>
        <div v-if="slider" class="dots">
            <button v-for="(_slide, idx) in dotHelper" :key="idx" :class="{ dot: true, active: currentSlide === idx }"
                @click="slider.moveToIdx(idx)" />
        </div>
        <button v-if="slider" class="pause-button" @click="togglePause">
            <Icon :name="paused ? 'feather:play' : 'feather:pause'" size="16" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { computed, ref } from 'vue'

const slides = ref([
    {
        title: 'Healthy Food',
        title2: 'Happy for Life',
        description: '100% Genuine Products',
        description2: 'Global Supplier Of Premium Agricultural Commodities',
        cta: 'Explore Our Products',
        ctaLink: '/products',
        image: '/images/home/hero/bg.png'
    },
    {
        title: 'Organic Fruits',
        description: 'A wide variety of organic and delicious fruits.',
        cta: 'Explore',
        ctaLink: '/products',
        image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        title: 'Daily Deals',
        description: 'Check out our daily deals and save big!',
        cta: 'Explore Our Products',
        ctaLink: '/products',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
])

const currentSlide = ref(0)
const paused = ref(false)

const [sliderRef, slider] = useKeenSlider(
    {
        loop: true,
        initial: 0,
        created(s) {
            currentSlide.value = s.track.details.rel
        },
        slideChanged(s) {
            currentSlide.value = s.track.details.rel
        }
    },
    [
        (slider) => {
            let timeout: ReturnType<typeof setTimeout>
            let mouseOver = false
            function clearNextTimeout() {
                clearTimeout(timeout)
            }
            function nextTimeout() {
                clearTimeout(timeout)
                if (mouseOver || paused.value) return
                timeout = setTimeout(() => {
                    slider.next()
                }, 2000)
            }
            slider.on('created', () => {
                slider.container.addEventListener('mouseover', () => {
                    mouseOver = true
                    clearNextTimeout()
                })
                slider.container.addEventListener('mouseout', () => {
                    mouseOver = false
                    nextTimeout()
                })
                nextTimeout()
            })
            slider.on('dragStarted', clearNextTimeout)
            slider.on('animationEnded', nextTimeout)
            slider.on('updated', nextTimeout)
        },
    ]
)

const dotHelper = computed(() => {
    return slider.value ? [...Array(slider.value.track.details.slides.length).keys()] : []
})

function togglePause() {
    paused.value = !paused.value
    if (slider.value) {
        // Calling update will trigger the 'updated' event, which will call nextTimeout()
        // and resume the autoplay if not paused.
        slider.value.update()
    }
}
</script>

<style scoped>
.pause-button {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background: transparent;
    border: 1px solid #fff;
    color: white;
    cursor: pointer;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;
}

.pause-button:hover {
    background: var(--tp-theme-primary);
    border-color: var(--tp-theme-primary);
}
</style>
