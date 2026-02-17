# Dockerfile

# ==============================================================================
# Stage 1: Dependencies
# ==============================================================================
FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# ==============================================================================
# Stage 2: Development
# Used for local development with hot reload
# ==============================================================================
FROM node:24-alpine AS development

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Use nodemon for hot reload
CMD ["npm", "start"]

# ==============================================================================
# Stage 3: Builder
# Compiles TypeScript to JavaScript
# ==============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./

RUN npx prisma generate
RUN npm run build

# ==============================================================================
# Stage 4: Production
# Minimal production image
# ==============================================================================
FROM node:24-alpine AS production

RUN apk add --no-cache dumb-init openssl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

RUN npm ci --only=production && \
    npm cache clean --force

RUN npx prisma generate

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

RUN mkdir -p logs && chown -R nodejs:nodejs logs

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/server.js"]