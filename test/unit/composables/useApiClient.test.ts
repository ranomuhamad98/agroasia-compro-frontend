import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiClient } from '../../../composables/useApiClient'
import { server } from '../../setup'
import { http, HttpResponse } from 'msw'

// Mock $fetch globally
global.$fetch = vi.fn()

describe('useApiClient', () => {
  beforeEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })

  describe('get method', () => {
    it('should make successful GET request', async () => {
      const mockData = { message: 'success', data: 'test' }
      
      // Mock $fetch to return our mock data
      global.$fetch.mockResolvedValue(mockData)
      
      const apiClient = useApiClient()
      const result = await apiClient.get('/test')
      
      expect(result).toEqual(mockData)
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://agroasiaberdikari.id/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
      )
    })

    it('should handle GET request errors', async () => {
      // Mock $fetch to throw an error
      const error = new Error('API Error')
      error.statusCode = 404
      global.$fetch.mockRejectedValue(error)
      
      const apiClient = useApiClient()
      
      await expect(apiClient.get('/error')).rejects.toThrow()
    })

    it('should retry on server errors', async () => {
      let callCount = 0
      global.$fetch.mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          const error = new Error('Server Error')
          error.statusCode = 500
          throw error
        }
        return Promise.resolve({ message: 'success' })
      })

      const apiClient = useApiClient()
      const result = await apiClient.get('/retry')
      
      expect(result).toEqual({ message: 'success' })
      expect(callCount).toBe(3)
    })

    it('should not retry on client errors (4xx)', async () => {
      let callCount = 0
      global.$fetch.mockImplementation(() => {
        callCount++
        const error = new Error('Bad Request')
        error.statusCode = 400
        throw error
      })

      const apiClient = useApiClient()
      
      await expect(apiClient.get('/client-error')).rejects.toThrow()
      expect(callCount).toBe(1)
    })
  })

  describe('post method', () => {
    it('should make successful POST request with body', async () => {
      const requestBody = { name: 'test', value: 123 }
      const responseData = { id: 1, ...requestBody }
      
      global.$fetch.mockResolvedValue(responseData)
      
      const apiClient = useApiClient()
      const result = await apiClient.post('/create', requestBody)
      
      expect(result).toEqual(responseData)
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://agroasiaberdikari.id/api/create',
        expect.objectContaining({
          method: 'POST',
          body: requestBody,
        })
      )
    })
  })

  describe('configuration options', () => {
    it('should use custom baseURL', async () => {
      const customApiClient = useApiClient({ 
        baseURL: 'https://custom-api.example.com/api' 
      })
      
      global.$fetch.mockResolvedValue({ custom: true })

      const result = await customApiClient.get('/test')
      
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://custom-api.example.com/api/test',
        expect.any(Object)
      )
    })

    it('should use custom retry count', async () => {
      let callCount = 0
      global.$fetch.mockImplementation(() => {
        callCount++
        const error = new Error('Server Error')
        error.statusCode = 500
        throw error
      })

      const customApiClient = useApiClient({ retries: 1 })
      
      await expect(customApiClient.get('/custom-retry')).rejects.toThrow()
      expect(callCount).toBe(2) // Initial + 1 retry
    })
  })
}) 