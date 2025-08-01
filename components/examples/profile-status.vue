<template>
  <div class="profile-status p-4 border rounded-lg shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Profile Status</h3>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center space-x-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span class="text-sm text-gray-600">Loading profile...</span>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
      <p class="text-red-800 text-sm">
        <strong>Error:</strong> {{ error }}
      </p>
      <button 
        @click="fetchProfile"
        class="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
    
    <!-- Profile Data -->
    <div v-else-if="hasProfile && profile" class="space-y-3">
      <div class="bg-green-50 border border-green-200 rounded-md p-3">
        <p class="text-green-800 text-sm font-medium">Profile loaded successfully!</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span class="font-medium text-gray-700">ID:</span>
          <span class="ml-2 text-gray-900">{{ profile.id }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Email:</span>
          <span class="ml-2 text-gray-900">{{ profile.email }}</span>
        </div>
        <div v-if="profile.name">
          <span class="font-medium text-gray-700">Name:</span>
          <span class="ml-2 text-gray-900">{{ profile.name }}</span>
        </div>
        <div v-if="profile.role">
          <span class="font-medium text-gray-700">Role:</span>
          <span class="ml-2 text-gray-900 capitalize">{{ profile.role }}</span>
        </div>
        <div v-if="profile.phone">
          <span class="font-medium text-gray-700">Phone:</span>
          <span class="ml-2 text-gray-900">{{ profile.phone }}</span>
        </div>
        <div v-if="profile.created_at">
          <span class="font-medium text-gray-700">Joined:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(profile.created_at) }}</span>
        </div>
      </div>
      
      <div class="pt-3 border-t">
        <button 
          @click="refreshProfile"
          :disabled="isLoading"
          class="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Refresh Profile
        </button>
      </div>
    </div>
    
    <!-- No Profile State -->
    <div v-else class="text-center py-4">
      <p class="text-gray-600 text-sm mb-3">No profile data available</p>
      <button 
        @click="fetchProfile"
        :disabled="isLoading"
        class="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        Load Profile
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoading, error, profile, hasProfile, fetchProfile, refreshProfile } = useMyProfile();

// Format date helper
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Auto-fetch profile if not already loaded and user is authenticated
onMounted(() => {
  const { isAuthenticated } = useLoginApi();
  if (isAuthenticated.value && !hasProfile.value) {
    fetchProfile();
  }
});
</script> 