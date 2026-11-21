<template>
    <div class="yt-poster">
        <div ref="mount" class="yt-poster__player" :class="{ 'is-poster': playFromStart && !started }"></div>
        <button v-if="playFromStart && !started" type="button" class="yt-poster__play" aria-label="Play video" @click="startPlayback">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.2-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z"/>
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    videoId: string
    second: number
    playFromStart?: boolean
}>(), {
    playFromStart: true,
})

const mount = ref<HTMLElement | null>(null)
const started = ref(false)
let player: any = null
let posterReady = false
let holdingFrame = false

function createPlayer(options: Record<string, unknown>) {
    const win = window as any
    if (!mount.value || !win.YT?.Player) return
    player?.destroy?.()
    mount.value.innerHTML = ''
    const target = document.createElement('div')
    mount.value.appendChild(target)
    player = new win.YT.Player(target, options)
}

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

function holdFrame(target = player) {
    if (!target || started.value) return
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
    posterReady = false
    createPlayer({
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
                if (started.value || holdingFrame || event.data !== win.YT.PlayerState.PLAYING) return
                if (!posterReady) {
                    posterReady = true
                    holdFrame(event.target)
                    return
                }
                started.value = true
                event.target.seekTo(0, true)
            },
        },
    })
}

function startPlayback() {
    const win = window as any
    started.value = true
    let rewound = false
    createPlayer({
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

watch(() => [props.videoId, props.second], () => {
    if (started.value) return
    if (player?.seekTo) holdFrame()
})

onMounted(async () => {
    await loadYouTubeApi()
    mountPoster()
})

onBeforeUnmount(() => {
    player?.destroy?.()
    player = null
})
</script>

<style scoped>
.yt-poster {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #111;
}

.yt-poster__player,
.yt-poster :deep(iframe) {
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
    background: rgba(0, 0, 0, 0.18);
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
</style>
