export function isReadyThumbnailTime(value: string) {
  return /^(\d+:[0-5]\d|\d{2,})$/.test(value.trim())
}

export function parseThumbnailTime(value: string): number | null {
  const text = value.trim()
  if (!text) return null
  const clock = text.match(/^(\d+):([0-5]\d)$/)
  if (clock) return Number(clock[1]) * 60 + Number(clock[2])
  if (/^\d+$/.test(text)) return Number(text)
  return null
}

export function formatThumbnailTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function youtubeVideoId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] || ''
}
