export default defineEventHandler(async (event) => {
  try {
    // Use proxy utility for getting sliders
    const response = await proxyToExternalApi(event, {
      endpoint: '/sliders',
      method: 'GET',
      requireAuth: false // Getting sliders doesn't require authentication
    });
    
    return {
      success: true,
      data: response,
      message: 'Sliders retrieved successfully'
    };
    
  } catch (error: any) {
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
