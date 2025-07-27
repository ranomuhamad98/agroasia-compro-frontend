import type { CategoriesApiResponse, Category } from '@/types/categories-api-types';

export function useCategoriesApi() {
    const apiClient = useApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const { data: categories, refresh, pending } = useAsyncData<CategoriesApiResponse>(
        'categories',
        async () => {
            try {
                console.log('🚀 Fetching categories data from API...');
                isLoading.value = true;
                error.value = null;

                const response = await apiClient.get<CategoriesApiResponse>('/categories');

                console.log('📡 API Response received:', response);

                // Validate response structure
                if (!response || typeof response !== 'object') {
                    throw new Error('Invalid response format');
                }

                if (response.status !== 200) {
                    throw new Error(response.message || 'API request failed');
                }

                console.log('✅ Categories data fetched successfully');
                return response;
            } catch (err: any) {
                console.error('❌ Failed to fetch categories data:', err);
                error.value = 'Failed to fetch categories data';
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
        console.log('🔄 Refreshing categories data...');
        await refresh();
    };

    const hasData = computed(() => !!categories.value?.categories && (categories.value.categories as Category[]).length > 0);

    return { categoriesData, error, pending, hasData, refreshData };
}