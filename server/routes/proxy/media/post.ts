export default defineEventHandler(async (event) => {
  try {
    // Read multipart form data
    const formData = await readMultipartFormData(event);

    console.log('formData', formData);
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      });
    }
    
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
    
    // Make request to external API
    const response = await $fetch('https://agroasiaberdikari.id/api/media', {
      method: 'POST',
      headers,
      body: externalFormData
    });
    
    return {
      success: true,
      data: response,
      message: 'Media uploaded successfully'
    };
    
  } catch (error: any) {
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
