# Gunakan base image node
FROM node:18-alpine

# Set direktori kerja
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Salin file project
COPY . .

# Install dependencies
RUN pnpm install

# Build Nuxt 3
RUN pnpm build

# Jalankan Nuxt
CMD ["pnpm", "preview", "--host"]
