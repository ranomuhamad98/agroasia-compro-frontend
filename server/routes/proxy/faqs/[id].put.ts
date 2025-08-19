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

    const body = await readBody<FAQPayload>(event)
    
    if (!body.title || !body.content || (!body.position && body.position !== 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: title, content, position'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/faqs/${id}`,
      method: 'PUT',
      body,
      requireAuth: true // Require authentication for updating FAQs
    }) as FAQApiResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to update FAQ'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating FAQ'
    })
  }
})
