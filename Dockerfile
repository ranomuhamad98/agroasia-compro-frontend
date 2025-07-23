FROM node:18-alpine

# Set workdir
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile --prefer-offline --reporter=append-only

# Salin seluruh file project
COPY . .

# Bangun project
RUN pnpm build

# Port dan startup
EXPOSE 3000
CMD ["pnpm", "preview", "--host", "--port", "3000"]
