<template>
    <div class="know-more-area-wrapper">
        <div class="know-more-area container">
            <div class="know-more-content">
                <h2 class="know-more-area__title">{{ activeMilestones?.title }}</h2>
                <p class="know-more-area__subtitle">{{ activeMilestones?.sub_title }}</p>
                <div class="know-more-area__description">
                    <p>{{ activeMilestones?.content }}</p>
                </div>
                <!-- <div class="know-more-area-author">
                    <p class="know-more-area-author__name">Rano Muhammad</p>
                    <p class="know-more-area-author__subtitle">/ Pemilik Kafe</p>
                </div> -->
            </div>
            <div class="know-more-area-image">
                <nuxt-img :src="activeMilestones?.media_link" alt="about-img" width="542" />
            </div>
        </div>
        <div class="know-more-history container">
            <div class="history-startpoint">
                <span>{{ activeMilestones?.tahun }}</span>
            </div>
            <div class="history-endpoint">
                <span
                    v-for="milestone in milestones"
                    :key="milestone.id"
                    @click="handleMilestoneClick(milestone)"
                >{{ milestone.tahun }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AboutMilestone } from '@/types/about-api-type';

const props = defineProps<{
    milestones: readonly AboutMilestone[]
}>()

const activeMilestones = ref<AboutMilestone | undefined>(props.milestones[0])

const setActiveMilestone = (selectedMilestone: AboutMilestone) => {
    activeMilestones.value = props.milestones.find((milestone: AboutMilestone) => milestone.position === selectedMilestone.position)
}

const milestones = computed(() => {
    return props.milestones
        .filter((milestone: AboutMilestone) => milestone.position !== activeMilestones.value?.position)
        .map((milestone: AboutMilestone) => ({
            title: milestone.title,
            sub_title: milestone.sub_title,
            content: milestone.content,
            media_link: milestone.media_link,
            tahun: milestone.tahun,
            position: milestone.position,
            id: milestone.id
        }))
})

const handleMilestoneClick = (milestone: AboutMilestone) => {
    setActiveMilestone(milestone)
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.know-more-area {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 4rem;
    margin-bottom: 5rem;

    @media (max-width: 480px) {
        flex-direction: column-reverse;
    }

    &__title {
        font-family: Nunito;
        color: var(--tp-green-light);
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 1rem;
    }

    &__subtitle {
        font-family: Inter;
        font-size: 2.3rem;
        font-weight: 600;
        color: var(--tp-common-black);
        max-width: 400px;
        width: 100%;
        line-height: 1.2;
        margin-bottom: 1.5rem;
    }

    &__description {
        font-family: Nunito;
        width: 100%;
        max-width: 55vw;
        min-height: 250px;

        p {
            font-size: 1rem;
            font-weight: normal;
            color: var(--tp-blue-old-slate);
            line-height: 1.5;
            margin-bottom: 1rem;
        }
    }

    &-image {
        width: 100%;
        max-width: 542px;

        img {
            width: 100%;
            height: 100%;
            border-radius: .5rem;
            object-fit: cover;
        }
    }

    &-author {
        margin: 2rem 0;

        p {
            font-size: 1rem;
            margin-bottom: 0;
        }

        &__name {
            font-family: Inter;
            font-weight: 600;
            color: var(--tp-common-black);
        }

        &__subtitle {
            font-family: Nunito;
            color: var(--tp-blue-slate);
            font-weight: lighter;
        }
    }
}

.know-more-history {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
    margin-bottom: 10rem;

    .history {

        &-startpoint {
            height: 100%;

            span {
                font-size: 8rem;
                line-height: 1;
                color: var(--tp-green-light);
                font-weight: 600;
                opacity: 0.3;
                transition: all 0.3s ease;
            }
        }

        &-endpoint {
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 2rem;
            border-top: 1px solid var(--tp-green-light);
            margin-top: 1rem;
            padding-top: 1.5rem;
            flex-grow: 1;
            flex-wrap: wrap;

            span {
                font-size: 1rem;
                font-weight: normal;
                color: var(--tp-green-light);
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;

                &:last-child {
                    color: var(--tp-green-moss);
                    &::before {
                        background-color: var(--tp-green-moss);
                    }
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: -2rem;
                    left: calc(50% - 0.5rem);
                    border-radius: 50%;
                    background-color: var(--tp-green-light);
                    height: 1rem;
                    width: 1rem;
                }

                &:hover {
                    color: var(--tp-common-white);
                    background-color: var(--tp-green-moss);
                    padding: 0 1rem;
                    border-radius: 0.3rem;
                    &::before {
                        background-color: var(--tp-common-white);
                        outline: 2px solid var(--tp-green-moss);
                    }
                }
            }
        }
    }
}
</style>