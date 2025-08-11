<template>
  <div class="our-people-admin">
    <p>{{ JSON.stringify(ourPeopleList) }}</p>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Manajemen Petani Kami</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-700">Total Petani</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalCount }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-700">Petani Aktif</h3>
          <p class="text-3xl font-bold text-green-600">{{ activeCount }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-700">Status</h3>
          <p class="text-sm text-gray-600">{{ isLoading ? 'Loading...' : 'Ready' }}</p>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari petani..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="currentFilter = 'all'"
              :class="[
                'px-4 py-2 rounded-md',
                currentFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Semua
            </button>
            <button
              @click="currentFilter = 'active'"
              :class="[
                'px-4 py-2 rounded-md',
                currentFilter === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Aktif
            </button>
            <button
              @click="currentFilter = 'inactive'"
              :class="[
                'px-4 py-2 rounded-md',
                currentFilter === 'inactive' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Tidak Aktif
            </button>
          </div>
        </div>
      </div>

      <!-- Our People List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Daftar Petani</h2>
            <button
              @click="showForm = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tambah Petani
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="text-red-600 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="fetchOurPeople"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Petani
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengalaman
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="person in filteredPeople" :key="person.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img 
                        :src="person.image_link" 
                        :alt="person.name"
                        class="h-10 w-10 rounded-full object-cover"
                        @error="(event) => { const target = event.target as HTMLImageElement; if (target) target.src = '/images/users/user-1.jpg'; }"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ person.name }}</div>
                      <div class="text-sm text-gray-500">{{ person.title }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ person.lokasi }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Bertani: {{ person.bertani_sejak }}</div>
                  <div>Bermitra: {{ person.bermitra_sejak }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      person.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ person.status ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="togglePersonStatus(person)"
                      :class="[
                        'px-3 py-1 rounded-md text-xs',
                        person.status 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      ]"
                    >
                      {{ person.status ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>
                    <button
                      @click="editPerson(person)"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="deletePerson(person)"
                      class="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && !error && filteredPeople.length === 0" class="p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <p class="text-gray-600">Belum ada data petani</p>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">{{ editingPerson ? 'Edit Petani' : 'Tambah Petani Baru' }}</h2>
            <button
              @click="closeForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <OurPeopleForm @success="onFormSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OurPeopleData } from '@/types/about-api-type';

const {
  ourPeopleList,
  isLoading,
  error,
  totalCount,
  activeCount,
  fetchOurPeople,
  updateOurPeople,
  deleteOurPeople,
  toggleStatus,
  searchOurPeople,
  filterByStatus,
  clearError,
} = useOurPeopleManagement();

// Local state
const showForm = ref(false);
const editingPerson = ref<OurPeopleData | null>(null);
const searchQuery = ref('');
const currentFilter = ref<'all' | 'active' | 'inactive'>('all');

// Computed
const filteredPeople = computed(() => {
  let filtered = ourPeopleList.value;
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    filtered = searchOurPeople(searchQuery.value);
  }
  
  // Apply status filter
  if (currentFilter.value === 'active') {
    filtered = filterByStatus(true);
  } else if (currentFilter.value === 'inactive') {
    filtered = filterByStatus(false);
  }
  
  return filtered;
});

// Methods
const togglePersonStatus = async (person: OurPeopleData) => {
  try {
    await toggleStatus(person.id, person.status);
  } catch (error) {
    console.error('Error toggling status:', error);
  }
};

const editPerson = (person: OurPeopleData) => {
  editingPerson.value = person;
  showForm.value = true;
};

const deletePerson = async (person: OurPeopleData) => {
  if (confirm(`Apakah Anda yakin ingin menghapus ${person.name}?`)) {
    try {
      await deleteOurPeople(person.id);
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  }
};

const closeForm = () => {
  showForm.value = false;
  editingPerson.value = null;
  clearError();
};

const onFormSuccess = () => {
  closeForm();
  // Optionally refresh the list
  fetchOurPeople();
};

// Fetch data on mount
onMounted(() => {
  fetchOurPeople();
});
</script>

<style scoped>
.our-people-admin {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
