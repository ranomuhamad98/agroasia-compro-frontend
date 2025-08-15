import type { AboutVideo } from "@/types/about-api-type";
import type { SectionSingleApiResponse } from "@/types/sections-api-types";
import { toast } from "vue3-toastify";

export function useAboutUsVideoApi() {
    const apiClient = useApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: aboutVideo, refresh: refreshAboutVideo, pending: aboutVideoPending } = useAsyncData<SectionSingleApiResponse>(
        'about-video-api-data',
        async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const response = await apiClient.get<SectionSingleApiResponse>('/settings/18a211cef8a2de0d96fc0a9bb085a0d7');
                return response;
            } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Failed to fetch about video data';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }, {
        default: () => null,
        server: true,
    }); 

    const aboutVideoValue = computed(() => aboutVideo.value?.setting.value || '');

    return {
        aboutVideo,
        refreshAboutVideo,
        aboutVideoPending,
        aboutVideoValue,
    }
}