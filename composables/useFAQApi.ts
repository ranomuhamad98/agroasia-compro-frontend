import type { FAQApiResponse } from '@/types/faq-api-type';
import { toast } from 'vue3-toastify';

export const useFAQApi = (params?: { active_only?: boolean }) => {
    const reactiveParams = reactive({
        active_only: params?.active_only || false,
    });

    const apiClient = useApiClient();
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: faqData, refresh, pending } = useAsyncData<FAQApiResponse>(
        'faq-api-data',
        async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const activeOnly = reactiveParams.active_only;
                const response = await apiClient.get<FAQApiResponse>(`/faqs?active_only=${activeOnly}`);

                if (!response || typeof response !== 'object') {
                    throw new Error('Invalid response format');
                }

                if (response.status !== 200) {
                    throw new Error(response.message || 'API request failed');
                }

                return response;
            } catch (err: any) {
                const errorMessage = err.statusMessage || err.message || 'Failed to fetch FAQ data';
                error.value = errorMessage;
                toast.error(errorMessage);
                throw err;
            } finally {
                isLoading.value = false;
            }
        },
        {
            default: () => null,
            server: true,
        }
    )

    const faq = computed(() => faqData.value?.faqs || []);

    const refreshWithParams = (newParams?: { active_only?: boolean }) => {
        reactiveParams.active_only = newParams?.active_only || false;
        return refresh();
    };

    return {
        refresh: refreshWithParams,
        pending,
        isLoading,
        error,
        faq: readonly(faq),
    }
}