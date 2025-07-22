FROM node:18

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# Set environment variable to use legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install dependencies
RUN pnpm install

# Build project
RUN pnpm build

# Expose port sesuai layanan
EXPOSE 3000

CMD ["pnpm", "preview", "--host", "--port", "3000"]
