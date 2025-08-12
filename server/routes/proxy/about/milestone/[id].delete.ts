export default defineEventHandler(async (event) => {
    try {
      console.log('🗑️ Milestone deletion request received');
      
      // Get our people ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Milestone ID is required'
        });
      }
      
      console.log('📋 Milestone deletion request for ID:', id);
      
      // Use proxy utility for deleting our people
      const response = await proxyToExternalApi(event, {
        endpoint: `/milestones/${id}`,
        method: 'DELETE',
        requireAuth: true
      });
  
      console.log('✅ Milestone deleted successfully, forwarding response');
      
      return {
        success: true,
        data: response,
        message: 'Milestone deleted successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Milestone deletion proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  }); 