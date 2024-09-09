# Use a Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Add the Babel plugin
RUN yarn add @babel/plugin-proposal-private-property-in-object --dev

# Copy the rest of the application code
COPY . .

# Expose the port your frontend will run on
EXPOSE 3000

# Start the frontend application
CMD ["yarn", "start"]
