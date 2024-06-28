# Use the Bun base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb to the working directory
COPY package.json .
COPY bun.lockb .

# Install dependencies using Bun
RUN bun install
RUN bun add -D prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN bun prisma generate

# Run Prisma migrate to apply schema changes
RUN bun prisma migrate dev --name init

# Command to start your application
CMD ["bun", "index.ts"]
