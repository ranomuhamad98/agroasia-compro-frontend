import type { FAQApiResponse, FAQPayload } from '@/types/faq-api-type'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<FAQApiResponse> => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'FAQ ID is required'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/faqs/${id}`,
      method: 'DELETE',
      requireAuth: true // Require authentication for deleting FAQs
    }) as FAQApiResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to delete FAQ'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while deleting FAQ'
    })
  }
})
