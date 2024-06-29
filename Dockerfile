FROM oven/bun:latest as build

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY prisma prisma

RUN bun install

COPY . .

CMD bun index.ts