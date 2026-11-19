<template>
    <div class="know-more-area-wrapper">
        <div class="know-more-area container">
            <div class="know-more-content">
                <Transition :name="transitionName" mode="out-in">
                    <div :key="activeMilestones?.id" class="know-more-story">
                        <h2 class="know-more-area__title">{{ activeMilestones?.title }}</h2>
                        <p class="know-more-area__subtitle">{{ activeMilestones?.sub_title }}</p>
                        <div class="know-more-area__description">
                            <p>{{ activeMilestones?.content }}</p>
                        </div>
                    </div>
                </Transition>
            </div>
            <div class="know-more-area-image">
                <Transition :name="transitionName" mode="out-in">
                    <img
                        :key="activeMilestones?.id"
                        :src="activeMilestones?.media_link"
                        :alt="activeMilestones?.sub_title || 'Milestone'"
                        width="542"
                    />
                </Transition>
            </div>
        </div>
        <div class="know-more-history container">
            <div class="history-startpoint">
                <Transition name="year-swap" mode="out-in">
                    <span :key="activeMilestones?.tahun">{{ activeMilestones?.tahun }}</span>
                </Transition>
            </div>
            <div ref="trackRef" class="history-endpoint">
                <span class="history-marker" :style="{ left: `${markerLeft}px` }"></span>
                <button
                    v-for="milestone in orderedMilestones"
                    :key="milestone.id"
                    type="button"
                    :ref="(el) => setYearRef(milestone.id, el)"
                    :class="{ 'is-active': milestone.id === activeMilestones?.id }"
                    @click="handleMilestoneClick(milestone)"
                >{{ milestone.tahun }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AboutMilestone } from '@/types/about-api-type';

const props = defineProps<{
    milestones: readonly AboutMilestone[]
}>()

const orderedMilestones = computed(() => {
    return [...props.milestones].sort((a, b) => a.position - b.position || a.tahun - b.tahun)
})

const activeMilestones = ref<AboutMilestone | undefined>(orderedMilestones.value[0])
const transitionName = ref('timeline-forward')
const trackRef = ref<HTMLElement | null>(null)
const markerLeft = ref(0)
const yearRefs = new Map<string, HTMLElement>()

const setYearRef = (id: string, el: unknown) => {
    if (el instanceof HTMLElement) {
        yearRefs.set(id, el)
        return
    }
    if (!el) yearRefs.delete(id)
}

const moveMarker = () => {
    const activeId = activeMilestones.value?.id
    const year = activeId ? yearRefs.get(activeId) : undefined
    if (!year) return
    markerLeft.value = year.offsetLeft + year.offsetWidth / 2
}

const handleMilestoneClick = (milestone: AboutMilestone) => {
    if (milestone.id === activeMilestones.value?.id) return

    const currentIndex = orderedMilestones.value.findIndex((item) => item.id === activeMilestones.value?.id)
    const nextIndex = orderedMilestones.value.findIndex((item) => item.id === milestone.id)
    transitionName.value = nextIndex > currentIndex ? 'timeline-forward' : 'timeline-back'
    activeMilestones.value = milestone
    nextTick(moveMarker)
}

watch(orderedMilestones, (list) => {
    if (!list.length) {
        activeMilestones.value = undefined
        return
    }
    const stillVisible = list.some((item) => item.id === activeMilestones.value?.id)
    if (!stillVisible) activeMilestones.value = list[0]
    nextTick(moveMarker)
}, { immediate: true })

onMounted(() => {
    nextTick(moveMarker)
    window.addEventListener('resize', moveMarker)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', moveMarker)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.know-more-story {
    min-height: 320px;
}

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
        min-height: 280px;
        overflow: hidden;
        border-radius: .5rem;

        img {
            width: 100%;
            height: 100%;
            min-height: 280px;
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
            position: relative;
            flex-shrink: 0;
            width: 4.2ch;
            height: 1em;
            font-size: 8rem;
            line-height: 1;

            span {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 1em;
                line-height: 1;
                color: var(--tp-green-light);
                font-weight: 600;
                opacity: 0.3;
            }
        }

        &-endpoint {
            position: relative;
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 2rem;
            border-top: 1px solid var(--tp-green-light);
            margin-top: 1rem;
            padding-top: 1.5rem;
            flex-grow: 1;
            flex-wrap: nowrap;
            overflow-x: auto;

            .history-marker {
                position: absolute;
                top: -0.5rem;
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background-color: var(--tp-green-moss);
                box-shadow: 0 0 0 6px rgba(128, 181, 0, 0.22);
                transform: translateX(-50%);
                transition: left 0.55s cubic-bezier(0.22, 1, 0.36, 1);
                pointer-events: none;
                z-index: 1;
            }

            button {
                appearance: none;
                border: 0;
                background: transparent;
                font-family: inherit;
                font-size: 1rem;
                font-weight: normal;
                color: var(--tp-green-light);
                position: relative;
                cursor: pointer;
                padding: 0 1rem;
                white-space: nowrap;
                transition: color 0.35s ease, font-weight 0.35s ease;

                &::before {
                    content: '';
                    position: absolute;
                    top: -2rem;
                    left: calc(50% - 0.35rem);
                    border-radius: 50%;
                    background-color: var(--tp-green-light);
                    height: 0.7rem;
                    width: 0.7rem;
                    transition: opacity 0.35s ease, transform 0.35s ease;
                }

                &.is-active {
                    color: var(--tp-green-moss);
                    font-weight: 700;

                    &::before {
                        opacity: 0;
                    }
                }

                &:hover:not(.is-active) {
                    color: var(--tp-green-moss);
                }
            }
        }
    }
}

.timeline-forward-enter-active,
.timeline-forward-leave-active,
.timeline-back-enter-active,
.timeline-back-leave-active,
.year-swap-enter-active,
.year-swap-leave-active {
    transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.timeline-forward-enter-from,
.timeline-back-leave-to {
    opacity: 0;
    transform: translateX(36px);
}

.timeline-forward-leave-to,
.timeline-back-enter-from {
    opacity: 0;
    transform: translateX(-36px);
}

.year-swap-enter-from {
    opacity: 0;
    transform: translateY(16px);
}

.year-swap-leave-to {
    opacity: 0;
    transform: translateY(-16px);
}

@media (prefers-reduced-motion: reduce) {
    .history-marker,
    .timeline-forward-enter-active,
    .timeline-forward-leave-active,
    .timeline-back-enter-active,
    .timeline-back-leave-active,
    .year-swap-enter-active,
    .year-swap-leave-active {
        transition: none;
    }
}
</style>