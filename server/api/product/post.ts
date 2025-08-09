export default defineEventHandler(async (event) => {
  try {
    console.log('📦 Product creation request received');

    const body = await readBody(event);

    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No request body received'
      });
    }

    // Basic validations aligned with external API contract (step 1: details only)
    const requiredFields = ['name', 'summary', 'description', 'category_id'];
    const missing = requiredFields.filter((k) => !body[k]);
    if (missing.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Normalize optional fields
    const payload = {
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
    } as Record<string, any>;

    console.log('📤 Forwarding product payload to external API:', {
      ...payload,
      description: payload.description ? `${String(payload.description).slice(0, 60)}...` : '',
    });

    // Prepare headers for proxy including cookies
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
    const response = await $fetch('https://agroasiaberdikari.id/api/products', {
      method: 'POST',
      headers,
      body: payload,
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          setHeader(event, 'set-cookie', setCookieHeaders);
        }
      }
    });

    console.log('✅ Product created successfully');

    return {
      success: true,
      data: response,
      message: 'Product created successfully'
    };
  } catch (error: any) {
    console.error('❌ Product creation error:', error);

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
      throw createError({ statusCode: 409, statusMessage: 'Product conflict' });
    }

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Product creation failed'
    });
  }
});


