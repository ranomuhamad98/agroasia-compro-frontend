/**
 * Catch-all proxy untuk endpoint public yang tidak memerlukan autentikasi
 * Contoh penggunaan:
 * - GET /api/public/products -> proxy ke https://agroasiaberdikari.id/api/public/products
 * - GET /api/public/categories -> proxy ke https://agroasiaberdikari.id/api/public/categories
 * - dll
 */

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug') || '';
    const method = getMethod(event);
    const body = method !== 'GET' ? await readBody(event).catch(() => null) : null;
    
    console.log(`🌐 Public proxy request: ${method} /public/${slug}`);
    
    // Endpoint public tidak memerlukan autentikasi
    const response = await proxyToExternalApi(event, {
      endpoint: `/public/${slug}`,
      method: method as any,
      body,
      requireAuth: false
    });
    
    console.log(`✅ Public proxy successful for /public/${slug}`);
    
    return response;
    
  } catch (error: any) {
    console.error(`❌ Public proxy error:`, error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});