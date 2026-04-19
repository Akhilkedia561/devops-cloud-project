# ============================================================
#  ShipStack — Frontend Dockerfile
#  frontend/Dockerfile
#
#  REQUIRES: frontend/.dockerignore exists with node_modules
#  and .next listed inside it. Without .dockerignore, COPY . .
#  pastes Windows/Mac binaries into the image and breaks it.
# ============================================================

FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

# npm install runs INSIDE Alpine Linux container.
# Installs musl-compatible binaries (lightningcss-linux-x64-musl etc).
# .dockerignore ensures local node_modules are never copied over these.
RUN npm install

# Copy source. node_modules and .next are excluded by .dockerignore.
COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]


# ──────────────────────────────
#  Production (use later)
# ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -S shipstack && adduser -S shipstack -G shipstack

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN chown -R shipstack:shipstack /app
USER shipstack

EXPOSE 3000

CMD ["npm", "run", "start"]
