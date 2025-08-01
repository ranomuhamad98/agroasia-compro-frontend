import type { LoginRequest, LoginResponse, LoginError } from '@/types/login-api-type';

export function useLoginApi() {
    const apiClient = useApiClient();
    
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const user = ref<LoginResponse['data']['user'] | null>(null);
    const token = ref<string | null>(null);

    // Login function
    const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
        try {
            console.log('🚀 Attempting login with API...');
            isLoading.value = true;
            error.value = null;

            const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

            console.log('📡 Login API Response received:', response);

            // Validate response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response format');
            }

            if (response.status !== 200) {
                throw new Error(response.message || 'Login failed');
            }

            // Store user data and token
            if (response.data) {
                user.value = response.data.user;
                token.value = response.data.token;
                
                // Store token in cookie for persistence
                const tokenCookie = useCookie<string | null>('auth-token', {
                    default: () => null,
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    sameSite: 'strict',
                    secure: true
                });
                tokenCookie.value = response.data.token;

                // Store user in cookie
                const userCookie = useCookie<LoginResponse['data']['user'] | null>('auth-user', {
                    default: () => null,
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    sameSite: 'strict',
                    secure: true
                });
                userCookie.value = response.data.user;
            }

            console.log('✅ Login successful');
            return response;
        } catch (err: any) {
            console.error('❌ Login failed:', err);
            
            // Handle specific error messages from the API
            if (err.data?.message) {
                error.value = err.data.message;
            } else if (err.statusMessage) {
                error.value = err.statusMessage;
            } else {
                error.value = 'Login failed. Please check your credentials.';
            }
            
            // Clear any existing auth data on error
            user.value = null;
            token.value = null;
            
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    // Logout function
    const logout = () => {
        console.log('🚪 Logging out user...');
        
        user.value = null;
        token.value = null;
        
        // Clear cookies
        const tokenCookie = useCookie<string | null>('auth-token');
        const userCookie = useCookie<LoginResponse['data']['user'] | null>('auth-user');
        tokenCookie.value = null;
        userCookie.value = null;
        
        console.log('✅ Logout successful');
    };

    // Initialize from cookies on composable creation
    const initializeAuth = () => {
        const tokenCookie = useCookie<string | null>('auth-token');
        const userCookie = useCookie<LoginResponse['data']['user'] | null>('auth-user');
        
        if (tokenCookie.value && userCookie.value) {
            token.value = tokenCookie.value;
            user.value = userCookie.value;
            console.log('🔄 Authentication restored from cookies');
        }
    };

    // Check if user is authenticated
    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // Initialize auth state
    initializeAuth();

    return {
        // State
        isLoading: readonly(isLoading),
        error: readonly(error),
        user: readonly(user),
        token: readonly(token),
        isAuthenticated,
        
        // Methods
        login,
        logout,
        initializeAuth
    };
}
