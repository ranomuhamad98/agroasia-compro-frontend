import type { 
  Testimonial, 
  CreateTestimonialRequest, 
  CreateTestimonialResponse,
  TestimonialListResponse 
} from '@/types/testimonial-api-type'
import { toast } from 'vue3-toastify'

export function useTestimonialManagement() {
  const apiClient = useProxyApiClient()
  const testimonials = ref<Testimonial[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const createTestimonial = async (testimonialData: CreateTestimonialRequest): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

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

      const response = await apiClient.post<CreateTestimonialResponse>('/testimonials', {
        body: testimonialData,
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

  const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get<CreateTestimonialResponse>(`/testimonials/${id}`);

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

  const updateTestimonial = async (id: string, testimonialData: Partial<CreateTestimonialRequest>): Promise<Testimonial | null> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

      const response = await apiClient.put<CreateTestimonialResponse>(`/testimonials/${id}`, {
        body: testimonialData,
      });

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

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      successMessage.value = null

      const response = await apiClient.delete<{ success: boolean; message: string }>(`/testimonials/${id}`);

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

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  const resetLoading = () => {
    isLoading.value = false
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    successMessage: readonly(successMessage),
    testimonials: readonly(testimonials),

    createTestimonial,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    clearMessages,
    resetLoading,
  }
}
