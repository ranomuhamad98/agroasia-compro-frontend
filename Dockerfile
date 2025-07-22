# Gunakan image Node.js berbasis Alpine (ringan)
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Install pnpm secara global
RUN npm install -g pnpm

# Salin semua file project ke dalam container
COPY . .

# Install dependencies
RUN pnpm install

# Build Nuxt app
RUN pnpm build

# Ekspose port 
EXPOSE 3000

# Jalankan Nuxt di mode preview (production)
CMD ["pnpm", "preview", "--host"]
