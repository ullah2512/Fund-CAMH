# Stage 1: Build the application
FROM node:20 AS build

WORKDIR /app

# Accept Gemini API key at build time (Vite inlines it during compile)
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from the build stage
COPY --from=build /app/dist .

# Expose port 8080 for the application
EXPOSE 8080

# Command to serve the application
CMD ["serve", "-s", ".", "-l", "8080"]