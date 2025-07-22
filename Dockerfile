FROM node:18

WORKDIR /app

RUN npm install -g pnpm

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN pnpm install --no-frozen-lockfile && pnpm rebuild

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "preview", "--host", "--port", "3000"]
