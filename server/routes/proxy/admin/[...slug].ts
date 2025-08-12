/**
 * Catch-all proxy untuk semua endpoint admin yang memerlukan autentikasi
 * Contoh penggunaan:
 * - GET /api/admin/users -> proxy ke https://agroasiaberdikari.id/api/admin/users
 * - POST /api/admin/products -> proxy ke https://agroasiaberdikari.id/api/admin/products
 * - dll
 */

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug') || '';
    const method = getMethod(event);
    const body = method !== 'GET' ? await readBody(event).catch(() => null) : null;
    
    console.log(`🔐 Admin proxy request: ${method} /admin/${slug}`);
    
    // Semua endpoint admin memerlukan autentikasi
    const response = await proxyToExternalApi(event, {
      endpoint: `/admin/${slug}`,
      method: method as any,
      body,
      requireAuth: true
    });
    
    console.log(`✅ Admin proxy successful for /admin/${slug}`);
    
    return response;
    
  } catch (error: any) {
    console.error(`❌ Admin proxy error:`, error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});