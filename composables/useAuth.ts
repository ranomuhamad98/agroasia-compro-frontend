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
  // State untuk user dan loading
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
      console.log('🔐 Attempting login...');
      
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
        // Pastikan cookies dikirim
        credentials: 'include'
      });
      
      if (response.success && response.data) {
        user.value = response.data.user;
        console.log('✅ Login successful:', response.data);
        
        // Redirect atau update state sesuai kebutuhan
        await navigateTo('/dashboard');
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
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
      console.log('🚪 Logging out...');
      
      // Call logout endpoint jika ada
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }).catch(() => {
        // Ignore error jika endpoint belum ada
        console.log('Logout endpoint not available, clearing local state');
      });
      
      // Clear local state
      user.value = null;
      console.log('✅ Logout successful');
      
      // No redirect - let the component handle the UI state change
      
    } catch (error) {
      console.error('❌ Logout error:', error);
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
      console.log('👤 Checking authentication status...');
      
      const response = await $fetch<AuthResponse>('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.success && response.data) {
        user.value = response.data.user;
        console.log('✅ User is authenticated:', response.data);
        return true;
      }
      
      user.value = null;
      return false;
      
    } catch (error: any) {
      console.log('ℹ️ User not authenticated');
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