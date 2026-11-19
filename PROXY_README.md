# API Proxy System dengan Session-Based Authentication

Sistem proxy ini memungkinkan aplikasi Nuxt untuk berkomunikasi dengan API external `https://agroasiaberdikari.id/api` dengan session-based authentication menggunakan cookies.

## 🚀 Fitur

- ✅ Proxy login dengan cookie forwarding otomatis
- ✅ Session-based authentication dengan cookie management
- ✅ Auto-forward cookies untuk semua endpoint yang memerlukan auth
- ✅ Catch-all proxy untuk endpoint admin dan public
- ✅ Error handling yang konsisten
- ✅ Auto-initialization auth state di client

## 📁 Struktur Files

```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts      # Proxy login endpoint
│   │   ├── logout.post.ts     # Proxy logout endpoint
│   │   └── me.get.ts          # Check auth status
│   ├── admin/
│   │   └── [...slug].ts       # Catch-all proxy untuk admin endpoints
│   └── public/
│       └── [...slug].ts       # Catch-all proxy untuk public endpoints
└── utils/
    └── apiProxy.ts            # Utility untuk proxy functions

composables/
└── useAuth.ts                 # Client-side auth composable

plugins/
└── auth.client.ts             # Auto-initialize auth state

components/admin/
└── LoginForm.vue              # Updated untuk menggunakan useAuth
```

## 🔧 Penggunaan

### 1. Login (Session-based dengan Cookies)

```bash
curl -X 'POST' \
  'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@domain.com",
    "password": "admin1234"
  }'
```

Cookies akan otomatis di-set dan diteruskan untuk request selanjutnya.

### 2. Check Authentication Status

```bash
curl -X 'GET' \
  'http://localhost:3000/api/auth/me' \
  -H 'Cookie: session=...' # Cookies dari login
```

### 3. Admin Endpoints (Memerlukan Auth)

```bash
# GET admin data
curl -X 'GET' \
  'http://localhost:3000/api/admin/users' \
  -H 'Cookie: session=...'

# POST admin data
curl -X 'POST' \
  'http://localhost:3000/api/admin/products' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session=...' \
  -d '{"name": "Product Name"}'
```

### 4. Public Endpoints (Tidak Perlu Auth)

```bash
curl -X 'GET' \
  'http://localhost:3000/api/public/products'
```

## 🎯 Client-side Usage

### Menggunakan useAuth Composable

```vue
<script setup>
const { user, isLoggedIn, login, logout, isLoading } = useAuth();

// Login
const handleLogin = async () => {
  try {
    await login({
      email: 'admin@domain.com',
      password: 'admin1234'
    });
    // User otomatis di-redirect ke /admin
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Logout
const handleLogout = async () => {
  await logout();
  // User otomatis di-redirect ke /login
};
</script>

<template>
  <div>
    <div v-if="isLoggedIn">
      Welcome, {{ user.email }}!
      <button @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <button @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </div>
  </div>
</template>
```

## 🔄 Alur Kerja Proxy

1. **Login Request**: Client → Nuxt API → External API
2. **Cookie Reception**: External API → Nuxt API → Client (cookies di-forward)
3. **Authenticated Requests**: Client (dengan cookies) → Nuxt API → External API (dengan cookies)
4. **Response**: External API → Nuxt API → Client

## 🛡️ Security Features

- Cookies otomatis di-forward antara client dan external API
- Authentication check pada semua admin endpoints
- Error handling yang konsisten
- Session management otomatis

## 📝 Catatan

- Sistem ini menggunakan session-based authentication dengan cookies
- Cookies secara otomatis di-manage oleh browser dan server
- Tidak perlu manual handle JWT tokens
- Auth state otomatis di-initialize saat aplikasi dimuat

## 🎨 Customization

Untuk menambah endpoint proxy baru:

1. **Endpoint dengan Auth**: Gunakan `/api/admin/[...slug].ts`
2. **Endpoint tanpa Auth**: Gunakan `/api/public/[...slug].ts`
3. **Custom Endpoint**: Buat file baru dan gunakan `proxyToExternalApi()` utility