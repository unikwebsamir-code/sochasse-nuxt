FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Nuxt
RUN npm run build

# Rebuild better-sqlite3 for container architecture
RUN npm rebuild better-sqlite3

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]