FROM oven/bun:latest AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

FROM base AS dev

EXPOSE 5173
CMD ["bun", "--bun", "run", "dev", "--host"]

FROM base AS builder

RUN bun --bun run build

FROM oven/bun:latest AS prod

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/build ./build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "./build/index.js"]
