import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)

    console.log('📋 Fetching contact with query params:', query)

    // Build the endpoint with query parameters
    let endpoint = '/contact-us'
    
    console.log('🌐 Making request to endpoint:', endpoint)

    // Use proxy utility to forward request
    const response = await proxyToExternalApi(event, {
      endpoint,
      method: 'GET',
      requireAuth: true,
    })

    console.log('✅ Contact fetched successfully:', response)

    return response
  } catch (error: any) {
    console.error('❌ Error fetching contact:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to fetch contact'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching contact'
    })
  }
})
