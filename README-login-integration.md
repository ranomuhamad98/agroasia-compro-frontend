# Login API Integration - Dashboard

## 🔗 API Endpoint
```
POST https://agroasiaberdikari.id/api/auth/login
```

## ✅ Integration Status
✅ **Dashboard.vue** - Fully integrated with real login API  
✅ **LoginForm.vue** - Updated to use email/password with API  
✅ **Authentication State** - Persistent login with cookies  
✅ **Route Protection** - Auto redirect on login/logout  

## 🚀 How It Works

### 1. **Login Process**
- User enters email and password in the admin login form
- Form sends POST request to the API endpoint
- On success: User data and token are stored in cookies
- Dashboard automatically shows admin panel

### 2. **Authentication State**
- `isAuthenticated` - Reactive boolean for login status
- `user` - User object with email, name, role, etc.
- `token` - JWT token for API requests
- Automatically restored from cookies on page refresh

### 3. **Logout Process**
- Clears authentication cookies
- Redirects to login page
- Resets admin store state

## 📋 Usage Examples

### In Components:
```vue
<script setup>
const { isAuthenticated, user, login, logout } = useLoginApi();

// Check if user is logged in
if (isAuthenticated.value) {
  console.log('User email:', user.value.email);
}
</script>
```

### Protected Routes:
```vue
<!-- Add to any page that needs authentication -->
<script setup>
definePageMeta({
  middleware: 'auth'
});
</script>
```

## 🔧 Files Modified

1. **`pages/dashboard.vue`**
   - Uses `useLoginApi()` for authentication check
   - Updated logout button to use API logout
   - Shows user email in header

2. **`components/admin/LoginForm.vue`**
   - Changed from username to email field
   - Integrated with real login API
   - Shows loading states and error messages

3. **`composables/useLoginApi.ts`**
   - Complete login API integration
   - Cookie-based session persistence
   - Error handling and state management

4. **`middleware/auth.ts`**
   - Route protection middleware
   - Auto redirect to login if not authenticated

## 🎯 Expected API Response

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "expires_at": "2024-01-01T00:00:00Z"
  }
}
```

## 🔐 Security Features

- ✅ JWT token storage in secure cookies
- ✅ Automatic token refresh on page reload
- ✅ Protected route middleware
- ✅ Secure cookie settings (httpOnly, sameSite)
- ✅ Auto logout on token expiration

---

**✨ Integration Complete!** The dashboard now uses the real login API instead of mock authentication. 