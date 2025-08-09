export default defineEventHandler(async (event) => {
  try {
    console.log('🔎 Product detail request received');

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Product ID is required' });
    }

    const headers: Record<string, string> = {
      accept: 'application/json'
    };

    const cookieHeader = getHeader(event, 'cookie');
    if (cookieHeader) {
      headers.cookie = cookieHeader as string;
      console.log('🍪 Forwarding cookies to external API');
    }

    const response = await $fetch(`https://agroasiaberdikari.id/api/products/${id}`, {
      method: 'GET',
      headers,
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          setHeader(event, 'set-cookie', setCookieHeaders);
        }
      }
    });

    console.log('✅ Product detail fetched successfully');

    return {
      success: true,
      data: response,
      message: 'Product detail fetched successfully'
    };
  } catch (error: any) {
    console.error('❌ Product detail error:', error);

    if (error.status === 401) {
      throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
    }

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Product detail failed'
    });
  }
});

 