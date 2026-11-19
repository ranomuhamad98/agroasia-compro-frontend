import type { Milestone, MilestoneListResponse, MilestonePayload } from "@/types/milestone-api-type";
import { toast } from "vue3-toastify";

export function useMilestoneManagement() {
    const apiClient = useProxyApiClient();

    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const milestones = ref<Milestone[]>([]);

    const getMilestones = async (active_only: boolean = false): Promise<MilestoneListResponse> => {
        const response = await apiClient.get<MilestoneListResponse>(`/about/milestone?active_only=${active_only}`);
        milestones.value = response.milestones;
        return response;
    }

    const createMilestone = async (payload: MilestonePayload): Promise<Milestone | null> => {
        try {
            isLoading.value = true;
            error.value = null;

            const response = await apiClient.post<Milestone>('/about/milestone', {
                body: payload,
            });

            return response;
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal menambahkan Milestone';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    const updateMilestone = async (id: string, payload: MilestonePayload): Promise<Milestone | null> => {
        try {
            isLoading.value = true;
            error.value = null;

            const response = await apiClient.put<Milestone>(`/about/milestone/${id}`, {
                body: payload,
            });

            return response;
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal mengupdate Milestone';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    const deleteMilestone = async (id: string): Promise<void> => {
        try {
            isLoading.value = true;
            error.value = null;

            await apiClient.delete<Milestone>(`/about/milestone/${id}`);
        } catch (err: any) {
            const errorMessage = err.statusMessage || err.message || 'Gagal menghapus Milestone';
            error.value = errorMessage;
            toast.error(errorMessage);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        successMessage: readonly(successMessage),
        milestones: readonly(milestones),
        getMilestones,
        createMilestone,
        updateMilestone,
        deleteMilestone,
    }
}