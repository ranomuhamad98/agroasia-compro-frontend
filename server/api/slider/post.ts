export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    console.log('🎨 Slider creation proxy request received:', {
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
    
    // Use proxy utility for slider creation
    const response = await proxyToExternalApi(event, {
      endpoint: '/sliders',
      method: 'POST',
      body: {
        image_link: body.image_link,
        sub_title: body.sub_title,
        title: body.title,
        button_title: body.button_title || '',
        button_link: body.button_link || '',
        position: body.position || 0
      },
      requireAuth: true // Slider creation requires authentication
    });

    console.log('✅ Slider created successfully, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Slider created successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Slider creation proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
