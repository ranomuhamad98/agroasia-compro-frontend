<template>
    <div class="yt-poster" :class="{ 'is-banner': banner }">
        <div ref="mount" class="yt-poster__player" :class="{ 'is-poster': playFromStart }"></div>
        <button v-if="playFromStart" type="button" class="yt-poster__play" aria-label="Play video" @click="openPopup">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.2-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z"/>
            </svg>
        </button>
    </div>
    <Teleport to="body">
        <div v-if="popupOpen" class="yt-popup" @click.self="closePopup">
            <button type="button" class="yt-popup__close" aria-label="Close video" @click="closePopup">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6Z"/>
                </svg>
            </button>
            <div ref="popupMount" class="yt-popup__frame"></div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    videoId: string
    second: number
    playFromStart?: boolean
    banner?: boolean
}>(), {
    playFromStart: true,
    banner: false,
})

const mount = ref<HTMLElement | null>(null)
const popupMount = ref<HTMLElement | null>(null)
const popupOpen = ref(false)
let posterPlayer: any = null
let popupPlayer: any = null
let posterReady = false
let holdingFrame = false

function loadYouTubeApi() {
    const win = window as any
    if (win.YT?.Player) return Promise.resolve()
    if (!win.__ytApiPromise) {
        win.__ytApiPromise = new Promise<void>((resolve) => {
            const previous = win.onYouTubeIframeAPIReady
            win.onYouTubeIframeAPIReady = () => {
                previous?.()
                resolve()
            }
            const script = document.createElement('script')
            script.src = 'https://www.youtube.com/iframe_api'
            document.head.appendChild(script)
        })
    }
    return win.__ytApiPromise as Promise<void>
}

function createPlayer(container: HTMLElement, options: Record<string, unknown>) {
    const win = window as any
    if (!win.YT?.Player) return null
    container.innerHTML = ''
    const target = document.createElement('div')
    container.appendChild(target)
    return new win.YT.Player(target, options)
}

function holdFrame(target = posterPlayer) {
    if (!target) return
    holdingFrame = true
    target.seekTo(props.second, true)
    target.pauseVideo()
    target.unMute?.()
    window.setTimeout(() => {
        holdingFrame = false
    }, 700)
}

function mountPoster() {
    const win = window as any
    if (!mount.value) return
    posterReady = false
    posterPlayer?.destroy?.()
    posterPlayer = createPlayer(mount.value, {
        videoId: props.videoId,
        playerVars: {
            start: props.second,
            autoplay: 1,
            mute: 1,
            controls: props.playFromStart ? 0 : 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
        },
        events: {
            onStateChange: (event: { data: number, target: any }) => {
                if (holdingFrame || event.data !== win.YT.PlayerState.PLAYING) return
                if (!posterReady) {
                    posterReady = true
                    holdFrame(event.target)
                    return
                }
                if (!props.playFromStart) event.target.seekTo(0, true)
            },
        },
    })
}

function mountPopup() {
    const win = window as any
    if (!popupMount.value) return
    let rewound = false
    popupPlayer?.destroy?.()
    popupPlayer = createPlayer(popupMount.value, {
        videoId: props.videoId,
        playerVars: {
            start: 0,
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
        },
        events: {
            onReady: (event: { target: any }) => {
                event.target.seekTo(0, true)
                event.target.playVideo()
            },
            onStateChange: (event: { data: number, target: any }) => {
                if (rewound || event.data !== win.YT.PlayerState.PLAYING) return
                rewound = true
                if (event.target.getCurrentTime() > 1) event.target.seekTo(0, true)
            },
        },
    })
}

async function openPopup() {
    popupOpen.value = true
    document.body.style.overflow = 'hidden'
    await nextTick()
    mountPopup()
}

function closePopup() {
    popupPlayer?.destroy?.()
    popupPlayer = null
    popupOpen.value = false
    document.body.style.overflow = ''
    holdFrame()
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && popupOpen.value) closePopup()
}

watch(() => [props.videoId, props.second], () => {
    if (posterPlayer?.seekTo) holdFrame()
})

onMounted(async () => {
    window.addEventListener('keydown', onKeydown)
    await loadYouTubeApi()
    mountPoster()
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    posterPlayer?.destroy?.()
    popupPlayer?.destroy?.()
    posterPlayer = null
    popupPlayer = null
    document.body.style.overflow = ''
})
</script>

<style scoped>
.yt-poster {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #111;
    overflow: hidden;
}

.yt-poster.is-banner {
    width: 100vw;
    height: 350px;
    aspect-ratio: auto;
}

.yt-poster__player,
.yt-poster :deep(iframe),
.yt-popup__frame,
.yt-popup__frame :deep(iframe) {
    width: 100%;
    height: 100%;
}

.yt-poster__player.is-poster,
.yt-poster__player.is-poster :deep(iframe) {
    pointer-events: none;
}

.yt-poster__play {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    color: #fff;
    cursor: pointer;
}

.yt-poster__play svg {
    width: 72px;
    height: 72px;
    padding: 18px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.55);
}

.yt-popup {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 4.5rem 1.25rem 1.5rem;
    background: rgba(0, 0, 0, 0.72);
}

.yt-popup__frame {
    width: min(960px, 100%);
    aspect-ratio: 16 / 9;
    background: #000;
}

.yt-popup__close {
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

.yt-popup__close svg {
    width: 1.25rem;
    height: 1.25rem;
}
</style>
