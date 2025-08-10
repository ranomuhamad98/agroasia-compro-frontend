import type { 
  Testimonial, 
  CreateTestimonialRequest, 
  CreateTestimonialResponse,
  TestimonialListResponse 
} from '@/types/testimonial-api-type'
import { toast } from 'vue3-toastify'

export function useTestimonialManagement() {
  const apiClient = useApiClient()
  const testimonials = ref<Testimonial[]>([])

  // Reactive state for loading and error handling
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  // Create new testimonial
  const createTestimonial = async (testimonialData: CreateTestimonialRequest): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

      // Validate input data
      if (!testimonialData.pic || !testimonialData.name || !testimonialData.profession || !testimonialData.message) {
        const errorMsg = 'All fields are required: pic, name, profession, message'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      if (typeof testimonialData.status !== 'boolean') {
        const errorMsg = 'Status must be a boolean (true/false)'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Make API request through proxy with credentials
      const response = await $fetch<CreateTestimonialResponse>('/api/testimonials', {
        method: 'POST',
        body: testimonialData,
        credentials: 'include' // Include cookies for authentication
      })

      if (response.status === 200 || response.status === 201) {
        const successMsg = 'Testimonial created successfully!'
        successMessage.value = successMsg
        toast.success(successMsg)
        return response.testimonial || null
      } else {
        const errorMsg = response.message || 'Failed to create testimonial'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while creating testimonial'
      error.value = errorMsg
      toast.error(errorMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get all testimonials
  const getTestimonials = async (activeOnly?: boolean): Promise<Testimonial[]> => {
    try {
      isLoading.value = true
      error.value = null

      // Build query parameters
      const params = new URLSearchParams()
      if (activeOnly !== undefined) {
        params.append('active_only', String(activeOnly))
      }

      const queryString = params.toString()
      const endpoint = queryString ? `/testimonials?${queryString}` : '/testimonials'

      const response = await $fetch<TestimonialListResponse>(`/api${endpoint}`, {
        credentials: 'include' // Include cookies for authentication
      })

      if (response.status === 200 && response.testimonials) {
        testimonials.value = response.testimonials
        return testimonials.value
      } else {
        const errorMsg = response.message || 'Failed to fetch testimonials'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while fetching testimonials'
      error.value = errorMsg
      toast.error(errorMsg)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Get testimonial by ID
  const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<CreateTestimonialResponse>(`/api/testimonials/${id}`, {
        credentials: 'include' // Include cookies for authentication
      })

      if (response.status === 200) {
        return response.testimonial || null
      } else {
        const errorMsg = response.message || 'Failed to fetch testimonial'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while fetching testimonial'
      error.value = errorMsg
      toast.error(errorMsg)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update testimonial
  const updateTestimonial = async (id: string, testimonialData: Partial<CreateTestimonialRequest>): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

      const response = await $fetch<CreateTestimonialResponse>(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: testimonialData,
        credentials: 'include' // Include cookies for authentication
      })

      if (response.status === 200) {
        const successMsg = 'Testimonial updated successfully!'
        successMessage.value = successMsg
        toast.success(successMsg)
        return response.testimonial || null
      } else {
        const errorMsg = response.message || 'Failed to update testimonial'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while updating testimonial'
      error.value = errorMsg
      toast.error(errorMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete testimonial
  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

      const response = await $fetch<{ success: boolean; message: string }>(`/api/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include' // Include cookies for authentication
      })

      if (response.success) {
        const successMsg = 'Testimonial deleted successfully!'
        successMessage.value = successMsg
        toast.success(successMsg)
        return true
      } else {
        const errorMsg = response.message || 'Failed to delete testimonial'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while deleting testimonial'
      error.value = errorMsg
      toast.error(errorMsg)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Clear messages
  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  // Reset loading state
  const resetLoading = () => {
    isLoading.value = false
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    successMessage: readonly(successMessage),
    testimonials: readonly(testimonials),

    // Actions
    createTestimonial,
    getTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    clearMessages,
    resetLoading,
  }
}
