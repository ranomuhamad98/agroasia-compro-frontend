import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent } from 'vue'
import { vi, beforeEach, afterEach } from 'vitest'

/**
 * Creates a test wrapper for composables
 */
export function createComposableWrapper<T>(composable: () => T): {
  wrapper: VueWrapper<any>;
  result: T;
} {
  let result: T

  const TestComponent = defineComponent({
    setup() {
      result = composable()
      return result
    },
    template: '<div></div>'
  })

  const wrapper = mount(TestComponent, {
    global: {
      plugins: [createPinia()]
    }
  })

  return { wrapper, result: result! }
}

/**
 * Waits for a condition to be true
 */
export function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    
    const check = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for condition after ${timeout}ms`))
      } else {
        setTimeout(check, interval)
      }
    }
    
    check()
  })
}

/**
 * Creates a promise that resolves after a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock console methods for testing
 */
export function mockConsole() {
  const originalConsole = { ...console }
  const consoleMocks = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }

  beforeEach(() => {
    Object.assign(console, consoleMocks)
  })

  afterEach(() => {
    Object.assign(console, originalConsole)
  })

  return consoleMocks
}

/**
 * Creates a mock API response
 */
export function createMockResponse<T>(data: T, status = 200, delay = 0) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (status >= 200 && status < 300) {
        resolve(data)
      } else {
        reject(new Error(`HTTP ${status}`))
      }
    }, delay)
  })
}

/**
 * Flushes all pending promises
 */
export function flushPromises(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
} 