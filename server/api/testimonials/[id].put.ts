import type { CreateTestimonialRequest, CreateTestimonialResponse } from '@/types/testimonial-api-type'
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

    // Get the request body
    const body = await readBody<Partial<CreateTestimonialRequest>>(event)
    
    console.log(`📝 Updating testimonial with ID: ${id}`, body)

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/testimonials/${id}`,
      method: 'PUT',
      body,
      requireAuth: true // Require authentication for updating testimonials
    })

    console.log('✅ Testimonial updated successfully:', response)

    return response
  } catch (error: any) {
    console.error('❌ Error updating testimonial:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to update testimonial'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating testimonial'
    })
  }
})
