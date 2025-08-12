import type { ContactUs, ContactUsResponse } from "@/types/contact-us-api-type";
import { toast } from "vue3-toastify";

export function useContactUsManagement() {
    const apiClient = useProxyApiClient();

    const contactUs = ref<ContactUs[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const successMessage = ref<string | null>(null);

    const getContactUs = async () => {
        try {
            isLoading.value = true;
            error.value = null;
            successMessage.value = null;

            const response = await apiClient.get<ContactUsResponse>('/contact')
            contactUs.value = response.data
        } catch (err: any) {
            error.value = err.statusMessage || err.message || 'Gagal mengambil data Contact Us';
            toast.error(error.value || 'Gagal mengambil data Contact Us');
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        contactUs,
        isLoading: readonly(isLoading),
        error: readonly(error),
        successMessage: readonly(successMessage),
        getContactUs,
    }
}   