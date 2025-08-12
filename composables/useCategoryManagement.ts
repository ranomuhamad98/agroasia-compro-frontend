import type { Category, CategoriesApiResponse } from '@/types/categories-api-types';
import { toast } from 'vue3-toastify';

export function useCategoryManagement() {
  const apiClient = useProxyApiClient();
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<Category[]>([]);

  // Get all categories
  const fetchCategories = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.get<{ success: boolean; data: CategoriesApiResponse; message: string }>('/product/category/get');
      
      if (response.success && response.data) {
        // The data contains the CategoriesApiResponse structure
        const categoriesResponse = response.data;
        categories.value = categoriesResponse.categories || [];
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      toast.error('Failed to fetch categories', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      error.value = err.message || 'Failed to fetch categories';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create new category
  const createCategory = async (categoryData: { name: string; image_link: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.post<{ success: boolean; data: CategoriesApiResponse; message: string }>('/product/category/post', {
        body: categoryData
      });

      if (response.success) {
        // Refresh the categories list
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (err: any) {
      toast.error('Failed to create category', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      error.value = err.message || 'Failed to create category';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update category
  const updateCategory = async (id: string, categoryData: { name: string; image_link: string }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.put<{ success: boolean; data: any; message: string }>(`/product/category/${id}`, {
        body: categoryData
      });

      if (response.success) {
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (err: any) {
      toast.error('Failed to update category', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      error.value = err.message || 'Failed to update category';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiClient.delete<{ success: boolean; data: any; message: string }>(`/product/category/${id}`, {
      });

      if (response.success) {
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (err: any) {
      toast.error('Failed to delete category', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      error.value = err.data.data.message || 'Failed to delete category';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  };
} 