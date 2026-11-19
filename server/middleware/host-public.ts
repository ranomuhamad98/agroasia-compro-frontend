import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, resolve, sep } from 'node:path'
import { getRequestURL, sendStream, setHeader } from 'h3'

const root = resolve(process.env.HOST_PUBLIC_DIR || '/srv/public')

const types: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
}

export default defineEventHandler((event) => {
  const pathname = decodeURIComponent(getRequestURL(event).pathname)
  if (pathname === '/' || pathname.startsWith('/_nuxt/') || pathname.startsWith('/api/')) {
    return
  }

  const filePath = resolve(root, `.${pathname}`)
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    return
  }
  if (!existsSync(filePath)) {
    return
  }

  const stat = statSync(filePath)
  if (!stat.isFile()) {
    return
  }

  setHeader(event, 'content-type', types[extname(filePath).toLowerCase()] || 'application/octet-stream')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return sendStream(event, createReadStream(filePath))
})
