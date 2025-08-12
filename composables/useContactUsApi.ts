import type { ContactUsPayload, ContactUsResponse } from '@/types/contact-us-api-type';
import { toast } from 'vue3-toastify';

export function useContactUsApi() {
    const apiClient = useApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const sendMessage = async (payload: ContactUsPayload): Promise<ContactUsResponse> => {
        try {
            isLoading.value = true;
            error.value = null;

            const response = await apiClient.post<ContactUsResponse>('/contact-us', {
                body: payload,
            });

            if (response.status === 201) {
                toast.success('Message sent successfully');
            } else {
                toast.error(response.message);
            }
            return response;
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Failed to send message';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return { sendMessage, error, isLoading };
}