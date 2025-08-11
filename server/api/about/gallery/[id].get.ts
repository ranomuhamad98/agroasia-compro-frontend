export default defineEventHandler(async (event) => {
    try {
      console.log('📦 Gallery item fetch request received');
      
      // Get gallery ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Gallery ID is required'
        });
      }
      
      console.log('📋 Gallery item fetch data received:', { id });
      
      // Use proxy utility for fetching gallery item
      const response = await proxyToExternalApi(event, {
        endpoint: `/about-us/gallery/${id}`,
        method: 'GET',
        requireAuth: true
      });
  
      console.log('✅ Gallery item fetched successfully, forwarding response');
      
      return {
        success: true,
        data: response,
        message: 'Gallery item fetched successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Gallery item fetch proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  });
