export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Product ID is required' });
    }

    const body = await readBody<{ image_gallery_id?: string; status?: 'main' | 'gallery' }>(event);
    if (!body || !body.image_gallery_id || !body.status) {
      throw createError({ statusCode: 400, statusMessage: 'image_gallery_id and status are required' });
    }

    const headers: Record<string, string> = {
      accept: '*/*',
      'Content-Type': 'application/json'
    };

    const cookieHeader = getHeader(event, 'cookie');
    if (cookieHeader) {
      headers.cookie = cookieHeader as string;
    }

    const response = await $fetch(`https://agroasiaberdikari.id/api/products/${id}/gallery`, {
      method: 'POST',
      headers,
      body: {
        image_gallery_id: body.image_gallery_id,
        status: body.status
      },
      onResponse({ response }) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          setHeader(event, 'set-cookie', setCookieHeaders);
        }
      }
    });

    return {
      success: true,
      data: response,
      message: 'Product image added successfully'
    };
  } catch (error: any) {
    console.error('❌ Add product image error:', error);
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to add product image'
    });
  }
});


