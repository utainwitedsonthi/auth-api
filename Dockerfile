FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY prisma prisma

RUN bun install
RUN bun add -D prisma

COPY . .
RUN bunx prisma generate


CMD bun index.ts
