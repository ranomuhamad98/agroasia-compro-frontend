import type { CategoriesApiResponse, Category } from '@/types/categories-api-types';
import { toast } from 'vue3-toastify';

export function useCategoriesApi() {
    const apiClient = useApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: categories, refresh, pending } = useAsyncData<CategoriesApiResponse>(
        'categories',
        async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const response = await apiClient.get<CategoriesApiResponse>('/categories');

                if (!response || typeof response !== 'object') {
                    throw new Error('Invalid response format');
                }

                if (response.status === 200 && response.categories) {
                    return response as CategoriesApiResponse;
                } else {
                    throw new Error(response.message || 'API request failed');
                }
            } catch (err: any) {
                const errorMessage = 'Failed to fetch categories data';
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

    const categoriesData = computed(() => (categories.value?.categories as Category[]) || []);

    const refreshData = async () => {
        await refresh();
    };

    const hasData = computed(() => !!categories.value?.categories && (categories.value.categories as Category[]).length > 0);

    return { categoriesData, error, pending, hasData, refreshData };
}