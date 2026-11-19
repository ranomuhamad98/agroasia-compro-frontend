import type { CreateOurPeopleReturn, OurPeoplePayload } from '~/types/about-api-type';

export default defineEventHandler(async (event) => {
    try {
      console.log('📦 Our People creation request received');
  
      const body = await readBody(event);
  
      if (!body) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No request body received'
        });
      }
  
      // Validate required fields according to API specification
      const requiredFields = ['image_link', 'name', 'title', 'lokasi', 'bertani_sejak', 'bermitra_sejak', 'keterangan', 'status'];
      const missing = requiredFields.filter((k) => body[k] === undefined || body[k] === null);
      if (missing.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required fields: ${missing.join(', ')}`
        });
      }

      // Type validation
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name must be a non-empty string'
        });
      }

      if (typeof body.title !== 'string' || body.title.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title must be a non-empty string'
        });
      }

      if (typeof body.lokasi !== 'string' || body.lokasi.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Lokasi must be a non-empty string'
        });
      }

      if (typeof body.keterangan !== 'string' || body.keterangan.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Keterangan must be a non-empty string'
        });
      }

      if (typeof body.image_link !== 'string' || body.image_link.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Image link must be a non-empty string'
        });
      }

      if (typeof body.bertani_sejak !== 'number' || body.bertani_sejak < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bertani sejak must be a non-negative number'
        });
      }

      if (typeof body.bermitra_sejak !== 'number' || body.bermitra_sejak < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bermitra sejak must be a non-negative number'
        });
      }

      if (typeof body.status !== 'boolean') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Status must be a boolean value'
        });
      }
  
      // Create properly typed payload
      const payload: OurPeoplePayload = {
        image_link: body.image_link.trim(),
        name: body.name.trim(),
        title: body.title.trim(),
        lokasi: body.lokasi.trim(),
        bertani_sejak: body.bertani_sejak,
        bermitra_sejak: body.bermitra_sejak,
        keterangan: body.keterangan.trim(),
        status: body.status,
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
        endpoint: '/about-us/our-people',
        method: 'POST',
        body: payload,
        requireAuth: true,
      });
  
      return response as CreateOurPeopleReturn;
    } catch (error: any) {
      console.error('❌ Our People creation error:', error);
  
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
        throw createError({ statusCode: 409, statusMessage: 'Our People conflict' });
      }
  
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.message || 'Our People creation failed',
        data: error.data
      });
    }
  });
  
  
  