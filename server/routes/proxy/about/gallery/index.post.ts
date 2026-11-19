import type { CreateOurPeopleReturn, GalleryPayload, OurPeoplePayload } from '~/types/about-api-type';

export default defineEventHandler(async (event) => {
    try {
      console.log('📦 Gallery creation request received');
  
      const body = await readBody(event);
  
      if (!body) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No request body received'
        });
      }
  
      // Validate required fields according to API specification
      const requiredFields = ['image_link', 'alt'];
      const missing = requiredFields.filter((k) => body[k] === undefined || body[k] === null);
      if (missing.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required fields: ${missing.join(', ')}`
        });
      }

      // Type validation
      if (typeof body.alt !== 'string' || body.alt.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Alt must be a non-empty string'
        });
      }

      if (typeof body.image_link !== 'string' || body.image_link.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Image link must be a non-empty string'
        });
      }

      // Create properly typed payload
      const payload: GalleryPayload = {
        image_link: body.image_link.trim(),
        alt: body.alt.trim(),
      };
  
      // Prepare headers for proxy including cookies
      const headers: Record<string, string> = {
        accept: '*/*',
        'Content-Type': 'application/json'
      };
  
      const cookieHeader = getHeader(event, 'cookie');
      if (cookieHeader) {
        headers.cookie = cookieHeader as string;
      }
  
      // Make request to external API
      const response = await proxyToExternalApi(event, {
        endpoint: '/about-us/gallery',
        method: 'POST',
        body: payload,
        requireAuth: true,
      });
  
      return response
    } catch (error: any) {
      console.error('❌ Gallery creation error:', error);
  
      if (error.status === 401) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
      }
      if (error.status === 422) {
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation error',
          data: error.data
        });
      }
      if (error.status === 409) {
        throw createError({ statusCode: 409, statusMessage: 'Gallery conflict' });
      }
  
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.message || 'Gallery creation failed',
        data: error.data
      });
    }
  });
  
  
  