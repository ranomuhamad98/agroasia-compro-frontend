export default defineEventHandler(async (event) => {
    try {
      console.log('📂 Milestone list proxy request received');
      
      // Use proxy utility for getting categories
      const response = await proxyToExternalApi(event, {
        endpoint: '/milestones',
        method: 'GET',
        requireAuth: false // Getting categories doesn't require authentication
      });
  
      console.log('✅ Milestone retrieved successfully, forwarding response');
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Milestone retrieval proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  });
  