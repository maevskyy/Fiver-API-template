# Use the official Node.js image (you can choose a different version if needed)
FROM node:18.12

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json and pnpm-lock.yaml (or yarn.lock)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Install @nestjs/cli as a development dependency
RUN pnpm add @nestjs/cli --save-dev

# Copy the rest of the project files into the container
COPY . .

# Build the application for production
RUN pnpm run build

# Expose the port for the application
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "run", "start"]
