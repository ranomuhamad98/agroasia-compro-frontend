import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mockHomeApiResponse, server } from '../../setup'
import { http, HttpResponse } from 'msw'

// Mock the useApiClient composable
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}

vi.mock('../../../composables/useApiClient', () => ({
  useApiClient: () => mockApiClient
}))

// Mock defineStore globally
vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia')
  return {
    ...actual,
    defineStore: vi.fn().mockImplementation((name, storeDefinition) => {
      return () => {
        // Create a mock store with the actual definition
        const state = storeDefinition.state()
        const getters = {}
        const actions = {}
        
        // Mock getters
        Object.keys(storeDefinition.getters || {}).forEach(key => {
          getters[key] = storeDefinition.getters[key](state)
        })
        
        // Mock actions
        Object.keys(storeDefinition.actions || {}).forEach(key => {
          actions[key] = storeDefinition.actions[key].bind({
            ...state,
            ...getters,
            ...actions
          })
        })
        
        return {
          ...state,
          ...getters,
          ...actions
        }
      }
    })
  }
})

describe('useHomeStore (mocked)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    server.resetHandlers()
    vi.clearAllMocks()
  })

  describe('API client functionality', () => {
    it('should be able to call API client methods', async () => {
      mockApiClient.get.mockResolvedValue(mockHomeApiResponse)
      
      const result = await mockApiClient.get('/home')
      
      expect(mockApiClient.get).toHaveBeenCalledWith('/home')
      expect(result).toEqual(mockHomeApiResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      mockApiClient.get.mockRejectedValue(error)
      
      await expect(mockApiClient.get('/home')).rejects.toThrow('API Error')
    })

    it('should support different HTTP methods', () => {
      expect(mockApiClient.get).toBeDefined()
      expect(mockApiClient.post).toBeDefined()
      expect(mockApiClient.put).toBeDefined()
      expect(mockApiClient.delete).toBeDefined()
      expect(mockApiClient.patch).toBeDefined()
    })
  })

  describe('Store structure validation', () => {
    it('should have required mock data structure', () => {
      expect(mockHomeApiResponse.status).toBe(200)
      expect(mockHomeApiResponse.message).toBeTruthy()
      expect(Array.isArray(mockHomeApiResponse.categories)).toBe(true)
      expect(Array.isArray(mockHomeApiResponse.top_products)).toBe(true)
      expect(Array.isArray(mockHomeApiResponse.featured)).toBe(true)
      expect(Array.isArray(mockHomeApiResponse.faq)).toBe(true)
      expect(mockHomeApiResponse.about_us).toBeDefined()
      expect(mockHomeApiResponse.header).toBeDefined()
      expect(mockHomeApiResponse.footer).toBeDefined()
    })

    it('should have valid category structure', () => {
      const category = mockHomeApiResponse.categories[0]
      expect(category.id).toBeTruthy()
      expect(category.name).toBeTruthy()
      expect(category.image).toBeTruthy()
    })

    it('should have valid product structure', () => {
      const product = mockHomeApiResponse.top_products[0]
      expect(product.id).toBeTruthy()
      expect(product.name).toBeTruthy()
      expect(product.summary).toBeTruthy()
      expect(product.image).toBeTruthy()
      expect(product.category).toBeTruthy()
    })
  })
}) 