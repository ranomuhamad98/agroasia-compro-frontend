export default defineEventHandler(async (event) => {
  try {
    console.log('🗑️ Category deletion request received');
    
    // Get category ID from URL params
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      });
    }
    
    console.log('📋 Category deletion request for ID:', id);
    
    // Use proxy utility for deleting category
    const response = await proxyToExternalApi(event, {
      endpoint: `/categories/${id}`,
      method: 'DELETE',
      requireAuth: true
    });

    console.log('✅ Category deleted successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Category deleted successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Category deletion proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
}); 