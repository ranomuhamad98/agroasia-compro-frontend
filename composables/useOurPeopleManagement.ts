import { toast } from 'vue3-toastify';
import type { 
  OurPeoplePayload, 
  OurPeopleData, 
  CreateOurPeopleReturn 
} from '@/types/about-api-type';

export function useOurPeopleManagement() {
  const apiClient = useApiClient();
  
  // Reactive state for loading and error handling
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Our People list state
  const ourPeopleList = ref<OurPeopleData[]>([]);
  const selectedPerson = ref<OurPeopleData | null>(null);

  // Create new Our People entry
  const createOurPeople = async (payload: OurPeoplePayload): Promise<CreateOurPeopleReturn> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await $fetch('/api/about/ourpeople', {
        method: 'POST',
        body: payload,
      });
      
      // Add to local list if successful
      if (response.data) {
        ourPeopleList.value.push(response.data);
      }
      
      toast.success('Our People berhasil ditambahkan');
      return response as CreateOurPeopleReturn;
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal menambahkan Our People';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get all Our People
  const fetchOurPeople = async (): Promise<OurPeopleData[]> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await $fetch<{ data: OurPeopleData[] }>('/api/about/ourpeople');
      
      if (response.data) {
        ourPeopleList.value = response.data;
        return response.data;
      }
      
      return [];
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal mengambil data Our People';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get single Our People by ID
  const fetchOurPeopleById = async (id: string): Promise<OurPeopleData | null> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await $fetch<{ data: OurPeopleData }>(`/api/about/ourpeople/${id}`);
      
      if (response.data) {
        selectedPerson.value = response.data;
        return response.data;
      }
      
      return null;
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal mengambil data petani';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update Our People
  const updateOurPeople = async (id: string, payload: Partial<OurPeoplePayload>): Promise<OurPeopleData> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await $fetch(`/api/about/ourpeople/${id}`, {
        method: 'PUT',
        body: payload,
      });
      
      if (response.data) {
        // Update in local list
        const index = ourPeopleList.value.findIndex(person => person.id === id);
        if (index !== -1) {
          ourPeopleList.value[index] = response.data;
        }
        
        // Update selected person if it's the same
        if (selectedPerson.value?.id === id) {
          selectedPerson.value = response.data;
        }
      }
      
      toast.success('Data our people berhasil diperbarui');
      return response.data;
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal memperbarui data petani';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete Our People
  const deleteOurPeople = async (id: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await $fetch(`/api/about/ourpeople/${id}`, {
        method: 'DELETE',
      });
      
      // Remove from local list
      ourPeopleList.value = ourPeopleList.value.filter(person => person.id !== id);
      
      // Clear selected person if it's the same
      if (selectedPerson.value?.id === id) {
        selectedPerson.value = null;
      }
      
      toast.success('Our People berhasil dihapus');
      
    } catch (err: any) {
      const errorMessage = err.statusMessage || err.message || 'Gagal menghapus petani';
      error.value = errorMessage;
      toast.error(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Toggle status
  const toggleStatus = async (id: string, currentStatus: boolean): Promise<void> => {
    try {
      await updateOurPeople(id, { status: !currentStatus });
    } catch (error) {
      // Error handling is done in updateOurPeople
      throw error;
    }
  };

  // Search and filter functions
  const searchOurPeople = (query: string): OurPeopleData[] => {
    if (!query.trim()) return ourPeopleList.value;
    
    const lowercaseQuery = query.toLowerCase();
    return ourPeopleList.value.filter(person => 
      person.name.toLowerCase().includes(lowercaseQuery) ||
      person.title.toLowerCase().includes(lowercaseQuery) ||
      person.lokasi.toLowerCase().includes(lowercaseQuery) ||
      person.keterangan.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterByStatus = (status: boolean): OurPeopleData[] => {
    return ourPeopleList.value.filter(person => person.status === status);
  };

  const filterByLocation = (location: string): OurPeopleData[] => {
    if (!location.trim()) return ourPeopleList.value;
    
    const lowercaseLocation = location.toLowerCase();
    return ourPeopleList.value.filter(person => 
      person.lokasi.toLowerCase().includes(lowercaseLocation)
    );
  };

  // Computed properties
  const activePeople = computed(() => filterByStatus(true));
  const inactivePeople = computed(() => filterByStatus(false));
  const totalCount = computed(() => ourPeopleList.value.length);
  const activeCount = computed(() => activePeople.value.length);

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Reset state
  const resetState = () => {
    ourPeopleList.value = [];
    selectedPerson.value = null;
    error.value = null;
    isLoading.value = false;
  };

  return {
    // State
    ourPeopleList: readonly(ourPeopleList),
    selectedPerson: readonly(selectedPerson),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    activePeople: readonly(activePeople),
    inactivePeople: readonly(inactivePeople),
    totalCount: readonly(totalCount),
    activeCount: readonly(activeCount),
    
    // CRUD Operations
    createOurPeople,
    fetchOurPeople,
    fetchOurPeopleById,
    updateOurPeople,
    deleteOurPeople,
    
    // Utility Operations
    toggleStatus,
    searchOurPeople,
    filterByStatus,
    filterByLocation,
    
    // State Management
    clearError,
    resetState,
  };
}
