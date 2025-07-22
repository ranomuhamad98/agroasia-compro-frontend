# Ganti ke image yang lebih kompatibel (glibc-based)
FROM node:18-slim

# Opsional: install curl dan hapus cache apt agar image tetap ringan
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set direktori kerja
WORKDIR /app

# Install pnpm global
RUN npm install -g pnpm

# Salin seluruh file project
COPY . .

# Install dependencies Nuxt
RUN pnpm install

ENV NODE_OPTIONS=--openssl-legacy-provider

# Build Nuxt app untuk production
RUN pnpm build

# Ekspose port (default: 3000)
EXPOSE 3000

# Jalankan Nuxt dengan host terbuka di port 3000
CMD ["pnpm", "preview", "--host"]
