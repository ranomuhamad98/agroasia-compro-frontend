<template>
  <div class="auth-status">
    <div v-if="isAuthenticated" class="user-info">
      <span>Welcome, {{ user?.email }}</span>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
    <div v-else class="guest-info">
      <nuxt-link to="/login" class="login-link">Login</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout } = useLoginApi();

const handleLogout = () => {
  logout();
  // Optionally redirect to home page
  navigateTo('/');
};
</script>

<style scoped>
.auth-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  padding: 0.25rem 0.75rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c82333;
}

.login-link {
  padding: 0.25rem 0.75rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.login-link:hover {
  background: #0056b3;
}
</style> 