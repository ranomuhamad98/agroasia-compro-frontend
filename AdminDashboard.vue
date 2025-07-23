<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
    <!-- Login Form -->
    <div v-if="!isLoggedIn" class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md shadow-xl border-green-200 bg-white rounded-lg overflow-hidden">
        <div class="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <h1 class="text-2xl font-bold">Admin Login</h1>
          <p class="text-green-100 mt-1">Sign in to manage agroasiaberdikari.id content</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="username" class="text-green-700 font-medium block">Username</label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-green-700 font-medium block">Password</label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
            <div v-if="loginError" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {{ loginError }}
            </div>
            <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>
          <div class="mt-4 text-sm text-green-600 text-center font-medium">
            Demo credentials: admin / admin123
          </div>
        </div>
      </div>
    </div>

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
              @click="activeTab = tab.id"
              :class="[
                'flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors font-medium',
                activeTab === tab.id
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
          <div v-if="activeTab === 'products'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-2xl font-bold text-green-800">Product Management</h2>
                <p class="text-green-600">
                  Manage your products. Top products ({{ topProductsCount }}/4) will be displayed on the home page.
                </p>
              </div>
              <button
                @click="openProductDialog()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="product in products"
                :key="product.id"
                class="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg overflow-hidden"
              >
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
                      <button
                        @click="openProductDialog(product)"
                        class="border border-green-300 text-green-700 hover:bg-green-50 p-2 rounded-md transition-colors"
                      >
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteProduct(product.id)"
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
          <div v-if="activeTab === 'home'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-green-800">Home Page Management</h2>
              <p class="text-green-600">Manage the hero banner for your home page.</p>
            </div>

            <div class="border border-green-200 shadow-md bg-white rounded-lg overflow-hidden">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4">
                <h3 class="text-green-800 font-semibold">Hero Banner</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="space-y-2">
                  <label for="heroBanner" class="text-green-700 font-medium block">Hero Banner Image URL</label>
                  <input
                    id="heroBanner"
                    v-model="heroBanner"
                    type="url"
                    placeholder="https://example.com/hero-banner.jpg"
                    class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-green-700 font-medium block">Preview</label>
                  <div class="border-2 border-green-200 rounded-lg overflow-hidden">
                    <img
                      :src="heroBanner || '/placeholder.svg?height=400&width=800'"
                      alt="Hero Banner Preview"
                      class="w-full h-64 object-cover"
                    />
                  </div>
                </div>
                <button
                  @click="saveHeroBanner"
                  class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <SaveIcon class="w-4 h-4" />
                  Save Hero Banner
                </button>
              </div>
            </div>
          </div>

          <!-- Testimonials Tab -->
          <div v-if="activeTab === 'testimonials'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-2xl font-bold text-green-800">Testimonial Management</h2>
                <p class="text-green-600">Manage customer testimonials for home and about us pages.</p>
              </div>
              <button
                @click="openTestimonialDialog()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
                Add Testimonial
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="testimonial in testimonials"
                :key="testimonial.id"
                class="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg overflow-hidden"
              >
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
                      <button
                        @click="openTestimonialDialog(testimonial)"
                        class="border border-green-300 text-green-700 hover:bg-green-50 p-2 rounded-md transition-colors"
                      >
                        <EditIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteTestimonial(testimonial.id)"
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
          <div v-if="activeTab === 'about'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-green-800">About Us Management</h2>
              <p class="text-green-600">Manage video and image galleries for the about us page.</p>
            </div>

            <div class="space-y-6">
              <!-- Video Section -->
              <div class="border border-green-200 shadow-md bg-white rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4">
                  <h3 class="text-green-800 font-semibold">About Us Video</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="space-y-2">
                    <label for="videoUrl" class="text-green-700 font-medium block">Video URL (YouTube Embed)</label>
                    <input
                      id="videoUrl"
                      v-model="videoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-green-700 font-medium block">Video Preview</label>
                    <div class="aspect-video border-2 border-green-200 rounded-lg overflow-hidden">
                      <iframe
                        :src="videoUrl"
                        class="w-full h-full"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                  <button
                    @click="saveVideo"
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <SaveIcon class="w-4 h-4" />
                    Save Video
                  </button>
                </div>
              </div>

              <!-- Gallery Section -->
              <div class="border border-green-200 shadow-md bg-white rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4">
                  <h3 class="text-green-800 font-semibold">Image Galleries</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex space-x-2">
                    <input
                      v-model="newImageUrl"
                      type="url"
                      placeholder="Enter image URL"
                      class="flex-1 px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                    />
                    <button
                      @click="addImage"
                      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <PlusIcon class="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="(imageUrl, index) in galleries"
                      :key="index"
                      class="relative group"
                    >
                      <img
                        :src="imageUrl || '/placeholder.svg?height=200&width=300'"
                        :alt="`Gallery ${index + 1}`"
                        class="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                      />
                      <button
                        @click="removeImage(index)"
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                      >
                        <Trash2Icon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div v-if="galleries.length === 0" class="text-center py-8 text-green-500">
                    No images in gallery. Add some images to get started.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Submissions Tab -->
          <div v-if="activeTab === 'forms'">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-2xl font-bold text-green-800">Form Submissions</h2>
                <p class="text-green-600">Manage contact form submissions from your website.</p>
              </div>
              <div class="relative">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <input
                  v-model="searchTerm"
                  placeholder="Search submissions..."
                  class="pl-10 w-64 px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="border border-green-200 shadow-md bg-white rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-green-600">New</p>
                    <p class="text-2xl font-bold text-red-600">{{ newSubmissionsCount }}</p>
                  </div>
                  <MailIcon class="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div class="border border-green-200 shadow-md bg-white rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-green-600">Read</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ readSubmissionsCount }}</p>
                  </div>
                  <MailIcon class="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div class="border border-green-200 shadow-md bg-white rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-green-600">Replied</p>
                    <p class="text-2xl font-bold text-green-600">{{ repliedSubmissionsCount }}</p>
                  </div>
                  <MailIcon class="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Submissions Table -->
            <div class="border border-green-200 shadow-md bg-white rounded-lg overflow-hidden">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-4">
                <h3 class="text-green-800 font-semibold">All Submissions</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-green-50">
                    <tr>
                      <th class="text-left p-4 text-green-700 font-medium">Name</th>
                      <th class="text-left p-4 text-green-700 font-medium">Phone</th>
                      <th class="text-left p-4 text-green-700 font-medium">Subject</th>
                      <th class="text-left p-4 text-green-700 font-medium">Message</th>
                      <th class="text-left p-4 text-green-700 font-medium">Date</th>
                      <th class="text-left p-4 text-green-700 font-medium">Status</th>
                      <th class="text-left p-4 text-green-700 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="submission in filteredSubmissions"
                      :key="submission.id"
                      class="hover:bg-green-50 border-b border-green-100"
                    >
                      <td class="p-4 font-medium text-green-800">{{ submission.name }}</td>
                      <td class="p-4">
                        <div class="flex items-center text-green-700">
                          <PhoneIcon class="w-4 h-4 mr-2 text-green-400" />
                          {{ submission.phone }}
                        </div>
                      </td>
                      <td class="p-4 text-green-700">{{ submission.subject }}</td>
                      <td class="p-4 max-w-xs truncate text-green-600">{{ submission.message }}</td>
                      <td class="p-4 text-green-700">{{ submission.date }}</td>
                      <td class="p-4">
                        <select
                          v-model="submission.status"
                          :class="[
                            'px-3 py-1 rounded-full text-xs font-medium border',
                            getStatusColor(submission.status)
                          ]"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                      <td class="p-4">
                        <button
                          @click="deleteSubmission(submission.id)"
                          class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                        >
                          <Trash2Icon class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="filteredSubmissions.length === 0" class="text-center py-8 text-green-500">
                  No submissions found matching your search.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Product Dialog -->
    <div
      v-if="showProductDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeProductDialog"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
        <div class="p-6 border-b border-green-200">
          <h3 class="text-green-800 text-xl font-semibold">
            {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <p class="text-green-600 mt-1">Fill in the product information below.</p>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 space-y-4">
          <div class="space-y-2">
            <label for="productImage" class="text-green-700 font-medium block">Product Image URL</label>
            <input
              id="productImage"
              v-model="productForm.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="productName" class="text-green-700 font-medium block">Product Name</label>
            <input
              id="productName"
              v-model="productForm.name"
              type="text"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="productDescription" class="text-green-700 font-medium block">Description</label>
            <textarea
              id="productDescription"
              v-model="productForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            ></textarea>
          </div>
          <div class="space-y-2">
            <label for="productCategory" class="text-green-700 font-medium block">Category</label>
            <select
              id="productCategory"
              v-model="productForm.category"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label for="productAdditionalInfo" class="text-green-700 font-medium block">Additional Information</label>
            <textarea
              id="productAdditionalInfo"
              v-model="productForm.additionalInfo"
              rows="2"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
            ></textarea>
          </div>
          <div class="flex items-center space-x-2">
            <input
              id="productIsTop"
              v-model="productForm.isTop"
              type="checkbox"
              :disabled="!canSetAsTop"
              class="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
            />
            <label for="productIsTop" class="text-green-700 font-medium">
              Display on Home Page (Top Product)
              <span v-if="!canSetAsTop" class="text-sm text-red-500 ml-2">Maximum 4 top products allowed</span>
            </label>
          </div>
          <div class="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              @click="closeProductDialog"
              class="border border-green-300 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {{ editingProduct ? 'Update' : 'Add' }} Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Testimonial Dialog -->
    <div
      v-if="showTestimonialDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeTestimonialDialog"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
        <div class="p-6 border-b border-green-200">
          <h3 class="text-green-800 text-xl font-semibold">
            {{ editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial' }}
          </h3>
          <p class="text-green-600 mt-1">Fill in the testimonial information below.</p>
        </div>
        <form @submit.prevent="saveTestimonial" class="p-6 space-y-4">
          <div class="space-y-2">
            <label for="testimonialImage" class="text-green-700 font-medium block">Person Image URL</label>
            <input
              id="testimonialImage"
              v-model="testimonialForm.image"
              type="url"
              placeholder="https://example.com/person.jpg"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="testimonialName" class="text-green-700 font-medium block">Name</label>
            <input
              id="testimonialName"
              v-model="testimonialForm.name"
              type="text"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="testimonialPersonInfo" class="text-green-700 font-medium block">Person Information</label>
            <input
              id="testimonialPersonInfo"
              v-model="testimonialForm.personInfo"
              type="text"
              placeholder="e.g., CEO, Company Name"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="testimonialDescription" class="text-green-700 font-medium block">Testimonial Description</label>
            <textarea
              id="testimonialDescription"
              v-model="testimonialForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            ></textarea>
          </div>
          <div class="space-y-2">
            <label for="testimonialFlag" class="text-green-700 font-medium block">Display Location</label>
            <select
              id="testimonialFlag"
              v-model="testimonialForm.flag"
              class="w-full px-3 py-2 border border-green-300 rounded-md focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select display location</option>
              <option value="home">Home Page</option>
              <option value="about">About Us Page</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              @click="closeTestimonialDialog"
              class="border border-green-300 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {{ editingTestimonial ? 'Update' : 'Add' }} Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  SearchIcon,
  MailIcon,
  PhoneIcon
} from 'lucide-vue-next'

// Authentication
const isLoggedIn = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')

// Navigation
const activeTab = ref('products')
const tabs = [
  { id: 'products', label: 'Products', icon: PackageIcon },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'testimonials', label: 'Testimonials', icon: UsersIcon },
  { id: 'about', label: 'About Us', icon: InfoIcon },
  { id: 'forms', label: 'Form Submissions', icon: MessageSquareIcon }
]

// Products
const products = ref([
  {
    id: '1',
    image: '/placeholder.svg?height=200&width=200',
    name: 'Organic Rice',
    description: 'Premium quality organic rice grown without pesticides',
    category: 'Grains',
    additionalInfo: 'Available in 5kg and 10kg packages',
    isTop: true
  },
  {
    id: '2',
    image: '/placeholder.svg?height=200&width=200',
    name: 'Fresh Vegetables',
    description: 'Daily fresh vegetables from local farmers',
    category: 'Vegetables',
    additionalInfo: 'Seasonal availability',
    isTop: true
  }
])

const categories = ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Spices']
const showProductDialog = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  image: '',
  name: '',
  description: '',
  category: '',
  additionalInfo: '',
  isTop: false
})

// Testimonials
const testimonials = ref([
  {
    id: '1',
    image: '/placeholder.svg?height=100&width=100',
    name: 'John Doe',
    personInfo: 'CEO, ABC Company',
    description: 'Excellent service and quality products. Highly recommended!',
    flag: 'home'
  },
  {
    id: '2',
    image: '/placeholder.svg?height=100&width=100',
    name: 'Jane Smith',
    personInfo: 'Restaurant Owner',
    description: 'Fresh ingredients delivered on time every day.',
    flag: 'about'
  }
])

const showTestimonialDialog = ref(false)
const editingTestimonial = ref(null)
const testimonialForm = ref({
  image: '',
  name: '',
  personInfo: '',
  description: '',
  flag: 'home'
})

// Home
const heroBanner = ref('/placeholder.svg?height=400&width=800')

// About Us
const videoUrl = ref('https://www.youtube.com/embed/dQw4w9WgXcQ')
const galleries = ref([
  '/placeholder.svg?height=200&width=300',
  '/placeholder.svg?height=200&width=300',
  '/placeholder.svg?height=200&width=300',
  '/placeholder.svg?height=200&width=300'
])
const newImageUrl = ref('')

// Form Submissions
const submissions = ref([
  {
    id: '1',
    name: 'John Doe',
    phone: '+62 812-3456-7890',
    subject: 'Product Inquiry',
    message: 'I would like to know more about your organic rice products.',
    date: '2024-01-15',
    status: 'new'
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+62 813-9876-5432',
    subject: 'Partnership Opportunity',
    message: 'We are interested in becoming a distributor for your products.',
    date: '2024-01-14',
    status: 'read'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    phone: '+62 814-1111-2222',
    subject: 'Bulk Order',
    message: 'Can you provide pricing for bulk orders of vegetables?',
    date: '2024-01-13',
    status: 'replied'
  }
])
const searchTerm = ref('')

// Computed properties
const topProductsCount = computed(() => products.value.filter(p => p.isTop).length)
const canSetAsTop = computed(() => !productForm.value.isTop || topProductsCount.value < 4 || editingProduct.value?.isTop)

const filteredSubmissions = computed(() => {
  return submissions.value.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const newSubmissionsCount = computed(() => submissions.value.filter(s => s.status === 'new').length)
const readSubmissionsCount = computed(() => submissions.value.filter(s => s.status === 'read').length)
const repliedSubmissionsCount = computed(() => submissions.value.filter(s => s.status === 'replied').length)

// Methods
const handleLogin = () => {
  if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin123') {
    isLoggedIn.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Invalid username or password'
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  loginForm.value = { username: '', password: '' }
  loginError.value = ''
}

// Product methods
const openProductDialog = (product = null) => {
  editingProduct.value = product
  if (product) {
    productForm.value = { ...product }
  } else {
    productForm.value = {
      image: '',
      name: '',
      description: '',
      category: '',
      additionalInfo: '',
      isTop: false
    }
  }
  showProductDialog.value = true
}

const closeProductDialog = () => {
  showProductDialog.value = false
  editingProduct.value = null
}

const saveProduct = () => {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    products.value[index] = { ...productForm.value, id: editingProduct.value.id }
  } else {
    products.value.push({
      ...productForm.value,
      id: Date.now().toString()
    })
  }
  closeProductDialog()
}

const deleteProduct = (id) => {
  products.value = products.value.filter(p => p.id !== id)
}

// Testimonial methods
const openTestimonialDialog = (testimonial = null) => {
  editingTestimonial.value = testimonial
  if (testimonial) {
    testimonialForm.value = { ...testimonial }
  } else {
    testimonialForm.value = {
      image: '',
      name: '',
      personInfo: '',
      description: '',
      flag: 'home'
    }
  }
  showTestimonialDialog.value = true
}

const closeTestimonialDialog = () => {
  showTestimonialDialog.value = false
  editingTestimonial.value = null
}

const saveTestimonial = () => {
  if (editingTestimonial.value) {
    const index = testimonials.value.findIndex(t => t.id === editingTestimonial.value.id)
    testimonials.value[index] = { ...testimonialForm.value, id: editingTestimonial.value.id }
  } else {
    testimonials.value.push({
      ...testimonialForm.value,
      id: Date.now().toString()
    })
  }
  closeTestimonialDialog()
}

const deleteTestimonial = (id) => {
  testimonials.value = testimonials.value.filter(t => t.id !== id)
}

// Home methods
const saveHeroBanner = () => {
  alert('Hero banner updated successfully!')
}

// About Us methods
const saveVideo = () => {
  alert('Video URL updated successfully!')
}

const addImage = () => {
  if (newImageUrl.value.trim()) {
    galleries.value.push(newImageUrl.value)
    newImageUrl.value = ''
  }
}

const removeImage = (index) => {
  galleries.value.splice(index, 1)
}

// Form submission methods
const deleteSubmission = (id) => {
  submissions.value = submissions.value.filter(s => s.id !== id)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'read':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'replied':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>
