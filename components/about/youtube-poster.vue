<template>
    <div class="yt-poster">
        <div ref="mount" class="yt-poster__player"></div>
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
    target.seekTo(props.second, true)
    target.pauseVideo()
    target.unMute?.()
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
                if (started.value || posterReady || event.data !== win.YT.PlayerState.PLAYING) return
                posterReady = true
                holdFrame(event.target)
            },
        },
    })
}

function startPlayback() {
    started.value = true
    createPlayer({
        videoId: props.videoId,
        playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
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

.yt-poster__play {
    position: absolute;
    inset: 0;
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
