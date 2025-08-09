export default defineEventHandler(async (event) => {
  try {
    console.log('📝 Product update request received');

    // Get product ID from URL params
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
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

    // Basic validations aligned with the external API update contract
    const requiredFields = ['name', 'summary', 'description', 'category_id'];
    const missing = requiredFields.filter((k) => !body[k]);
    if (missing.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Normalize optional fields and forward only known keys
    const payload: Record<string, any> = {
      name: body.name,
      summary: body.summary,
      description: body.description,
      additional_information: body.additional_information ?? {
        content_1: '',
        content_2: { headers: [], rows: [] },
        content_3: ''
      },
      category_id: body.category_id,
      tags: Array.isArray(body.tags) ? body.tags : [],
      text_wa: body.text_wa ?? '',
      is_top_product: !!body.is_top_product
      // Note: image is optional for update; include only if provided
    };
    if (body.image) {
      payload.image = body.image;
    }

    console.log('📤 Forwarding product update payload to external API:', {
      id,
      ...payload,
      description: payload.description ? `${String(payload.description).slice(0, 60)}...` : ''
    });

    // Prepare headers and forward cookies
    const headers: Record<string, string> = {
      accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const cookieHeader = getHeader(event, 'cookie');
    if (cookieHeader) {
      headers.cookie = cookieHeader as string;
      console.log('🍪 Forwarding cookies to external API');
    } else {
      console.warn('⚠️ No cookies found for authenticated request');
    }

    // Make request to external API
    const response = await $fetch(`https://agroasiaberdikari.id/api/products/${id}`, {
      method: 'PUT',
      headers,
      body: payload,
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          setHeader(event, 'set-cookie', setCookieHeaders);
        }
      }
    });

    console.log('✅ Product updated successfully');

    return {
      success: true,
      data: response,
      message: 'Product updated successfully'
    };
  } catch (error: any) {
    console.error('❌ Product update error:', error);

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

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Product update failed'
    });
  }
});


