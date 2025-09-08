export default defineEventHandler(async (event) => {
    try {
      // Get gallery ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Gallery ID is required'
        });
      }
      
      // Use proxy utility for deleting gallery
      const response = await proxyToExternalApi(event, {
        endpoint: `/about-us/gallery/${id}`,
        method: 'DELETE',
        requireAuth: true
      });
  
      return {
        success: true,
        data: response,
        message: 'Gallery deleted successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Gallery delete proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  });
