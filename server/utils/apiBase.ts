export function getApiBase() {
  return (process.env.API_UPSTREAM || process.env.NUXT_PUBLIC_API_BASE || process.env.VITE_API_URL || 'http://157.10.160.154:3300/api').replace(/\/$/, '')
}
