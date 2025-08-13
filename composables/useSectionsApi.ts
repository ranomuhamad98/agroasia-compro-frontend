import type { SectionApiResponse, SectionNameApiResponse } from "@/types/sections-api-types";
import { toast } from "vue3-toastify";

export function useSectionsApi() {
    const apiClient = useApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: sectionsData, refresh, pending } = useAsyncData<SectionNameApiResponse>(
        'sections-api-data',
        async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const response = await apiClient.get<SectionNameApiResponse>('/settings/sections');

                if (!response || typeof response !== 'object') {
                    throw new Error('Invalid response format');
                }

                if (response.status !== 200) {
                    throw new Error(response.message || 'API request failed');
                }

                return response;
            } catch (err: any) {
                const errorMessage = err.statusMessage || err.message || 'Failed to fetch sections data';
                error.value = errorMessage;
                toast.error(errorMessage);
                throw err;
            } finally {
                isLoading.value = false;
            }
        }
    )

    const sectionsName = computed(() => sectionsData.value?.sections || []);

    return {
        sectionsName,
        error,
        pending,
        refresh,
    }
}