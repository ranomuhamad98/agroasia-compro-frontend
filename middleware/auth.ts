export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side
  if (process.server) return;
  
  const { isAuthenticated } = useLoginApi();
  
  if (!isAuthenticated.value) {
    // Redirect to login page if not authenticated
    return navigateTo('/login');
  }
}); 