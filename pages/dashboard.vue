<template>

  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
    <!-- Loading State -->
    <div v-if="isInitializing" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
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
              <button
                @click="handleLogout"
                class="border border-green-200 text-white hover:bg-green-700 hover:border-green-300 bg-transparent px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
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
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="adminStore.setActiveTab(tab.id)"
              :class="[
                'flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors font-medium',
                adminStore.activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-green-700 hover:bg-green-50'
              ]"
            >
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
                    <button 
                      @click="checkAuth"
                      :disabled="isLoading"
                      class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
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
                          <img 
                            v-if="user.avatar" 
                            :src="user.avatar" 
                            :alt="user.full_name || user.email"
                            class="w-20 h-20 rounded-full object-cover"
                          />
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
                    <button 
                      @click="checkAuth"
                      :disabled="isLoading"
                      class="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
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
                    <button 
                      @click="handleLogout"
                      class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOutIcon class="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Tab -->
          <div v-if="adminStore.activeTab === 'products'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="page-title">Product Management</h2>
                <p class="page-subtitle">
                  Manage your products. Top products ({{ adminStore.topProductsCount }}/4) will be displayed on the home page.
                </p>
              </div>
              <button @click="openProductDialog()" class="btn-primary flex items-center gap-2">
                <PlusIcon class="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="product in adminStore.products" :key="product.id" class="card">
                <div class="p-4 border-b border-green-100">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-semibold text-green-800">{{ product.name }}</h3>
                      <span
                        v-if="product.isTop"
                        class="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <StarIcon class="w-3 h-3" />
                        Top
                      </span>
                    </div>
                    <div class="flex space-x-1">
                      <button @click="openProductDialog(product)" class="btn-secondary p-2">
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="adminStore.deleteProduct(product.id)"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <img
                    :src="product.image || '/placeholder.svg?height=200&width=200'"
                    :alt="product.name"
                    class="w-full h-32 object-cover rounded-md mb-3 border border-green-200"
                  />
                  <span class="border border-green-300 text-green-700 text-xs px-2 py-1 rounded-full">
                    {{ product.category }}
                  </span>
                  <p class="text-sm text-green-600 mt-2 mb-2">{{ product.description }}</p>
                  <p v-if="product.additionalInfo" class="text-xs text-green-500">{{ product.additionalInfo }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Home Tab -->
          <div v-if="adminStore.activeTab === 'home'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="page-title">Home Page Management</h2>
                <p class="page-subtitle">Manage hero banners for your home page.</p>
              </div>
              <div class="flex items-center gap-3">
                <button 
                  @click="loadSliders()" 
                  :disabled="slidersLoading || !isLoggedIn"
                  class="btn-secondary flex items-center gap-2 disabled:opacity-50"
                  :title="!isLoggedIn ? 'Please authenticate first' : 'Refresh slider list'"
                >
                  <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': slidersLoading }" />
                  {{ slidersLoading ? 'Loading...' : 'Refresh' }}
                </button>
                <button @click="openHeroBannerDialog()" class="btn-primary flex items-center gap-2">
                  <PlusIcon class="w-4 h-4" />
                  Add Slider
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="slidersLoading" class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p class="text-green-600">Loading sliders...</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="slidersError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex items-center gap-2">
                <AlertCircleIcon class="w-5 h-5 text-red-500" />
                <p class="text-red-700">{{ slidersError }}</p>
                <button 
                  @click="loadSliders()" 
                  class="ml-auto text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-300 hover:bg-red-100"
                >
                  Try Again
                </button>
              </div>
            </div>

            <!-- Not Loaded Yet State -->
            <div v-else-if="sliders.length === 0 && !slidersError && !slidersLoading" class="text-center py-12">
              <ImageIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Welcome to Slider Management</h3>
              <p class="text-gray-500 mb-4">Click "Refresh" to load existing sliders or create your first one.</p>
              <div class="flex justify-center gap-3">
                <button @click="loadSliders()" class="btn-secondary">
                  Load Sliders
                </button>
                <button @click="openHeroBannerDialog()" class="btn-primary">
                  Add First Slider
                </button>
              </div>
            </div>

            <!-- Sliders Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="slider in sliders" :key="slider.id" class="card">
                <div class="p-4 border-b border-green-100">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h3 class="text-lg font-semibold text-green-800 mb-0">{{ slider.title }}</h3>
                        <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                          Position {{ slider.position }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-2">{{ slider.sub_title }}</p>
                      <div v-if="slider.button_title" class="flex items-center gap-1 text-xs text-gray-500">
                        <LinkIcon class="w-3 h-3" />
                        Button: "{{ slider.button_title }}"
                        <span v-if="slider.button_link" class="truncate max-w-32" :title="slider.button_link">
                          → {{ slider.button_link }}
                        </span>
                      </div>
                    </div>
                    <div class="flex space-x-1 ml-3">
                      <button @click="openHeroBannerDialog(slider)" class="btn-secondary p-2" title="Edit Slider">
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="handleDeleteSlider(slider)"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Delete Slider"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <div class="relative">
                    <NuxtImg
                      :src="failedImages.has(slider.image_link) ? '/placeholder.svg?height=400&width=800' : (slider.image_link || '/placeholder.svg?height=400&width=800')"
                      :alt="slider.title"
                      class="w-full h-32 object-cover rounded-md mb-3 border border-green-200"
                      :class="{ 'opacity-75': failedImages.has(slider.image_link) }"
                    />
                    <div v-if="failedImages.has(slider.image_link)" class="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Image Failed
                    </div>
                  </div>
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Created: {{ formatDate(slider.input_time) }}</span>
                    <span v-if="slider.update_time !== slider.input_time">
                      Updated: {{ formatDate(slider.update_time) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Testimonials Tab -->
          <div v-if="adminStore.activeTab === 'testimonials'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="page-title">Testimonial Management</h2>
                <p class="page-subtitle">Manage customer testimonials for home and about us pages.</p>
              </div>
              <button @click="openTestimonialDialog()" class="btn-primary flex items-center gap-2">
                <PlusIcon class="w-4 h-4" />
                Add Testimonial
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="testimonial in adminStore.testimonials" :key="testimonial.id" class="card">
                <div class="p-4 border-b border-green-100">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-semibold text-green-800">{{ testimonial.name }}</h3>
                      <span
                        :class="[
                          'text-xs px-2 py-1 rounded-full',
                          testimonial.flag === 'home'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 border border-green-300'
                        ]"
                      >
                        {{ testimonial.flag === 'home' ? 'Home' : 'About Us' }}
                      </span>
                    </div>
                    <div class="flex space-x-1">
                      <button @click="openTestimonialDialog(testimonial)" class="btn-secondary p-2">
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="adminStore.deleteTestimonial(testimonial.id)"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <div class="flex items-start space-x-4">
                    <img
                      :src="testimonial.image || '/placeholder.svg?height=100&width=100'"
                      :alt="testimonial.name"
                      class="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-green-700">{{ testimonial.personInfo }}</p>
                      <p class="text-sm text-green-600 mt-2">{{ testimonial.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- About Us Tab -->
          <div v-if="adminStore.activeTab === 'about'">
            <div class="mb-6">
              <h2 class="page-title">About Us Management</h2>
              <p class="page-subtitle">Manage video and image galleries for the about us page.</p>
            </div>

            <div class="space-y-6">
              <!-- Video Section -->
              <div class="card">
                <div class="card-header">
                  <h3 class="text-green-800 font-semibold">About Us Video</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="space-y-2">
                    <label for="videoUrl" class="text-green-700 font-medium block">Video URL (YouTube Embed)</label>
                    <input
                      id="videoUrl"
                      v-model="adminStore.videoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      class="input-field"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-green-700 font-medium block">Video Preview</label>
                    <div class="aspect-video border-2 border-green-200 rounded-lg overflow-hidden">
                      <iframe
                        :src="adminStore.videoUrl"
                        class="w-full h-full"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                  <button @click="saveVideo" class="btn-primary w-full flex items-center justify-center gap-2">
                    <SaveIcon class="w-4 h-4" />
                    Save Video
                  </button>
                </div>
              </div>

              <!-- Gallery Section -->
              <div class="card">
                <div class="card-header">
                  <h3 class="text-green-800 font-semibold">Image Galleries</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex space-x-2">
                    <button @click="selectGalleryImage" class="btn-primary flex items-center gap-2">
                      <PlusIcon class="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="(imageUrl, index) in adminStore.galleries"
                      :key="index"
                      class="relative group"
                    >
                      <img
                        :src="imageUrl || '/placeholder.svg?height=200&width=300'"
                        :alt="`Gallery ${index + 1}`"
                        class="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                      />
                      <button
                        @click="adminStore.removeGalleryImage(index)"
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div v-if="adminStore.galleries.length === 0" class="text-center py-8 text-green-500">
                    No images in gallery. Add some images to get started.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Submissions Tab -->
          <ClientOnly fallback="Loading..." fallback-tag="span">
            <FormSubmissions v-if="adminStore.activeTab === 'forms'" />
          </ClientOnly>
        </div>
      </main>
    </div>

    <!-- Dialogs -->
    <ProductForm
      :show="showProductDialog"
      :product="editingProduct"
      @close="closeProductDialog"
    />

    <TestimonialForm
      :show="showTestimonialDialog"
      :testimonial="editingTestimonial"
      @close="closeTestimonialDialog"
    />

            <HeroBannerForm
          :show="showHeroBannerDialog"
          :banner="editingHeroBanner"
          @close="closeHeroBannerDialog"
          @save="handleSliderSave"
        />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
})
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
  LinkIcon
} from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin.js'
import { useFileUpload } from '@/composables/useFileUpload.js'
import LoginForm from '@/components/admin/LoginForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import TestimonialForm from '@/components/admin/TestimonialForm.vue'
import HeroBannerForm from '@/components/admin/HeroBannerForm.vue'
import { useSlider } from '@/composables/useSlider'
import FormSubmissions from '@/components/admin/FormSubmissions.vue'
import { ref, watch, onMounted } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Admin Dashboard - Agro Asia Berdikari',
  meta: [
    { name: 'description', content: 'Admin dashboard for managing products, home page, testimonials, and more.' }
  ]
})

const { isLoggedIn, logout, user, checkAuth, isInitializing, isLoading } = useAuth();
const beenAuthenticated = ref(isLoggedIn.value);
const adminStore = useAdminStore();
const { 
  sliders, 
  isLoading: slidersLoading, 
  error: slidersError, 
  getSliders, 
  updateSlider,
  deleteSlider,
  refreshSliders 
} = useSlider();

// Load sliders only when on home tab and authenticated
const loadSliders = async () => {
  // Check if we should load sliders
  if (adminStore.activeTab !== 'home') {
    console.log('📂 Not on home tab, skipping slider load')
    return
  }
  
  if (!isLoggedIn.value) {
    console.log('🔒 Not authenticated, skipping slider load')
    return
  }
  
  try {
    console.log('📥 Loading sliders for home tab...')
    await getSliders()
    console.log('✅ Sliders loaded successfully:', sliders.value.length)
    
    // Clear failed images cache when successfully loading new data
    failedImages.value.clear()
    console.log('🧹 Cleared failed images cache')
  } catch (error) {
    console.error('❌ Failed to load sliders:', error)
    // Don't show alert, just log - the UI will show the error state
  }
}

// Watch for tab changes to load sliders when home tab is activated
watch(() => adminStore.activeTab, (newTab, oldTab) => {
  if (newTab === 'home' && oldTab !== 'home' && isLoggedIn.value) {
    console.log('🏠 Home tab activated, loading sliders...')
    loadSliders()
  } else if (newTab !== 'home') {
    console.log('📂 Left home tab, sliders will not auto-refresh')
  }
})

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
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareIcon },
  { id: 'about', label: 'About Us', icon: InfoIcon },
  { id: 'forms', label: 'Form Submissions', icon: ClipboardListIcon }
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

// Hero Banner dialog
const showHeroBannerDialog = ref(false)
const editingHeroBanner = ref(null)

const openHeroBannerDialog = (banner = null) => {
  editingHeroBanner.value = banner
  showHeroBannerDialog.value = true
}

const closeHeroBannerDialog = () => {
  showHeroBannerDialog.value = false
  editingHeroBanner.value = null
  
  // Only refresh sliders if we're still on the home tab and authenticated
  if (adminStore.activeTab === 'home' && isLoggedIn.value) {
    console.log('🔄 Refreshing sliders after dialog close...')
    loadSliders()
  } else {
    console.log('📂 Not on home tab or not authenticated, skipping slider refresh')
  }
}

const handleSliderSave = (action) => {
  console.log(`🎉 Slider ${action} successfully!`)
  // The slider list will be refreshed automatically by the form's API calls
}

// Slider management functions
const handleDeleteSlider = async (slider) => {
  // Check if we should allow deletion
  if (adminStore.activeTab !== 'home') {
    console.log('📂 Not on home tab, delete operation not allowed')
    return
  }
  
  if (!isLoggedIn.value) {
    console.log('🔒 Not authenticated, delete operation not allowed')
    alert('Please authenticate first')
    return
  }
  
  if (confirm(`Are you sure you want to delete the slider "${slider.title}"?`)) {
    try {
      console.log('🗑️ Deleting slider:', slider.id)
      await deleteSlider(slider.id)
      console.log('✅ Slider deleted successfully')
    } catch (error) {
      console.error('❌ Failed to delete slider:', error)
      alert('Failed to delete slider. Please try again.')
    }
  }
}

// Track failed images to prevent retries
const failedImages = ref(new Set())

// Utility functions
const handleImageError = (event) => {
  const originalSrc = event.target.src
  console.warn('🖼️ Image failed to load:', originalSrc)
  
  // Mark this image as failed to prevent retries
  failedImages.value.add(originalSrc)
  
  // Set placeholder image
  event.target.src = '/placeholder.svg?height=400&width=800'
  
  // Remove error handler to prevent infinite loops
  event.target.onerror = null
  
  console.log('🔄 Replaced with placeholder image, no retry will be attempted')
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
    console.error('Date formatting error:', error)
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
    alert(error.message)
  }
}

// Save functions
const saveVideo = () => {
  alert('Video URL updated successfully!')
}

// Date formatting helper removed (duplicate)
</script>

