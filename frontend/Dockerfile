# Use a Node.js base image
FROM node:16.4.0-alpine
# Set the working directory in the container
WORKDIR /app

ENV NEXT_PUBLIC_BACKEND_URL=http://businessgames-b.eu-west-1.elasticbeanstalk.com
ENV NEXT_PUBLIC_SOCKET_URL=http://businessgames-s.eu-west-1.elasticbeanstalk.com

# Copy package.json and other files with deps to the container
COPY package*.json ./
COPY yarn.lock ./
# Install dependencies
RUN npm install && npm cache clean --force
# Copy the rest of the backend code to the container
COPY ./.next ./.next
COPY ./public ./public

# Expose port 3000
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]