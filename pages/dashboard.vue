<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
    <!-- Login Form -->
    <LoginForm v-if="!isAuthenticated" />

    <!-- Admin Dashboard -->
    <div v-else>
      <!-- Header -->
      <header class="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg border-b border-green-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div>
              <h1 class="text-3xl font-bold text-white">Admin Panel - Agro Asia Berdikari</h1>
              <p class="text-green-100 mt-1">Content Management System</p>
              <p v-if="user?.email" class="text-green-200 text-sm mt-1">Welcome, {{ user.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="border border-green-200 text-white hover:bg-green-700 hover:border-green-300 bg-transparent px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <LogOutIcon class="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tab Navigation -->
        <div class="bg-white shadow-md border border-green-200 p-1 rounded-lg mb-6">
          <div class="grid grid-cols-5 gap-1">
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
              <button @click="openHeroBannerDialog()" class="btn-primary flex items-center gap-2">
                <PlusIcon class="w-4 h-4" />
                Add Hero Banner
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="banner in adminStore.heroBanners" :key="banner.id" class="card">
                <div class="p-4 border-b border-green-100">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-semibold text-green-800">{{ banner.title }}</h3>
                      <span
                        :class="[
                          'text-xs px-2 py-1 rounded-full',
                          banner.isActive
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        ]"
                      >
                        {{ banner.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    <div class="flex space-x-1">
                      <button
                        @click="adminStore.toggleHeroBannerStatus(banner.id)"
                        :class="[
                          'p-2 rounded-md transition-colors',
                          banner.isActive
                            ? 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                            : 'border border-green-300 text-green-700 hover:bg-green-50'
                        ]"
                      >
                        <EyeIcon v-if="banner.isActive" class="w-4 h-4" />
                        <EyeOffIcon v-else class="w-4 h-4" />
                      </button>
                      <button @click="openHeroBannerDialog(banner)" class="btn-secondary p-2">
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="adminStore.deleteHeroBanner(banner.id)"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <img
                    :src="banner.image || '/placeholder.svg?height=400&width=800'"
                    :alt="banner.title"
                    class="w-full h-32 object-cover rounded-md mb-3 border border-green-200"
                  />
                  <p class="text-sm text-green-600 mb-1">{{ banner.subtitle }}</p>
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
  EyeOffIcon
} from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin.js'
import { useFileUpload } from '@/composables/useFileUpload.js'
import LoginForm from '@/components/admin/LoginForm.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import TestimonialForm from '@/components/admin/TestimonialForm.vue'
import HeroBannerForm from '@/components/admin/HeroBannerForm.vue'
import FormSubmissions from '@/components/admin/FormSubmissions.vue'
import { ref } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Admin Dashboard - Agro Asia Berdikari',
  meta: [
    { name: 'description', content: 'Admin dashboard for managing products, home page, testimonials, and more.' }
  ]
})

const { isAuthenticated, logout, user } = useLoginApi();
const adminStore = useAdminStore();

// Handle logout function
const handleLogout = async () => {
  logout(); // Clear auth data from login API
  adminStore.logout(); // Reset admin store state
  await navigateTo('/login'); // Redirect to login page
};

const tabs = [
  { id: 'products', label: 'Products', icon: PackageIcon },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'testimonials', label: 'Testimonials', icon: UsersIcon },
  { id: 'about', label: 'About Us', icon: InfoIcon },
  { id: 'forms', label: 'Form Submissions', icon: MessageSquareIcon }
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
</script>
