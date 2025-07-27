import type { HomeApiResponse, Category, TopProduct, FAQ } from '../../types/home-api-type'

export const mockCategory: Category = {
  name: "Test Category",
  image: "/uploads/test-category.jpg",
  id: "test-category-1"
}

export const mockTopProduct: TopProduct = {
  name: "Test Product",
  summary: "Test product description",
  image: "/uploads/test-product.jpg",
  category: "Test Category",
  id: "test-product-1"
}

export const mockFAQ: FAQ = {
  title: "Test FAQ Question",
  content: "Test FAQ answer content"
}

export const minimalHomeApiResponse: HomeApiResponse = {
  status: 200,
  message: "Success",
  slider: [],
  about_us: {
    media_link: "/uploads/about.jpg",
    title: "Test About Title",
    sub_title: "Test About Subtitle",
    list: [
      { title: "Test Feature 1", content: "Test content 1" },
      { title: "Test Feature 2", content: "Test content 2" }
    ]
  },
  categories: [mockCategory],
  top_products: [mockTopProduct],
  top_product_section: {
    image: "/uploads/top-products.jpg",
    title: "Top Products"
  },
  program: {
    image: "/uploads/program.jpg",
    title: "Test Program",
    list: [
      { title: "Program 1", content: "Program content 1" }
    ]
  },
  featured: [
    {
      icon: "/uploads/icon.svg",
      title: "Featured 1",
      content: "Featured content 1"
    }
  ],
  testimonials: [],
  faq: [mockFAQ],
  header: {
    option_language_active: true,
    logo: "/uploads/logo.png",
    city: "Test City",
    email: "test@example.com"
  },
  footer: {
    about_us: "About Us",
    whatsapp_prerequisite_text: "Hello test",
    copyright_text: "© 2023 Test Company",
    sosmed_linkedin: "#",
    email: "footer@example.com",
    phone_number: "+1234567890",
    pt_name: "Test Company",
    whatsapp_number: "+1234567890",
    address: "Test Address",
    about_us_text: "Test about us text",
    sosmed_facebook: "#",
    sosmed_twitter: "#",
    sosmed_youtube: "#"
  }
}

export const errorApiResponse = {
  status: 500,
  message: "Internal Server Error"
}

export const invalidApiResponse = {
  invalid: "response",
  structure: true
}

export const emptyDataApiResponse: HomeApiResponse = {
  ...minimalHomeApiResponse,
  categories: [],
  top_products: [],
  featured: [],
  faq: [],
  testimonials: [],
  slider: []
} 