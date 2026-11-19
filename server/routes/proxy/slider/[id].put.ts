export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, 'id');
    
    console.log('🎨 Slider update proxy request received:', {
      id,
      title: body.title,
      position: body.position
    });
    
    // Validate required fields
    if (!body.title || !body.sub_title || !body.image_link) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: title, sub_title, and image_link are required'
      });
    }
    
    // Validate ID parameter
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slider ID is required'
      });
    }
    
    // Use proxy utility for slider update
    const response = await proxyToExternalApi(event, {
      endpoint: `/sliders/${id}`,
      method: 'PUT',
      body: {
        image_link: body.image_link,
        sub_title: body.sub_title,
        title: body.title,
        button_title: body.button_title || '',
        button_link: body.button_link || '',
        position: body.position || 0
      },
      requireAuth: true // Slider update requires authentication
    });

    console.log('✅ Slider updated successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Slider updated successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Slider update proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
}); 