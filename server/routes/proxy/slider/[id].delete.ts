export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    console.log('🗑️ Slider delete proxy request received:', {
      id
    });
    
    // Validate ID parameter
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slider ID is required'
      });
    }
    
    // Use proxy utility for slider deletion
    const response = await proxyToExternalApi(event, {
      endpoint: `/sliders/${id}`,
      method: 'DELETE',
      requireAuth: true // Slider deletion requires authentication
    });

    console.log('✅ Slider deleted successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Slider deleted successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Slider delete proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
}); 