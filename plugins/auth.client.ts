/**
 * Plugin untuk initialize authentication state
 * Hanya berjalan di client side
 */

export default defineNuxtPlugin(async () => {
  const { initAuth, user } = useAuth();
  
  console.log('🔐 Initializing authentication...');
  
  try {
    // Check authentication status
    await initAuth();
    
    if (user.value) {
      console.log('✅ User is authenticated:', user.value);
    } else {
      console.log('ℹ️ User is not authenticated');
    }
  } catch (error) {
    console.error('❌ Failed to initialize auth:', error);
  }
});