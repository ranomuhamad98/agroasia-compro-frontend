import type { SectionApiResponse, SectionPayload } from '@/types/sections-api-types'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<SectionApiResponse> => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'FAQ ID is required'
      })
    }

    const body = await readBody<SectionPayload>(event)
    
    if (!body.value || (!body.position && body.position !== 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: value, position'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/settings/${id}`,
      method: 'PUT',
      body,
      requireAuth: true // Require authentication for updating sections
    }) as SectionApiResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to update section'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating section'
    })
  }
})
