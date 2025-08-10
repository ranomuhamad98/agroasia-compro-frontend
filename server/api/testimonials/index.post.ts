import type { CreateTestimonialRequest, CreateTestimonialResponse } from '@/types/testimonial-api-type'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<CreateTestimonialResponse> => {
  try {
    // Get the request body
    const body = await readBody<CreateTestimonialRequest>(event)
    
    // Validate required fields
    if (!body.pic || !body.name || !body.profession || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: pic, name, profession, message'
      })
    }

    // Validate status field
    if (typeof body.status !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status field must be a boolean value'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: '/testimonials',
      method: 'POST',
      body,
      requireAuth: true // Require authentication for creating testimonials
    }) as CreateTestimonialResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to create testimonial'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while creating testimonial'
    })
  }
})
