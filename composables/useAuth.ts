import { toast } from "vue3-toastify";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  email: string;
  full_name?: string;
  role?: string;
  [key: string]: any;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
  message: string;
}

export function useAuth() {
  const apiClient = useProxyApiClient();
  const user = ref<AuthUser | null>(null);
  const isLoggedIn = computed(() => !!user.value);
  const isLoading = ref(false);
  const isInitializing = ref(true); // Loading state untuk pengecekan awal authentication
  
  /**
   * Login user menggunakan proxy endpoint
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        body: credentials,
      });
      
      if (response.success && response.data) {
        user.value = response.data.user;
        
        // Redirect atau update state sesuai kebutuhan
        await navigateTo('/dashboard');
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
      
    } catch (error: any) {
      toast.error('Login failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      user.value = null;
      
      // Handle specific error cases
      if (error.statusCode === 401) {
        throw new Error('Invalid email or password');
      }
      
      if (error.statusCode === 422) {
        throw new Error('Please check your input');
      }
      
      throw new Error(error.data?.message || error.message || 'Login failed');
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Logout user
   */
  const logout = async () => {
    try {
      isLoading.value = true;
      
      // Call logout endpoint jika ada
      await apiClient.post('/auth/logout', {
      }).catch(() => {
        // Ignore error jika endpoint belum ada
      });
      
      // Clear local state
      user.value = null;
      
      // No redirect - let the component handle the UI state change
      
    } catch (error) {
      toast.error('Logout failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      // Clear state even if API call fails
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      
      const response = await apiClient.get<AuthResponse>('/auth/me', {
      });
      
      if (response.success && response.data) {
        user.value = response.data.user;
        return true;
      }
      
      user.value = null;
      return false;
      
    } catch (error: any) {
      toast.error('Check auth failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      user.value = null;
      return false;
    } finally {
      isInitializing.value = false;
    }
  };
  
  /**
   * Initialize auth state (untuk digunakan di app.vue atau plugin)
   */
  const initAuth = async () => {
    // Only check auth on client side
    if (process.client) {
      isInitializing.value = true;
      await checkAuth();
    } else {
      isInitializing.value = false;
    }
  };
  
  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    return await checkAuth();
  };
  
  return {
    // State
    user: readonly(user),
    isLoggedIn,
    isLoading: readonly(isLoading),
    isInitializing: readonly(isInitializing),
    
    // Methods
    login,
    logout,
    checkAuth,
    initAuth,
    refreshUser
  };
}