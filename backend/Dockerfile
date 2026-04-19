FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
EXPOSE 8001
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache docker-cli
RUN addgroup -S shipstack && adduser -S shipstack -G shipstack
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev 
COPY --from=builder /app/dist ./dist
RUN chown -R shipstack:shipstack /app
USER shipstack
EXPOSE 8000
EXPOSE 8001
CMD ["node", "dist/server.js"]