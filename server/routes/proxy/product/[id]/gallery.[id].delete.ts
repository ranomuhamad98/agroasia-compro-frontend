export default defineEventHandler(async (event) => {
  try {
    const productId = getRouterParam(event, 'id')
    const galleryId = getRouterParam(event, 'id_1') || getRouterParam(event, 'galleryId')

    if (!productId) {
      throw createError({ statusCode: 400, statusMessage: 'Product ID is required' })
    }
    if (!galleryId) {
      throw createError({ statusCode: 400, statusMessage: 'Gallery ID is required' })
    }

    const headers: Record<string, string> = {
      accept: '*/*'
    }
    const cookieHeader = getHeader(event, 'cookie')
    if (cookieHeader) headers.cookie = cookieHeader as string

    const response = await $fetch(`https://agroasiaberdikari.id/api/products/${productId}/gallery/${galleryId}`, {
      method: 'DELETE',
      headers,
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie')
        if (setCookieHeaders) setHeader(event, 'set-cookie', setCookieHeaders)
      }
    })

    return {
      success: true,
      data: response,
      message: 'Product gallery image deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ Delete product gallery error:', error)
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to delete product gallery image'
    })
  }
})


