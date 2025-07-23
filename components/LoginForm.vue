<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md shadow-xl border-green-200 bg-white rounded-lg overflow-hidden">
      <div class="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <h1 class="text-2xl font-bold">Admin Login</h1>
        <p class="text-green-100 mt-1">Sign in to manage agroasiaberdikari.id content</p>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="username" class="text-green-700 font-medium block">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
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
          <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
          <button type="submit" class="btn-primary w-full">
            Sign In
          </button>
        </form>
        <div class="mt-4 text-sm text-green-600 text-center font-medium">
          Demo credentials: admin / admin123
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const adminStore = useAdminStore()

const form = ref({
  username: '',
  password: ''
})

const error = ref('')

const handleLogin = () => {
  const success = adminStore.login(form.value.username, form.value.password)
  if (!success) {
    error.value = 'Invalid username or password'
  } else {
    error.value = ''
  }
}
</script>