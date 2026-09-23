# Multi-Stage Production Dockerfile for Feedants Full-Stack Application

# --- Stage 1: Build Frontend Web Bundle ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN npx expo export --platform web

# --- Stage 2: Production Server & Unified Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --only=production

# Copy backend source
COPY backend/ /app/backend/

# Copy compiled frontend dist from Stage 1 into /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 5000

CMD ["node", "server.js"]
