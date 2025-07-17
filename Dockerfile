FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ts-node and typescript for migrations
RUN npm ci --legacy-peer-deps

# Copy compiled JavaScript files
COPY --from=builder /app/dist /app/dist
# Copy source files for migrations
COPY --from=builder /app/src /app/src
# Copy tsconfig files needed for ts-node
COPY --from=builder /app/tsconfig*.json ./

USER node

EXPOSE 3000

# Use shell form to allow command chaining
CMD npm run migration:run && npm run seed && node dist/main.js

# FROM node:18-alpine as builder

# WORKDIR /app

# COPY package*.json ./

# # Only install the dependencies needed for building
# RUN npm ci --only=production --legacy-peer-deps &&
#     npm install --save-dev typescript ts-node @types/node

# COPY . .

# RUN npm run build

# FROM node:18-alpine as production

# WORKDIR /app

# # Only copy production dependencies
# COPY package*.json ./
# RUN npm ci --only=production --legacy-peer-deps

# # Only copy what's necessary from the builder stage
# COPY --from=builder /app/dist /app/dist
# # If you absolutely need migrations, only copy those specific files
# COPY --from=builder /app/src/migrations /app/src/migrations
# COPY --from=builder /app/tsconfig.json ./

# USER node

# EXPOSE 3000

# CMD npm run migration:run && npm run seed && node dist/main.js
