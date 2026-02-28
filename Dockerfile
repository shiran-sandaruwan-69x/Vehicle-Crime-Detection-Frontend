# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN yarn build

# Expose the port the application runs on
EXPOSE 3000

# Define the command to run the application
CMD ["yarn", "start"]

#Get Latest
LABEL com.docker.version="latest"