import { proxyToExternalApi } from '@/server/utils/apiProxy'

export default defineEventHandler(async (event) => {
  try {
    // Get the testimonial ID from the URL
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Testimonial ID is required'
      })
    }

    console.log(`🗑️ Deleting testimonial with ID: ${id}`)

    // Use proxy utility to forward request with authentication
    const response = await proxyToExternalApi(event, {
      endpoint: `/testimonials/${id}`,
      method: 'DELETE',
      requireAuth: true // Require authentication for deleting testimonials
    })

    console.log('✅ Testimonial deleted successfully:', response)

    return {
      success: true,
      message: 'Testimonial deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ Error deleting testimonial:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to delete testimonial'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while deleting testimonial'
    })
  }
})
