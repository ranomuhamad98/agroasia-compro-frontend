export default defineEventHandler(async (event) => {
    try {
      console.log('🗑️ Our People deletion request received');
      
      // Get our people ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Our People ID is required'
        });
      }
      
      console.log('📋 Our People deletion request for ID:', id);
      
      // Use proxy utility for deleting our people
      const response = await proxyToExternalApi(event, {
        endpoint: `/about-us/our-people/${id}`,
        method: 'DELETE',
        requireAuth: true
      });
  
      console.log('✅ Our People deleted successfully, forwarding response');
      
      return {
        success: true,
        data: response,
        message: 'Our People deleted successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Our People deletion proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  }); 