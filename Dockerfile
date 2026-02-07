# Use an official Node.js runtime as a parent image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build


# Use a smaller image to serve the application
FROM serve:latest

# Copy the build folder from the previous stage
COPY --from=build /app/build /dist

# Expose port 8080
EXPOSE 8080

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "8080"]