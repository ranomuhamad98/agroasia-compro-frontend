import type { MilestonePayload } from '~/types/milestone-api-type';

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
      const requiredFields = ['title', 'sub_title', 'content', 'media_link', 'tahun', 'position', 'status'];
      const missing = requiredFields.filter((k) => body[k] === undefined || body[k] === null);
      if (missing.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required fields: ${missing.join(', ')}`
        });
      }

      // Type validation
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title must be a non-empty string'
        });
      }

      if (typeof body.sub_title !== 'string' || body.sub_title.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Sub title must be a non-empty string'
        });
      }

      if (typeof body.content !== 'string' || body.content.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Content must be a non-empty string'
        });
      }

      if (typeof body.media_link !== 'string' || body.media_link.trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Media link must be a non-empty string'
        });
      }

      if (typeof body.tahun !== 'number' || body.tahun < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Tahun must be a non-negative number'
        });
      }

      if (typeof body.position !== 'number' || body.position < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Position must be a non-negative number'
        });
      }

      if (typeof body.status !== 'boolean') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Status must be a boolean value'
        });
      }
  
      // Create properly typed payload
      const payload: MilestonePayload = {
        title: body.title.trim(),
        sub_title: body.sub_title.trim(),
        content: body.content.trim(),
        media_link: body.media_link.trim(),
        tahun: body.tahun,
        position: body.position,
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
        endpoint: '/milestones',
        method: 'POST',
        body: payload,
        requireAuth: true,
      });
  
      return response;
    } catch (error: any) {
      console.error('❌ Milestone creation error:', error);
  
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
        throw createError({ statusCode: 409, statusMessage: 'Milestone conflict' });
      }
  
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.message || 'Milestone creation failed',
        data: error.data
      });
    }
  });
  
  
  