import type { Section, SectionPayload } from "@/types/sections-api-types";
import { toast } from "vue3-toastify";

export function useSectionManagement() {
    const apiClient = useProxyApiClient()

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    const updateSection = async (id: string, sectionData: SectionPayload) => {
        try {
            isLoading.value = true
            error.value = null
            successMessage.value = null

            const response = await apiClient.put<Section>(`/sections/${id}`, {
                body: sectionData,
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
        updateSection,
        clearMessages,
        resetLoading,
    }
}