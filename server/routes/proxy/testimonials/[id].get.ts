import type { CreateTestimonialResponse } from '@/types/testimonial-api-type'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<CreateTestimonialResponse> => {
  try {
    // Get the testimonial ID from the URL
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Testimonial ID is required'
      })
    }

    console.log(`📋 Fetching testimonial with ID: ${id}`)

    // Use proxy utility to forward request
    const response = await proxyToExternalApi(event, {
      endpoint: `/testimonials/${id}`,
      method: 'GET',
      requireAuth: false // Public endpoint, no auth required
    })

    console.log('✅ Testimonial fetched successfully:', response)

    return response
  } catch (error: any) {
    console.error('❌ Error fetching testimonial:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to fetch testimonial'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching testimonial'
    })
  }
})
