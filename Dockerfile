# Use official Node.js image.
FROM node:14

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install app dependencies.
RUN npm install

# Copy the remaining application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 8080

# Run the application.
CMD [ "node", "server.js" ]
