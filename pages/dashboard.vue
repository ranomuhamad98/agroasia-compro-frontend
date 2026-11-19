<template>

  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
    <!-- Loading State -->
    <div v-if="isInitializing" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4">
        </div>
        <h2 class="text-xl font-semibold text-green-800 mb-2">Loading...</h2>
        <p class="text-green-600">Checking authentication status</p>
      </div>
    </div>

    <!-- Login Form -->
    <LoginForm v-else-if="!beenAuthenticated" @authenticated="handleAuthentication" />

    <!-- Admin Dashboard -->
    <div v-else>
      <!-- Header -->
      <header class="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg border-b border-green-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div>
              <h1 class="text-3xl font-bold text-white">Admin Panel - Agro Asia Berdikari</h1>
              <p class="text-green-100 mt-1">Content Management System</p>
            </div>
            <div class="flex items-center gap-3">
              <button @click="handleLogout"
                class="border border-green-200 text-white hover:bg-green-700 hover:border-green-300 bg-transparent px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                <LogOutIcon class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tab Navigation -->
        <div class="bg-white shadow-md border border-green-200 p-1 rounded-lg mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
            <button v-for="tab in tabs" :key="tab.id" @click="adminStore.setActiveTab(tab.id)" :class="[
              'flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors font-medium',
              adminStore.activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-green-700 hover:bg-green-50'
            ]">
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="space-y-6">
          <!-- Profile Tab -->
          <div v-if="adminStore.activeTab === 'profile'">
            <div class="mb-6">
              <h2 class="page-title">My Profile</h2>
              <p class="page-subtitle">View and manage your profile information.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Profile Information Card -->
              <div class="card">
                <div class="card-header">
                  <div class="flex items-center justify-between">
                    <h3 class="text-green-800 font-semibold flex items-center gap-2">
                      <UserIcon class="w-5 h-5" />
                      Profile Information
                    </h3>
                    <button @click="checkAuth" :disabled="isLoading"
                      class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1">
                      <RefreshCwIcon class="w-3 h-3" :class="{ 'animate-spin': isLoading }" />
                      Refresh
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="flex items-center justify-center py-8">
                    <div class="flex items-center gap-2">
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <span class="text-gray-600">Loading user data...</span>
                    </div>
                  </div>

                  <!-- User Data -->
                  <div v-else-if="user" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                      <div class="flex items-center justify-center mb-4">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <img v-if="user.avatar" :src="user.avatar" :alt="user.full_name || user.email"
                            class="w-20 h-20 rounded-full object-cover" />
                          <UserIcon v-else class="w-8 h-8 text-green-600" />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 gap-3">
                        <div class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Full Name</label>
                          <p class="text-gray-900">{{ user.full_name }}</p>
                        </div>
                        <div class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Email</label>
                          <p class="text-gray-900">{{ user.email }}</p>
                        </div>
                        <div v-if="user.role" class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Role</label>
                          <p class="text-gray-900 capitalize">{{ user.role }}</p>
                        </div>
                        <div v-if="user.phone" class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Phone</label>
                          <p class="text-gray-900">{{ user.phone }}</p>
                        </div>
                        <div v-if="user.address" class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Address</label>
                          <p class="text-gray-900">{{ user.address }}</p>
                        </div>
                        <div v-if="user.created_at" class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Member Since</label>
                          <p class="text-gray-900">{{ formatDate(user.created_at) }}</p>
                        </div>
                        <div v-if="user.updated_at" class="border-b border-gray-200 pb-2">
                          <label class="text-sm font-medium text-gray-700">Last Updated</label>
                          <p class="text-gray-900">{{ formatDate(user.updated_at) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No User State -->
                  <div v-else class="text-center py-8">
                    <UserIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600 mb-4">No user data available</p>
                    <button @click="checkAuth" :disabled="isLoading"
                      class="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors">
                      Load User Data
                    </button>
                  </div>
                </div>
              </div>

              <!-- Authentication Info Card -->
              <div class="card">
                <div class="card-header">
                  <h3 class="text-green-800 font-semibold">Authentication Status</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-green-700 font-medium">Authenticated</span>
                  </div>

                  <div class="space-y-2">
                    <div class="border-b border-gray-200 pb-2">
                      <label class="text-sm font-medium text-gray-700">Login Status</label>
                      <p class="text-gray-900">{{ isLoggedIn ? 'Logged In' : 'Not Logged In' }}</p>
                    </div>
                    <div v-if="user?.email" class="border-b border-gray-200 pb-2">
                      <label class="text-sm font-medium text-gray-700">Session Email</label>
                      <p class="text-gray-900">{{ user.email }}</p>
                    </div>
                  </div>

                  <div class="pt-4 border-t border-gray-200">
                    <button @click="handleLogout"
                      class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <LogOutIcon class="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Tab -->
          <ProductTab v-if="adminStore.activeTab === 'products'" />

          <!-- Categories Tab -->
          <CategoryTab v-if="adminStore.activeTab === 'categories'" />

          <!-- Home Tab -->
          <HomeTab v-if="adminStore.activeTab === 'home'" />

          <!-- Testimonials Tab -->
          <TestimonialTab v-if="adminStore.activeTab === 'testimonials'" />

          <!-- About Us Tab -->
          <div v-if="adminStore.activeTab === 'about'">
            <div class="mb-6">
              <h2 class="page-title">About Us Management</h2>
              <p class="page-subtitle">Manage video and image galleries for the about us page.</p>
            </div>

            <div class="space-y-6">
              <MilestoneDashboard />
              <AboutUsVideoDashboard />
              <OurPeopleDashboard />
              <GalleryDashboard />
            </div>
          </div>

          <!-- Form Submissions Tab -->
           <FormSubmissionTab v-if="adminStore.activeTab === 'forms'" />

          <!-- FAQ Tab -->
          <FAQTab v-if="adminStore.activeTab === 'faq'" />

          <!-- Section Tab -->
          <SectionTab v-if="adminStore.activeTab === 'sections'" />

        </div>
      </main>
    </div>

    <!-- Dialogs -->
    <ProductForm :show="showProductDialog" :product="editingProduct" @close="closeProductDialog" />

    <TestimonialForm :show="showTestimonialDialog" :testimonial="editingTestimonial" @close="closeTestimonialDialog" />

    <CategoryForm :show="showCategoryDialog" :category="editingCategory" @close="closeCategoryDialog"
      @save="handleCategorySave" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
})
import { toast } from 'vue3-toastify'
import {
  LogOutIcon,
  PackageIcon,
  HomeIcon,
  MessageSquareIcon,
  UsersIcon,
  InfoIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
  StarIcon,
  SaveIcon,
  EyeIcon,
  EyeOffIcon,
  ClipboardListIcon,
  RefreshCwIcon,
  UserIcon,
  AlertCircleIcon,
  ImageIcon,
  LinkIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutGridIcon
} from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin.js'
import { useFileUpload } from '@/composables/useFileUpload.js'
import LoginForm from '@/components/admin/LoginForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import ProductTab from '@/components/admin/ProductTab.vue'
import TestimonialForm from '@/components/admin/TestimonialForm.vue'
import HeroBannerForm from '@/components/admin/HeroBannerForm.vue'
import CategoryForm from '@/components/admin/CategoryForm.vue'
import { useSlider } from '@/composables/useSlider'
import { useCategoryManagement } from '@/composables/useCategoryManagement'
import { ref, watch, onMounted } from 'vue'
import { useHead } from '#imports'
import TestimonialTab from '@/components/admin/TestimonialTab.vue'
import OurPeopleDashboard from '@/components/admin/OurPeopleDashboard.vue'
import GalleryDashboard from '@/components/admin/GalleryDashboard.vue'
import CategoryTab from '@/components/admin/CategoryTab.vue'
import MilestoneDashboard from '@/components/admin/MilestoneDashboard.vue'
import FormSubmissionTab from '@/components/admin/FormSubmissionTab.vue'
import FAQTab from '@/components/admin/FAQTab.vue'
import SectionTab from '@/components/admin/SectionTab.vue'
import AboutUsVideoDashboard from '@/components/admin/AboutUsVideoDashboard.vue'
import HomeTab from '@/components/admin/HomeTab.vue'

useHead({
  title: 'Admin Dashboard - Agro Asia Berdikari',
  meta: [
    { name: 'description', content: 'Admin dashboard for managing products, home page, testimonials, and more.' }
  ]
})

const { isLoggedIn, logout, user, checkAuth, isInitializing, isLoading } = useAuth();
const beenAuthenticated = ref(isLoggedIn.value);
const adminStore = useAdminStore();


// Category management
const {
  categories: categoryData,
  isLoading: categoriesLoading,
  error: categoriesError,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError: clearCategoryError
} = useCategoryManagement();

// Load sliders only when on home tab and authenticated
// const loadSliders = async () => {
//   // Check if we should load sliders
//   if (adminStore.activeTab !== 'home') {
//     return
//   }

//   if (!isLoggedIn.value) {
//     return
//   }

//   try {
//     await getSliders()

//     // Clear failed images cache when successfully loading new data
//     failedImages.value.clear()
//   } catch (error) {
//     // Error handling is done by the composable with toast notifications
//   }
// }

// Load categories only when on categories tab and authenticated
const loadCategories = async () => {
  // Check if we should load categories
  if (adminStore.activeTab !== 'categories') {
    return
  }

  if (!isLoggedIn.value) {
    return
  }

  try {
    await fetchCategories()
  } catch (error) {
    // Error handling is done by the composable with toast notifications
  }
}

// Watch for tab changes to load data when specific tabs are activated
// watch(() => adminStore.activeTab, (newTab, oldTab) => {
//   if (newTab === 'home' && oldTab !== 'home' && isLoggedIn.value) {
//     loadSliders()
//   } else if (newTab === 'categories' && oldTab !== 'categories' && isLoggedIn.value) {
//     loadCategories()
//   }
// })

// Handle logout function
const handleLogout = async () => {
  await logout(); // Clear auth data and redirect (handled by useAuth)
  adminStore.logout(); // Reset admin store state
  beenAuthenticated.value = false;
};

const handleAuthentication = async (status) => {
  beenAuthenticated.value = status;

  // Check auth when user is authenticated
  if (status && isLoggedIn.value) {
    await checkAuth();
  }
}

// Watch for authentication changes
watch(isLoggedIn, async (newValue) => {
  beenAuthenticated.value = newValue;
  if (newValue && !user.value) {
    await checkAuth();
  }
})

// Check auth on page load
onMounted(async () => {
  await checkAuth();
  beenAuthenticated.value = isLoggedIn.value;

  // Don't auto-load sliders on mount
  // They will be loaded when user activates the home tab
})

const tabs = [
  { id: 'profile', label: 'Profile', icon: UsersIcon },
  { id: 'products', label: 'Products', icon: PackageIcon },
  { id: 'categories', label: 'Categories', icon: FolderIcon },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareIcon },
  { id: 'about', label: 'About Us', icon: InfoIcon },
  { id: 'forms', label: 'Form Submissions', icon: ClipboardListIcon },
  { id: 'faq', label: 'FAQ', icon: HelpCircleIcon },
  { id: 'sections', label: 'Sections', icon: LayoutGridIcon },
]

// Product dialog
const showProductDialog = ref(false)
const editingProduct = ref(null)

const openProductDialog = (product = null) => {
  editingProduct.value = product
  showProductDialog.value = true
}

const closeProductDialog = () => {
  showProductDialog.value = false
  editingProduct.value = null
}

// Testimonial dialog
const showTestimonialDialog = ref(false)
const editingTestimonial = ref(null)

const openTestimonialDialog = (testimonial = null) => {
  editingTestimonial.value = testimonial
  showTestimonialDialog.value = true
}

const closeTestimonialDialog = () => {
  showTestimonialDialog.value = false
  editingTestimonial.value = null
}


// Category dialog
const showCategoryDialog = ref(false)
const editingCategory = ref(null)

const openCategoryDialog = (category = null) => {
  editingCategory.value = category
  showCategoryDialog.value = true
}

const closeCategoryDialog = () => {
  showCategoryDialog.value = false
  editingCategory.value = null

  // Only refresh categories if we're still on the categories tab and authenticated
  if (adminStore.activeTab === 'categories' && isLoggedIn.value) {
    loadCategories()
  }
}

const handleSliderSave = (action) => {
  // The slider list will be refreshed automatically by the form's API calls
}

const handleCategorySave = async (categoryData) => {
  try {
    if (editingCategory.value) {
      // Update existing category
      await updateCategory(editingCategory.value.id, categoryData)
    } else {
      // Create new category
      await createCategory(categoryData)
    }

    // Close dialog after successful save
    closeCategoryDialog()
  } catch (error) {
    throw error // Re-throw to let the form handle the error
  }
}

// Category management functions
const handleDeleteCategory = async (category) => {
  // Check if we should allow deletion
  if (adminStore.activeTab !== 'categories') {
    return
  }

  if (!isLoggedIn.value) {
    toast.error('Please authenticate first')
    return
  }

  if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
    try {
      await deleteCategory(category.id)
    } catch (error) {
      toast.error('Failed to delete category. Please try again.')
    }
  }
}

// Track failed images to prevent retries
const failedImages = ref(new Set())

// Utility functions
const handleImageError = (event) => {
  const originalSrc = event.target.src

  // Mark this image as failed to prevent retries
  failedImages.value.add(originalSrc)

  // Set placeholder image
  event.target.src = '/placeholder.svg?height=400&width=800'

  // Remove error handler to prevent infinite loops
  event.target.onerror = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

// Gallery image upload
const selectGalleryImage = async () => {
  try {
    const file = await selectFile()
    const imageUrl = await uploadFile(file)
    adminStore.addGalleryImage(imageUrl)
  } catch (error) {
    toast.error(error.message)
  }
}

// Save functions
const saveVideo = () => {
  toast.success('Video URL updated successfully!')
}

// Date formatting helper removed (duplicate)
</script>
