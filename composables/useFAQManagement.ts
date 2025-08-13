import type { FAQ } from "@/types/faq-api-type"
import { toast } from "vue3-toastify";

export function useFAQManagement() {
    const apiClient = useProxyApiClient()

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    const createFAQ = async (faqData: FAQ) => {
        try {
            isLoading.value = true
            error.value = null
            successMessage.value = null

            const response = await apiClient.post<FAQ>('/faqs', {
                body: faqData,
            })

            return response
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal menambahkan FAQ';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    const updateFAQ = async (id: string, faqData: FAQ) => {
        try {
            isLoading.value = true
            error.value = null
            successMessage.value = null

            const response = await apiClient.put<FAQ>(`/faqs/${id}`, {
                body: faqData,
            })

            return response
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal mengupdate FAQ';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    const deleteFAQ = async (id: string) => {
        try {
            isLoading.value = true
            error.value = null
            successMessage.value = null

            const response = await apiClient.delete<FAQ>(`/faqs/${id}`)

            return response
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal menghapus FAQ';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    const clearMessages = () => {
        error.value = null;
        successMessage.value = null;
    }

    const resetLoading = () => {
        isLoading.value = false;
    }

    return {
        isLoading,
        error,
        successMessage,
        createFAQ,
        updateFAQ,
        deleteFAQ,
        clearMessages,
        resetLoading,
    }
}