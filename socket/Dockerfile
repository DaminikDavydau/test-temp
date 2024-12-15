# Use a Node.js base image
FROM node:16.4.0-alpine
# Set the working directory in the container
WORKDIR /app

ENV CLIENT_URL=http://businessgames.eu-west-1.elasticbeanstalk.com

# Copy package.json and other files with deps to the container
COPY package*.json ./
COPY yarn.lock ./
# Install dependencies
RUN npm cache clean --force
RUN npm install && npm cache clean --force
# Copy the rest of the backend code to the container
COPY ./dist ./dist

# Expose port 8000
EXPOSE 8000

# Command to start the application
ENTRYPOINT [ "node", "dist/server.js" ]