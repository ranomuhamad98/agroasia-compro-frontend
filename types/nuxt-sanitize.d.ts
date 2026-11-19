import type { NuxtApp } from '#app'

declare module '#app' {
  interface NuxtApp {
    $sanitize: (input?: string) => string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $sanitize: (input?: string) => string
  }
}

export { }


