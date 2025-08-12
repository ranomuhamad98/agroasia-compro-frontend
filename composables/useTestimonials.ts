import type { Testimonial, TestimonialListResponse } from "@/types/testimonial-api-type";
import { toast } from "vue3-toastify";

export function useTestimonials() {
  const apiClient = useApiClient();
  const testimonials = ref<Testimonial[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pending = ref(false)

  const getTestimonials = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      pending.value = true;
      const response = await apiClient.get<TestimonialListResponse>('/testimonials');

      if (response.status === 200) {
        testimonials.value = response.testimonials;
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while fetching testimonials'
      error.value = errorMsg
      toast.error(errorMsg)
      throw err
    } finally {
      isLoading.value = false
      pending.value = false
    }
  }
  
  const testimonialsData = computed(() => testimonials.value)

  return {
    testimonials: readonly(testimonialsData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    pending: readonly(pending),
    getTestimonials,
  }
}