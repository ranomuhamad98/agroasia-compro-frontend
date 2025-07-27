import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import type { HomeApiResponse } from '../types/home-api-type'

// Mock API response data
export const mockHomeApiResponse: HomeApiResponse = {
  status: 200,
  message: "Data retrieved successfully",
  slider: [],
  about_us: {
    media_link: "/uploads/about-us.jpg",
    title: "Trusted Export Solutions, Directly from the Source",
    sub_title: "Delivering quality agricultural goods through efficient, professional export and sales services.",
    list: [
      { title: "Quality Assurance", content: "We ensure all products meet international standards" },
      { title: "Direct Sourcing", content: "We work directly with farmers to ensure quality" },
      { title: "Sustainable Practices", content: "We follow environmentally friendly approaches" }
    ]
  },
  categories: [
    {
      name: "Grains & Cereals",
      image: "/uploads/2025/0719/test-category.jpg",
      id: "test-category-id-1"
    },
    {
      name: "Spices & Herbs",
      image: "/uploads/2025/0719/test-spices.jpg",
      id: "test-category-id-2"
    }
  ],
  top_products: [
    {
      name: "Test Product 1",
      summary: "Test product description",
      image: "/uploads/test-product.png",
      category: "Grains & Cereals",
      id: "test-product-id-1"
    }
  ],
  top_product_section: {
    image: "/uploads/top-products.jpg",
    title: "Discover our top selling and top rated products"
  },
  program: {
    image: "/uploads/program.jpg",
    title: "Our Agricultural Programs",
    list: [
      { title: "Farmer Support", content: "Helping farmers improve their yields" }
    ]
  },
  featured: [
    {
      icon: "/uploads/icons/natural.png",
      title: "100% natural",
      content: "from handpicked seller"
    }
  ],
  testimonials: [],
  faq: [
    {
      title: "What can i get shopping at Agro Asia Berdikari?",
      content: "You can get our products in premium quality at a significantly more affordable price."
    }
  ],
  header: {
    option_language_active: true,
    logo: "/uploads/logo.png",
    city: "Tangerang selatan",
    email: "agroasiaberdikari.id@gmail.com"
  },
  footer: {
    about_us: "about us",
    whatsapp_prerequisite_text: "Hello, I would like to inquire about your products.",
    copyright_text: "© 2023 PT Agro Exports Indonesia. All rights reserved.",
    sosmed_linkedin: "#",
    email: "agroasiaberdikari.id@gmail.com",
    phone_number: "+622174634590",
    pt_name: "PT Agro Asia Berdikari",
    whatsapp_number: "+628127733166",
    address: "Jl Palapa perum serua barokah Blok D 12 serua Tangerang selatan 15414",
    about_us_text: "We are dedicated to providing the best agricultural products globally.",
    sosmed_facebook: "#",
    sosmed_twitter: "#",
    sosmed_youtube: "#"
  }
}

// MSW server setup for API mocking
export const server = setupServer(
  http.get('https://agroasiaberdikari.id/api/home', () => {
    return HttpResponse.json(mockHomeApiResponse)
  }),
  
  // API error simulation
  http.get('https://agroasiaberdikari.id/api/home-error', () => {
    return HttpResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }),
  
  // API timeout simulation
  http.get('https://agroasiaberdikari.id/api/home-timeout', async () => {
    await new Promise(resolve => setTimeout(resolve, 15000))
    return HttpResponse.json(mockHomeApiResponse)
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
}) 