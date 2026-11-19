export default defineEventHandler(async (event) => {
  try {
    // Proxy request to external API
    const response = await proxyToExternalApi(event, {
      endpoint: '/auth/logout',
      method: 'POST',
      requireAuth: true
    });
    
    return {
      success: true,
      data: response,
      message: 'Logout successful'
    };
    
  } catch (error: any) {
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});