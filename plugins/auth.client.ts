/**
 * Plugin untuk initialize authentication state
 * Hanya berjalan di client side
 */

export default defineNuxtPlugin(async () => {
  const { initAuth, user } = useAuth();
  
  try {
    // Check authentication status
    await initAuth();
  } catch (error) {
    // Silent error handling for production
  }
});