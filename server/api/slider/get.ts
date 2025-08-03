export default defineEventHandler(async (event) => {
  try {
    console.log('🎨 Slider list proxy request received');
    
    // Use proxy utility for getting sliders
    const response = await proxyToExternalApi(event, {
      endpoint: '/sliders',
      method: 'GET',
      requireAuth: false // Getting sliders doesn't require authentication
    });

    console.log('✅ Sliders retrieved successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Sliders retrieved successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Slider retrieval proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
