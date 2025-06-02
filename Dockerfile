# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src ./src
COPY firebase-service-account.json ./

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/firebase-service-account.json ./

# Install production dependencies only
RUN npm install --only=production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]