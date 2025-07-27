import { describe, it, expect } from 'vitest'
import { mockHomeApiResponse } from '../setup'

describe('Basic Testing Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toBe('hello')
    expect(true).toBeTruthy()
  })

  it('should have access to mock data', () => {
    expect(mockHomeApiResponse).toBeDefined()
    expect(mockHomeApiResponse.status).toBe(200)
    expect(mockHomeApiResponse.message).toBe("Data retrieved successfully")
  })

  it('should validate mock data structure', () => {
    expect(Array.isArray(mockHomeApiResponse.categories)).toBe(true)
    expect(Array.isArray(mockHomeApiResponse.top_products)).toBe(true)
    expect(Array.isArray(mockHomeApiResponse.featured)).toBe(true)
    expect(Array.isArray(mockHomeApiResponse.faq)).toBe(true)
    expect(mockHomeApiResponse.about_us).toBeTypeOf('object')
    expect(mockHomeApiResponse.header).toBeTypeOf('object')
    expect(mockHomeApiResponse.footer).toBeTypeOf('object')
  })

  it('should handle promises', async () => {
    const promise = Promise.resolve('test')
    const result = await promise
    expect(result).toBe('test')
  })

  it('should handle errors', () => {
    expect(() => {
      throw new Error('Test error')
    }).toThrow('Test error')
  })
}) 