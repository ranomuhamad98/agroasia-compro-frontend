import { defineStore } from "pinia"

export const useAdminStore = defineStore("admin", {
  state: () => ({
    isLoggedIn: false,
    activeTab: "profile",

    // Products
    products: [
      {
        id: "1",
        image: "/placeholder.svg?height=200&width=200",
        name: "Organic Rice",
        description: "Premium quality organic rice grown without pesticides",
        category: "Grains",
        additionalInfo: "Available in 5kg and 10kg packages",
        isTop: true,
      },
      {
        id: "2",
        image: "/placeholder.svg?height=200&width=200",
        name: "Fresh Vegetables",
        description: "Daily fresh vegetables from local farmers",
        category: "Vegetables",
        additionalInfo: "Seasonal availability",
        isTop: true,
      },
    ],

    // Categories
    categories: [],

    // Testimonials
    testimonials: [
      {
        id: "1",
        image: "/placeholder.svg?height=100&width=100",
        name: "John Doe",
        personInfo: "CEO, ABC Company",
        description: "Excellent service and quality products. Highly recommended!",
        flag: "home",
      },
      {
        id: "2",
        image: "/placeholder.svg?height=100&width=100",
        name: "Jane Smith",
        personInfo: "Restaurant Owner",
        description: "Fresh ingredients delivered on time every day.",
        flag: "about",
      },
    ],

    // Home content - Multiple hero banners
    heroBanners: [
      {
        id: "1",
        image: "/placeholder.svg?height=400&width=800",
        title: "Welcome to Agro Asia Berdikari",
        subtitle: "Quality agricultural products for your needs",
        isActive: true,
      },
      {
        id: "2",
        image: "/placeholder.svg?height=400&width=800",
        title: "Fresh Organic Products",
        subtitle: "Directly from local farmers",
        isActive: true,
      },
    ],

    // About Us
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    galleries: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],

    // Form Submissions
    submissions: [
      {
        id: "1",
        name: "John Doe",
        phone: "+62 812-3456-7890",
        email: "john@example.com",
        subject: "Product Inquiry",
        message: "I would like to know more about your organic rice products.",
        date: "2024-01-15",
        status: "new",
      },
      {
        id: "2",
        name: "Jane Smith",
        phone: "+62 813-9876-5432",
        email: "jane@example.com",
        subject: "Partnership Opportunity",
        message: "We are interested in becoming a distributor for your products.",
        date: "2024-01-14",
        status: "read",
      },
      {
        id: "3",
        name: "Bob Johnson",
        phone: "+62 814-1111-2222",
        email: "bob@example.com",
        subject: "Bulk Order",
        message: "Can you provide pricing for bulk orders of vegetables?",
        date: "2024-01-13",
        status: "replied",
      },
    ],
  }),

  getters: {
    topProductsCount: (state) => state.products.filter((p) => p.isTop).length,
    activeHeroBanners: (state) => state.heroBanners.filter((h) => h.isActive),
    newSubmissionsCount: (state) => state.submissions.filter((s) => s.status === "new").length,
    readSubmissionsCount: (state) => state.submissions.filter((s) => s.status === "read").length,
    repliedSubmissionsCount: (state) => state.submissions.filter((s) => s.status === "replied").length,
  },

  actions: {
    login(username, password) {
      if (username === "admin" && password === "admin123") {
        this.isLoggedIn = true
        return true
      }
      return false
    },

    logout() {
      this.isLoggedIn = false
      this.activeTab = "products"
    },

    setActiveTab(tab) {
      this.activeTab = tab
    },

    // Product actions
    addProduct(product) {
      this.products.push({
        ...product,
        id: Date.now().toString(),
      })
    },

    updateProduct(id, product) {
      const index = this.products.findIndex((p) => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...product, id }
      }
    },

    deleteProduct(id) {
      this.products = this.products.filter((p) => p.id !== id)
    },

    // Testimonial actions
    addTestimonial(testimonial) {
      this.testimonials.push({
        ...testimonial,
        id: Date.now().toString(),
      })
    },

    updateTestimonial(id, testimonial) {
      const index = this.testimonials.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.testimonials[index] = { ...testimonial, id }
      }
    },

    deleteTestimonial(id) {
      this.testimonials = this.testimonials.filter((t) => t.id !== id)
    },

    // Hero Banner actions
    addHeroBanner(banner) {
      this.heroBanners.push({
        ...banner,
        id: Date.now().toString(),
      })
    },

    updateHeroBanner(id, banner) {
      const index = this.heroBanners.findIndex((h) => h.id === id)
      if (index !== -1) {
        this.heroBanners[index] = { ...banner, id }
      }
    },

    deleteHeroBanner(id) {
      this.heroBanners = this.heroBanners.filter((h) => h.id !== id)
    },

    toggleHeroBannerStatus(id) {
      const banner = this.heroBanners.find((h) => h.id === id)
      if (banner) {
        banner.isActive = !banner.isActive
      }
    },

    // About Us actions
    updateVideoUrl(url) {
      this.videoUrl = url
    },

    addGalleryImage(url) {
      this.galleries.push(url)
    },

    removeGalleryImage(index) {
      this.galleries.splice(index, 1)
    },

    // Form submission actions
    deleteSubmission(id) {
      this.submissions = this.submissions.filter((s) => s.id !== id)
    },

    updateSubmissionStatus(id, status) {
      const submission = this.submissions.find((s) => s.id === id)
      if (submission) {
        submission.status = status
      }
    },

    // Category actions
    setCategories(categories) {
      this.categories = categories
    },

    addCategory(category) {
      this.categories.push(category)
    },

    updateCategory(id, category) {
      const index = this.categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.categories[index] = { ...category, id }
      }
    },

    deleteCategory(id) {
      this.categories = this.categories.filter((c) => c.id !== id)
    },
  },
})
