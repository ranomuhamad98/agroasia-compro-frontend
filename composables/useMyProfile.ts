import type { ProfileResponse, ProfileError } from '@/types/profile-api-type';

export function useMyProfile() {
    const apiClient = useApiClient();
    
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const profile = ref<ProfileResponse['data']['user'] | null>(null);

    // Get current user profile
    const fetchProfile = async (): Promise<ProfileResponse | null> => {
        try {
            console.log('🚀 Fetching user profile from API...');
            isLoading.value = true;
            error.value = null;

            // Get token from cookie for authentication
            const tokenCookie = useCookie<string | null>('auth-token');
            
            if (!tokenCookie.value) {
                throw new Error('No authentication token found');
            }

            const response = await apiClient.get<ProfileResponse>('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${tokenCookie.value}`
                }
            });

            console.log('📡 Profile API Response received:', response);

            // Validate response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response format');
            }

            if (response.status !== 200) {
                throw new Error(response.message || 'Failed to fetch profile');
            }

            // Store profile data
            if (response.data?.user) {
                profile.value = response.data.user;
                
                // Update user cookie with fresh data
                const userCookie = useCookie<ProfileResponse['data']['user'] | null>('auth-user', {
                    default: () => null,
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    sameSite: 'strict',
                    secure: true
                });
                userCookie.value = response.data.user;
            }

            console.log('✅ Profile fetch successful');
            return response;
        } catch (err: any) {
            console.error('❌ Profile fetch failed:', err);
            
            // Handle specific error messages from the API
            if (err.data?.message) {
                error.value = err.data.message;
            } else if (err.statusMessage) {
                error.value = err.statusMessage;
            } else {
                error.value = 'Failed to fetch profile. Please try again.';
            }
            
            // Clear profile data on error
            profile.value = null;
            
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    // Refresh profile data
    const refreshProfile = async () => {
        return await fetchProfile();
    };

    // Initialize profile from existing user cookie
    const initializeProfile = () => {
        const userCookie = useCookie<ProfileResponse['data']['user'] | null>('auth-user');
        
        if (userCookie.value) {
            profile.value = userCookie.value;
            console.log('🔄 Profile initialized from cookie');
        }
    };

    // Check if profile is loaded
    const hasProfile = computed(() => !!profile.value);

    // Initialize profile on composable creation
    initializeProfile();

    return {
        // State
        isLoading: readonly(isLoading),
        error: readonly(error),
        profile: readonly(profile),
        hasProfile,
        
        // Methods
        fetchProfile,
        refreshProfile,
        initializeProfile
    };
}
