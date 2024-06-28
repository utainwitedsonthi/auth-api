# Use the node base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install dependencies using Bun
RUN npm install
RUN npm install ts-node
RUN npm install -D prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma migrate to apply schema changes
RUN npx prisma migrate dev --name init

# Command to start your application
CMD ["ts-node", "index.ts"]
