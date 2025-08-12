export default defineEventHandler(async (event) => {
    try {
      console.log('🗑️ Gallery delete request received');
      
      // Get gallery ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Gallery ID is required'
        });
      }
      
      console.log('📋 Gallery delete data received:', { id });
      
      // Use proxy utility for deleting gallery
      const response = await proxyToExternalApi(event, {
        endpoint: `/about-us/gallery/${id}`,
        method: 'DELETE',
        requireAuth: true
      });
  
      console.log('✅ Gallery deleted successfully, forwarding response');
      
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
