export default defineEventHandler(async (event) => {
  try {
    console.log('📝 Category update request received');
    
    // Get category ID from URL params
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      });
    }
    
    // Read JSON body data
    const body = await readBody(event);
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No request body received'
      });
    }
    
    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category name is required'
      });
    }
    
    if (!body.image_link) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image link is required'
      });
    }
    
    console.log('📋 Category update data received:', {
      id,
      name: body.name,
      image_link: body.image_link
    });
    
    // Use proxy utility for updating category
    const response = await proxyToExternalApi(event, {
      endpoint: `/categories/${id}`,
      method: 'PUT',
      body: {
        name: body.name,
        image_link: body.image_link
      },
      requireAuth: true
    });

    console.log('✅ Category updated successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Category updated successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Category update proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
}); 