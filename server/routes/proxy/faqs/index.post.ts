import type { FAQApiResponse, FAQPayload } from '@/types/faq-api-type'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<FAQApiResponse> => {
  try {
    // Get the request body
    const body = await readBody<FAQPayload>(event)
    
    // Validate required fields
    if (!body.title || !body.content || !body.position) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: title, content, position'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: '/faqs',
      method: 'POST',
      body,
      requireAuth: true // Require authentication for creating FAQs
    }) as FAQApiResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to create FAQ'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while creating FAQ'
    })
  }
})
