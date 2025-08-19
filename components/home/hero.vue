<template>
    <div class="tp-home-hero">
        <!-- Show slider only when slides exist -->
        <div v-if="props.slides && props.slides.length > 0" ref="sliderRef" class="keen-slider">
            <div v-for="(slide, index) in props.slides" :key="index" class="keen-slider__slide"
                :style="{ backgroundImage: `url(${getImageUrl(slide.image)})` }">
                <div class="slide-content">
                    <p v-html="$sanitize(slide.sub_title)"></p>
                    <h2>{{ slide.title }}</h2>
                    <a class="cta-button" :href="slide.button_link">
                        {{ slide.button_title }}
                        <Icon name="streamline:interface-arrows-right-arrow-right-keyboard" />
                    </a>
                </div>
            </div>
        </div>

        <!-- Slider controls - only show when slides exist and slider is initialized -->
        <template v-if="props.slides && props.slides.length > 0 && slider">
            <button class="arrow arrow--left" @click="slider.prev()">
                <Icon name="feather:chevron-left" />
            </button>
            <button class="arrow arrow--right" @click="slider.next()">
                <Icon name="feather:chevron-right" />
            </button>
            <div class="dots">
                <button v-for="(_slide, idx) in dotHelper" :key="idx" :class="{ dot: true, active: currentSlide === idx }"
                    @click="slider.moveToIdx(idx)" />
            </div>
            <button class="pause-button" @click="togglePause">
                <Icon :name="paused ? 'feather:play' : 'feather:pause'" size="16" />
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { computed, ref, type DeepReadonly } from 'vue'
import type { Slider } from '@/types/home-api-type';

const props = defineProps<{
    slides: DeepReadonly<Slider[]>
}>()

const getImageUrl = (image: string) => {
    return image ? image : "https://images.unsplash.com/photo-1754770584877-73ba9341671c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}

const currentSlide = ref(0)
const paused = ref(false)

// Only initialize slider when slides exist
const [sliderRef, slider] = props.slides && props.slides.length > 0 ? useKeenSlider(
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
) : [ref(null), ref(null)]

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
.hero-empty-state {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #666;
}

.empty-content {
    text-align: center;
    padding: 2rem;
}

.empty-content h2 {
    margin-bottom: 1rem;
    color: #333;
}

.empty-content p {
    color: #666;
    font-size: 1rem;
}

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
