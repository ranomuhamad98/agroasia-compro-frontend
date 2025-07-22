FROM node:18

WORKDIR /app

RUN npm install -g pnpm

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048 --openssl-legacy-provider"

RUN pnpm install --frozen-lockfile && pnpm rebuild

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "preview", "--host", "--port", "3000"]
