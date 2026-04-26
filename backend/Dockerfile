# ============================================================
#  ShipStack – Backend Dockerfile (Debian-slim, WSL2 optimized)
# ============================================================

# ──────────────────────────────────────────────────────────
#  Stage 1: BUILDER
#  node:20-slim is Debian-based — build-essential is faster
#  to install than Alpine's gcc/g++/make/python3 stack
# ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# build-essential = gcc + g++ + make (all in one, cached by apt)
# python3 needed by node-gyp for better-sqlite3
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN test -f dist/server.js || \
    (echo "FATAL: dist/server.js not found." && exit 1)


# ──────────────────────────────────────────────────────────
#  Stage 2: PRODUCTION
# ──────────────────────────────────────────────────────────
FROM node:20-slim AS production

WORKDIR /app

# docker-cli for Debian
RUN apt-get update && \
    apt-get install -y --no-install-recommends docker.io && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r shipstack && useradd -r -g shipstack shipstack

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p /app/storage /app/deployments && \
    chown -R shipstack:shipstack /app

USER shipstack

EXPOSE 5000

CMD ["node", "dist/server.js"]


# ──────────────────────────────────────────────────────────
#  Stage 3: DEVELOPMENT (compose only)
# ──────────────────────────────────────────────────────────
FROM builder AS development

RUN mkdir -p storage deployments

EXPOSE 5000

CMD ["npm", "run", "dev"]