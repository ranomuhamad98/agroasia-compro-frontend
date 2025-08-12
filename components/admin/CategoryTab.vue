<template>
    <div>
        <HeaderLayout title="Category Management"
            subtitle="Manage product categories for your store." actionMessage="Add Category"
            :disableRefresh="categoriesPending" :loading="categoriesPending" @action="openCategoryDialog"
            @refresh="refreshData" />

        <!-- Error Message -->
        <div v-if="categoriesError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ categoriesError }}
        </div>

        <!-- Testimonials Grid -->
        <div v-if="categoriesData.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryCard
                v-for="category in categoriesData" :key="category.id" :category="category"
                @delete="handleDeleteCategory" @edit="handleEditCategory" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!categoriesPending || !isLoading" class="text-center py-12">
            <div class="text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ filterType === 'all' ? 'Get started by creating a new category.' : `No ${filterType}
                    categories found.` }}
                </p>
                <div class="mt-6">
                    <button @click="openCategoryDialog()" class="btn-primary flex items-center gap-2 mx-auto">
                        <PlusIcon class="w-4 h-4 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>
        </div>

        <CategoryForm v-if="showCategoryForm" :show="showCategoryForm" :category="selectedCategory"
            @close="handleCloseCategoryDialog"
            @save="handleSaveCategory" />
    </div>
</template>

<script setup>
import HeaderLayout from './HeaderLayout.vue';
import { PlusIcon } from 'lucide-vue-next';
import CategoryForm from './CategoryForm.vue';
import CategoryCard from './CategoryCard.vue';
import { useCategoriesApi } from '@/composables/useCategoriesApi';
import { useCategoryManagement } from '@/composables/useCategoryManagement';

const showCategoryForm = ref(false)
const selectedCategory = ref(null)

const { categoriesData, isLoading, error, pending, refreshData } = useCategoriesApi()

const {
    categoriesPending,
    categoriesError,
    deleteCategory
} = useCategoryManagement();


onMounted(async () => {
    await refreshData()
})

// Handle delete category
const handleDeleteCategory = async (category) => {
    if (confirm('Are you sure you want to delete this category?')) {
        const success = await deleteCategory(category.id)
        if (success) {
            // Refresh the current filter
            await refreshData()
        }
    }
}

// Open category dialog (placeholder - implement based on your modal system)
const openCategoryDialog = (category = null) => {
    showCategoryForm.value = true
    selectedCategory.value = category
}

const handleCloseCategoryDialog = () => {
    showCategoryForm.value = false
    selectedCategory.value = null
}

const handleSaveCategory = (category) => {
    handleCloseCategoryDialog()
    refreshData()
}

const handleEditCategory = (category) => {
    openCategoryDialog(category)
}
</script>