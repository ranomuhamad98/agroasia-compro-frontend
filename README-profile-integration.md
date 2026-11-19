# Profile API Integration

This document explains how to use the `/auth/me` API endpoint integration in the Shofi Grocery project.

## Files Created/Modified

### New Files
- `types/profile-api-type.ts` - TypeScript interfaces for profile API
- `composables/useMyProfile.ts` - Composable for profile management
- `components/examples/profile-status.vue` - Example component demonstrating usage

## API Endpoint
- **URL**: `https://agroasiaberdikari.id/api/auth/me`
- **Method**: GET
- **Authentication**: Bearer Token (from login)

## Usage

### Basic Usage in Components

```vue
<script setup lang="ts">
const { 
  isLoading, 
  error, 
  profile, 
  hasProfile, 
  fetchProfile, 
  refreshProfile 
} = useMyProfile();

// Fetch profile data
await fetchProfile();
</script>
```

### Available Properties

#### State
- `isLoading`: Boolean indicating if a request is in progress
- `error`: String containing error message if request fails
- `profile`: User profile object (null if not loaded)
- `hasProfile`: Computed boolean indicating if profile is available

#### Methods
- `fetchProfile()`: Fetch profile from API
- `refreshProfile()`: Alias for fetchProfile() 
- `initializeProfile()`: Load profile from stored cookie

### Profile Object Structure

```typescript
interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Example Implementation

```vue
<template>
  <div v-if="isLoading">Loading profile...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else-if="hasProfile">
    <h2>{{ profile.name || profile.email }}</h2>
    <p>Role: {{ profile.role }}</p>
    <button @click="refreshProfile">Refresh</button>
  </div>
  <div v-else>
    <button @click="fetchProfile">Load Profile</button>
  </div>
</template>

<script setup lang="ts">
const { isLoading, error, profile, hasProfile, fetchProfile, refreshProfile } = useMyProfile();
</script>
```

## Features

### Automatic Token Handling
- Automatically uses stored authentication token
- Handles token missing scenarios gracefully

### Cookie Integration
- Updates user cookie with fresh profile data
- Initializes from existing cookie on page load
- Syncs with login system

### Error Handling
- Comprehensive error handling with user-friendly messages
- Automatic retry capabilities
- Graceful fallbacks

### State Management
- Reactive state updates
- Loading states for better UX
- Computed properties for convenience

## Integration with Authentication

The profile composable works seamlessly with the existing `useLoginApi` composable:

```vue
<script setup lang="ts">
const { isAuthenticated } = useLoginApi();
const { fetchProfile, hasProfile } = useMyProfile();

// Auto-fetch profile after login
watch(isAuthenticated, (newValue) => {
  if (newValue && !hasProfile.value) {
    fetchProfile();
  }
});
</script>
```

## Demo Component

See `components/examples/profile-status.vue` for a complete working example that demonstrates all features of the profile API integration. 