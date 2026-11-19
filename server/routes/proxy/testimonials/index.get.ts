import type { TestimonialListResponse } from '@/types/testimonial-api-type'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<TestimonialListResponse> => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const { active_only } = query

    console.log('📋 Fetching testimonials with query params:', query)

    // Build the endpoint with query parameters
    let endpoint = '/testimonials'
    
    // Add active_only parameter if provided
    if (active_only !== undefined) {
      const params = new URLSearchParams()
      params.append('active_only', String(active_only))
      endpoint += `?${params.toString()}`
    }

    console.log('🌐 Making request to endpoint:', endpoint)

    // Use proxy utility to forward request
    const response = await proxyToExternalApi(event, {
      endpoint,
      method: 'GET',
      requireAuth: true,
    })

    console.log('✅ Testimonials fetched successfully:', response)

    return response as TestimonialListResponse
  } catch (error: any) {
    console.error('❌ Error fetching testimonials:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to fetch testimonials'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching testimonials'
    })
  }
})
