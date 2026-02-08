# Stage 1: Build the application
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application
FROM serve:latest

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist .

# Expose port 8080 for the application
EXPOSE 8080

# Command to serve the application
CMD ["serve", "-s", ".", "-l", "8080"]