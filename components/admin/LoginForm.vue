<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md shadow-xl border-green-200 bg-white rounded-lg overflow-hidden">
      <div class="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <h1 class="text-2xl font-bold">Admin Login</h1>
        <p class="text-green-100 mt-1">Sign in to manage agroasiaberdikari.id content</p>
      </div>
      <div class="p-6">
        <form @submit.prevent="loginUser" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="text-green-700 font-medium block">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input-field"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="text-green-700 font-medium block">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="input-field"
              required
            />
          </div>
          <div v-if="loginError" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            {{ loginError }}
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="isLoading">
            <span v-if="isLoading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        <div class="mt-4 text-sm text-green-600 text-center font-medium">
          Use your registered email and password to sign in
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  email: '',
  password: ''
})
const { login, isLoading, error: loginError } = useLoginApi();

// Login
const loginUser = async () => {
  if (form.value.email && form.value.password) {
    const result = await login({
      email: form.value.email,
      password: form.value.password
    });
    
    if (result) {
      console.log('Admin login successful!', result);
      // Clear form on success
      form.value.email = '';
      form.value.password = '';
    }
    // Error is handled automatically by the login composable
  }
};


</script>