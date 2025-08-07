import type { Category, CategoriesApiResponse } from '@/types/categories-api-types';

export function useCategoryManagement() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<Category[]>([]);

  // Get all categories
  const fetchCategories = async () => {
    try {
      console.log('📂 Fetching categories...');
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<{ success: boolean; data: CategoriesApiResponse; message: string }>('/api/product/category/get');
      
      if (response.success && response.data) {
        // The data contains the CategoriesApiResponse structure
        const categoriesResponse = response.data;
        categories.value = categoriesResponse.categories || [];
        console.log('✅ Categories fetched successfully:', categories.value.length);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch categories:', err);
      error.value = err.message || 'Failed to fetch categories';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create new category
  const createCategory = async (categoryData: { name: string; image_link: string }) => {
    try {
      console.log('📁 Creating category:', categoryData);
      isLoading.value = true;
      error.value = null;

      const response = await $fetch('/api/product/category/post', {
        method: 'POST',
        body: categoryData
      });

      if (response.success) {
        console.log('✅ Category created successfully');
        // Refresh the categories list
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (err: any) {
      console.error('❌ Failed to create category:', err);
      error.value = err.message || 'Failed to create category';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update category (if needed in the future)
  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      console.log('📝 Updating category:', id, categoryData);
      isLoading.value = true;
      error.value = null;

      const response = await $fetch(`/api/product/category/${id}`, {
        method: 'PUT',
        body: categoryData
      });

      if (response.success) {
        console.log('✅ Category updated successfully');
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (err: any) {
      console.error('❌ Failed to update category:', err);
      error.value = err.message || 'Failed to update category';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete category (if needed in the future)
  const deleteCategory = async (id: string) => {
    try {
      console.log('🗑️ Deleting category:', id);
      isLoading.value = true;
      error.value = null;

      const response = await $fetch(`/api/product/category/${id}`, {
        method: 'DELETE'
      });

      if (response.success) {
        console.log('✅ Category deleted successfully');
        await fetchCategories();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (err: any) {
      console.error('❌ Failed to delete category:', err);
      error.value = err.message || 'Failed to delete category';
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