export default defineEventHandler(async (event) => {
  try {
    console.log('👤 Checking user authentication status');
    
    // Check if user has cookies (basic auth check)
    if (!isAuthenticated(event)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      });
    }
    
    // Proxy request to external API to get user info
    const response = await proxyToExternalApi(event, {
      endpoint: '/auth/me',
      method: 'GET',
      requireAuth: true
    });
    
    console.log('✅ User authentication check successful');
    
    return {
      success: true,
      data: response,
      message: 'User authenticated'
    };
    
  } catch (error: any) {
    console.error('❌ Authentication check failed:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});