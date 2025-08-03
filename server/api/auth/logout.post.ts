export default defineEventHandler(async (event) => {
  try {
    console.log('🚪 Logout proxy request received');
    
    // Proxy request to external API
    const response = await proxyToExternalApi(event, {
      endpoint: '/auth/logout',
      method: 'POST',
      requireAuth: true
    });
    
    console.log('✅ Logout successful, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Logout successful'
    };
    
  } catch (error: any) {
    console.error('❌ Logout proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});