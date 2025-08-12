export default defineEventHandler(async (event) => {
    try {
      console.log('📦 Gallery fetch request received');
  
      // Use proxy utility for fetching gallery
      const response = await proxyToExternalApi(event, {
        endpoint: '/about-us/gallery',
        method: 'GET',
        requireAuth: true,
      });
  
      console.log('✅ Gallery fetched successfully, forwarding response');
      
      return {
        success: true,
        data: response,
        message: 'Gallery fetched successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Gallery fetch proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  });
