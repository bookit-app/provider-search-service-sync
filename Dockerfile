# Use the official lightweight Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:10-slim

# Create and change to the app directory.
WORKDIR /usr/app

# Copy root level dependencies details
COPY package*.json ./

# Install root level production dependencies.
RUN npm install --only=production

# Copy shared code to the image
COPY src/ ./src

# Run the web service on container startup.
CMD [ "npm", "start" ]