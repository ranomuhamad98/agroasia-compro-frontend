// Manual API Test
// Run this in browser console to test API directly

async function testApiDirectly() {
  try {
    console.log('🧪 Testing API directly...');
    
    const response = await fetch('https://agroasiaberdikari.id/api/home');
    const data = await response.json();
    
    console.log('✅ Direct API test successful:', {
      status: response.status,
      dataStatus: data.status,
      categoriesCount: data.categories?.length || 0,
      productsCount: data.top_products?.length || 0,
      message: data.message
    });
    
    return data;
  } catch (error) {
    console.error('❌ Direct API test failed:', error);
    throw error;
  }
}

// Run the test
testApiDirectly(); 