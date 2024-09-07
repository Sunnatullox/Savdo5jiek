# Use the official Node.js image as the base image
FROM node:alpine

# Set working directory
WORKDIR /src

# Copy package.json and yarn.lock and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Generate Prisma client
RUN npx prisma generate && npx prisma db push

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
