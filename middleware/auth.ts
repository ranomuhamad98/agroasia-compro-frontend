export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side
  if (process.server) return;
  
  // Skip auth check for dashboard page (karena handle sendiri)
  if (to.path === '/dashboard') return;
  
  const { isLoggedIn } = useAuth();
  
  // if (!isLoggedIn.value) {
  //   // Redirect to login page if not authenticated
  //   return navigateTo('/login');
  // }
}); 