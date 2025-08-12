export default defineEventHandler(async (event) => {
  try {
    console.log('📂 Category list proxy request received');
    
    // Use proxy utility for getting categories
    const response = await proxyToExternalApi(event, {
      endpoint: '/categories',
      method: 'GET',
      requireAuth: false // Getting categories doesn't require authentication
    });

    console.log('✅ Categories retrieved successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Categories retrieved successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Category retrieval proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
