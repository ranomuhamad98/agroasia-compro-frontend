export default defineEventHandler(async (event) => {
  try {
    console.log('📊 Dashboard data request received');
    
    // Check authentication
    const cookieHeader = getHeader(event, 'cookie');
    if (!cookieHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    // Fetch multiple data sources in parallel
    const [categoriesResponse, slidersResponse, productsResponse] = await Promise.allSettled([
      // Fetch categories
      $fetch('https://agroasiaberdikari.id/api/categories', {
        headers: {
          'accept': 'application/json',
          'cookie': cookieHeader
        }
      }),
      
      // Fetch sliders
      $fetch('https://agroasiaberdikari.id/api/sliders', {
        headers: {
          'accept': 'application/json',
          'cookie': cookieHeader
        }
      }),
      
      // Fetch products (assuming there's a products endpoint)
      $fetch('https://agroasiaberdikari.id/api/products', {
        headers: {
          'accept': 'application/json',
          'cookie': cookieHeader
        }
      }).catch(() => ({ products: [] })) // Fallback if products endpoint doesn't exist
    ]);

    // Process responses
    const dashboardData = {
      categories: categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : { categories: [] },
      sliders: slidersResponse.status === 'fulfilled' ? slidersResponse.value : { sliders: [] },
      products: productsResponse.status === 'fulfilled' ? productsResponse.value : { products: [] },
      stats: {
        categoriesCount: categoriesResponse.status === 'fulfilled' ? categoriesResponse.value.categories?.length || 0 : 0,
        slidersCount: slidersResponse.status === 'fulfilled' ? slidersResponse.value.sliders?.length || 0 : 0,
        productsCount: productsResponse.status === 'fulfilled' ? productsResponse.value.products?.length || 0 : 0,
        lastUpdated: new Date().toISOString()
      }
    };

    console.log('✅ Dashboard data retrieved successfully');
    
    return {
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Dashboard data retrieval error:', error);
    
    // Handle authentication errors
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }
    
    // Handle other errors
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Dashboard data retrieval failed'
    });
  }
}); 