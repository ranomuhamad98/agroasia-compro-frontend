import type { SectionApiResponse } from '@/types/sections-api-types'
import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event): Promise<SectionApiResponse> => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id'
      })
    }

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/settings/by-section/${id}`,
      method: 'GET',
      requireAuth: true
    }) as SectionApiResponse

    return response
  } catch (error: any) {
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to fetch section settings'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching section settings'
    })
  }
})
