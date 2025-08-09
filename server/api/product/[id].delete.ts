export default defineEventHandler(async (event) => {
  try {
    console.log('🗑️ Product delete request received');

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
    } else {
      console.warn('⚠️ No cookies found for authenticated request');
    }

    const response = await $fetch(`https://agroasiaberdikari.id/api/products/${id}`, {
      method: 'DELETE',
      headers,
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          setHeader(event, 'set-cookie', setCookieHeaders);
        }
      }
    });

    console.log('✅ Product deleted successfully');

    return {
      success: true,
      data: response,
      message: 'Product deleted successfully'
    };
  } catch (error: any) {
    console.error('❌ Product delete error:', error);

    if (error.status === 401) {
      throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
    }

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Product delete failed'
    });
  }
});


