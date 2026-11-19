import type { ProfileResponse, ProfileError } from '@/types/profile-api-type';
import { toast } from 'vue3-toastify';

export function useMyProfile() {
    const apiClient = useProxyApiClient();
    
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const profile = ref<ProfileResponse['data']['user'] | null>(null);

    // Get current user profile
    const fetchProfile = async (): Promise<ProfileResponse | null> => {
        try {
            isLoading.value = true;
            error.value = null;

            const response = await apiClient.get<ProfileResponse>('/auth/me');

            // Validate response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response format');
            }

            if (response.status !== 200) {
                throw new Error(response.message || 'Failed to fetch profile');
            }

            if (response.data?.user) {
                profile.value = response.data.user;
            }

            return response;
        } catch (err: any) {
            let errorMessage = 'Failed to fetch profile. Please try again.';
            
            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.statusMessage) {
                errorMessage = err.statusMessage;
            }
            
            error.value = errorMessage;
            toast.error(errorMessage);
            
            profile.value = null;
            
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const refreshProfile = async () => {
        return await fetchProfile();
    };

    const hasProfile = computed(() => !!profile.value);

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        profile: readonly(profile),
        hasProfile,
        
        fetchProfile,
        refreshProfile
    };
}
