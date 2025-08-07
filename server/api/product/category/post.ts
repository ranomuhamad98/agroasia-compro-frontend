export default defineEventHandler(async (event) => {
  try {
    console.log('📁 Category creation request received');
    
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
    
    console.log('📋 Category data received:', {
      name: body.name,
      image_link: body.image_link
    });
    
    // Prepare headers for the external API request
    const headers: Record<string, string> = {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    // Forward cookies for authentication
    const cookieHeader = getHeader(event, 'cookie');
    if (cookieHeader) {
      headers['cookie'] = cookieHeader;
      console.log('🍪 Forwarding cookies to external API');
    } else {
      console.warn('⚠️ No cookies found for authenticated request');
    }
    
    // Prepare request payload
    const payload = {
      name: body.name,
      image_link: body.image_link
    };
    
    console.log('📤 Creating category on external API:', payload);
    
    // Make request to external API
    const response = await $fetch('https://agroasiaberdikari.id/api/categories', {
      method: 'POST',
      headers,
      body: payload
    });
    
    console.log('✅ Category created successfully, external API response:', response);
    
    return {
      success: true,
      data: response,
      message: 'Category created successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Category creation error:', error);
    
    // Handle authentication errors
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }
    
    // Handle validation errors
    if (error.status === 422) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation error',
        data: error.data
      });
    }
    
    // Handle conflict errors (e.g., category name already exists)
    if (error.status === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category already exists'
      });
    }
    
    // Handle other errors
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Category creation failed'
    });
  }
});
  