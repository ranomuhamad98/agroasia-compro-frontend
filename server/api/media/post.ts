export default defineEventHandler(async (event) => {
  try {
    console.log('📁 Media upload proxy request received');
    
    // Read multipart form data
    const formData = await readMultipartFormData(event);
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      });
    }
    
    console.log('📋 Form data fields received:', formData.map(field => ({
      name: field.name,
      filename: field.filename,
      type: field.type,
      size: field.data?.length
    })));
    
    // Find the image file and alt text
    const imageField = formData.find(field => field.name === 'images');
    const altField = formData.find(field => field.name === 'alt');
    
    if (!imageField || !imageField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image file is required'
      });
    }
    
    if (!altField || !altField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Alt text is required'
      });
    }
    
    // Prepare headers for the external API request
    const headers: Record<string, string> = {
      'accept': 'application/json'
    };
    
    // Forward cookies for authentication
    const cookieHeader = getHeader(event, 'cookie');
    if (cookieHeader) {
      headers['cookie'] = cookieHeader;
      console.log('🍪 Forwarding cookies to external API');
    } else {
      console.warn('⚠️ No cookies found for authenticated request');
    }
    
    // Create FormData for the external API request
    const externalFormData = new FormData();
    
    // Add the image file
    const blob = new Blob([imageField.data], { 
      type: imageField.type || 'application/octet-stream' 
    });
    externalFormData.append('images', blob, imageField.filename || 'upload');
    
    // Add the alt text
    const altText = altField.data.toString();
    externalFormData.append('alt', altText);
    
    console.log('📤 Uploading to external API:', {
      filename: imageField.filename,
      type: imageField.type,
      size: imageField.data.length,
      alt: altText
    });
    
    // Make request to external API
    const response = await $fetch('https://agroasiaberdikari.id/api/media', {
      method: 'POST',
      headers,
      body: externalFormData
    });
    
    console.log('✅ Media uploaded successfully, external API response:', response);
    
    return {
      success: true,
      data: response,
      message: 'Media uploaded successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Media upload proxy error:', error);
    
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
    
    // Handle file size or format errors
    if (error.status === 413) {
      throw createError({
        statusCode: 413,
        statusMessage: 'File too large'
      });
    }
    
    // Handle other errors
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Media upload failed'
    });
  }
});
