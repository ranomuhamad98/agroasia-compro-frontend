<template>
    <div v-if="props.ourValues" class="mb-100 mt-100">
        <div class="ov-container container">
            <div class="ov-left">
                <div class="ov-left-header">
                    <img src="/images/home/about/icon.png" alt="about-us-icon" />
                    <h3>Our Values</h3>
                </div>
                <div class="ov-left-content">
                    <p class="tp-home-text-base ov-items__description">Our Missions</p>
                    <p class="ov-left-content__title">{{ props.ourValues.title }}</p>
                </div>
            </div>
            <div class="ov-right">
                <div class="ov-right-content">
                    <p class="tp-home-title">{{ props.ourValues.sub_title }}</p>
                    <p class="tp-home-text-base ov-items__description">Our Missions</p>

                    <div v-for="item in aboutUs" :key="item.title" class="tp-home-about-content-list">
                        <div class="tp-home-about-content-list-header ov-items__title">
                            <img src="/images/home/about/check.png" alt="check" />
                            <p class="tp-home-subtitle">{{ item.title }}</p>
                        </div>
                        <div class="tp-home-about-content-list-description ov-items__description">
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AboutValue, AboutValueSection } from '@/types/about-api-type';
import type { DeepReadonly } from 'vue';

const props = defineProps<{
    ourValues?: DeepReadonly<AboutValueSection>
}>()

const aboutUs = computed(() => {
    return props.ourValues?.list.map((item: AboutValue) => ({
        title: item.title,
        description: item.content
    }))
})

// const aboutUs = [
//     {
//         title: 'Implement advanced agricultural management technologies',
//         description: 'We apply modern and sustainable farming techniques to improve soil health, increase crop productivity, and ensure long-term agricultural viability.',
//     },
//     {
//         title: 'Facilitate the export of agricultural products directly from farmers',
//         description: 'By connecting local farmers to international markets, we help increase their income, reduce dependency on middlemen, and boost the competitiveness of Indonesia’s agricultural sector.',
//     },
//     {
//         title: 'Provide integrated solutions from upstream to downstream',
//         description: 'We offer a comprehensive ecosystem—from cultivation support to post-harvest handling and export logistics—ensuring product quality and supply chain efficiency at every step.',
//     }
// ]
</script>

<style scoped lang="scss">
.ov-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

.ov-left {

    &-header {
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-bottom: 1rem;

        img {
            width: 2.3rem;
            height: 2.3rem;
        }

        h3 {
            margin-bottom: 0;
            font-family: Inter;
            font-weight: 700;
            font-size: 2rem;
        }
    }

    &-content {
        margin-left: 2.8rem;
        font-family: Nunito;

        @media (max-width: 768px) {
            margin-left: 0;
        }
    
        &__title {
            font-family: Inter;
            font-weight: 700;
            font-size: 3rem;
            line-height: 1.2;
            color: var(--tp-common-black);
            width: auto;
        }
    }
}

.ov-items__title {
    font-family: Inter;
}

.ov-items__description {
    font-family: Nunito;
}
</style>