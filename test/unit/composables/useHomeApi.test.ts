import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent } from 'vue'
import { useHomeApi } from '../../../composables/useHomeApi'
import { mockHomeApiResponse, server } from '../../setup'
import { http, HttpResponse } from 'msw'

// Test component wrapper
const TestComponent = defineComponent({
  setup() {
    const homeApi = useHomeApi()
    return homeApi
  },
  template: '<div></div>'
})

describe('useHomeApi', () => {
  let wrapper: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    server.resetHandlers()
  })

  it('should fetch home data successfully', async () => {
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        return HttpResponse.json(mockHomeApiResponse)
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async data

    expect(wrapper.vm.hasData).toBe(true)
    expect(wrapper.vm.error).toBe(null)
    expect(wrapper.vm.homeData).toEqual(mockHomeApiResponse)
  })

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        return HttpResponse.json(
          { status: 500, message: 'Server Error' },
          { status: 500 }
        )
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.hasData).toBe(false)
    expect(wrapper.vm.error).toBeTruthy()
  })

  it('should provide computed properties for data access', async () => {
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        return HttpResponse.json(mockHomeApiResponse)
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.aboutUs).toEqual(mockHomeApiResponse.about_us)
    expect(wrapper.vm.categories).toEqual(mockHomeApiResponse.categories)
    expect(wrapper.vm.topProducts).toEqual(mockHomeApiResponse.top_products)
    expect(wrapper.vm.featured).toEqual(mockHomeApiResponse.featured)
    expect(wrapper.vm.faq).toEqual(mockHomeApiResponse.faq)
  })

  it('should handle refresh functionality', async () => {
    let callCount = 0
    
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        callCount++
        return HttpResponse.json({
          ...mockHomeApiResponse,
          message: `Call ${callCount}`
        })
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(callCount).toBe(1)

    await wrapper.vm.refresh()
    expect(callCount).toBe(2)
  })

  it('should handle loading states', async () => {
    let resolveRequest: (value: any) => void
    const requestPromise = new Promise(resolve => {
      resolveRequest = resolve
    })

    server.use(
      http.get('https://agroasiaberdikari.id/api/home', async () => {
        await requestPromise
        return HttpResponse.json(mockHomeApiResponse)
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.vm.isPending).toBe(true)

    resolveRequest!(null)
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.isPending).toBe(false)
  })

  it('should validate response structure', async () => {
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        return HttpResponse.json({ invalid: 'response' })
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.hasData).toBe(false)
    expect(wrapper.vm.error).toBeTruthy()
  })

  it('should validate response status', async () => {
    server.use(
      http.get('https://agroasiaberdikari.id/api/home', () => {
        return HttpResponse.json({
          status: 400,
          message: 'Bad Request',
          // ... rest of structure
        })
      })
    )

    wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.hasData).toBe(false)
    expect(wrapper.vm.error).toBeTruthy()
  })
}) 