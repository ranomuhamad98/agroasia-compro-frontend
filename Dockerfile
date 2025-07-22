FROM node:18

WORKDIR /app

RUN npm install -g pnpm

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

# Bersihkan cache pnpm
RUN pnpm store prune

# Install dependencies dan rebuild native modules
RUN pnpm install --force && pnpm rebuild

# Build project
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "preview", "--host", "--port", "3000"]