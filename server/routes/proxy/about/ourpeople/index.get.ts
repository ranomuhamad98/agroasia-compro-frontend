export default defineEventHandler(async (event) => {
    try {
      console.log('📂 Our People list proxy request received');
      
      // Use proxy utility for getting categories
      const response = await proxyToExternalApi(event, {
        endpoint: '/about-us/our-people',
        method: 'GET',
        requireAuth: false // Getting categories doesn't require authentication
      });
  
      console.log('✅ Our People retrieved successfully, forwarding response');
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Our People retrieval proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  });
  