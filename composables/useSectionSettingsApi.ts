import type { SectionApiResponse, SectionNameApiResponse } from "@/types/sections-api-types";
import { toast } from "vue3-toastify";

export function useSectionSettingsApi(section: string) {
    const apiClient = useProxyApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: sectionsData, refresh, pending } = useAsyncData<SectionApiResponse>(
        `sections-api-data-section-${section}`,
        async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const response = await apiClient.get<SectionApiResponse>(`/sections/${section}`);

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

    const sectionSettings = computed(() => sectionsData.value?.settings || []);

    return {
        sectionSettings,
        error,
        pending,
        refresh,
    }
}