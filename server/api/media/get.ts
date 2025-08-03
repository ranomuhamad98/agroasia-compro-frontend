export default defineEventHandler(async (event) => {
  try {
    console.log('📁 Media list proxy request received');
    
    // Get query parameters for pagination, filtering, etc.
    const query = getQuery(event);
    console.log('🔍 Query parameters:', query);
    
    // Use proxy utility for getting media
    const response = await proxyToExternalApi(event, {
      endpoint: `/media${query ? '?' + new URLSearchParams(query as Record<string, string>).toString() : ''}`,
      method: 'GET',
      requireAuth: false // Getting media might not require authentication
    });

    console.log('✅ Media retrieved successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Media retrieved successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Media retrieval proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});