# Claw Control Frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
RUN npm ci
COPY . .
RUN npm run build --workspace=@claw-control/frontend

# Production - use http-server (simpler than serve)
FROM node:22-alpine
RUN npm install -g http-server
COPY --from=builder /app/packages/frontend/dist /app
WORKDIR /app
CMD ["sh", "-c", "http-server -p $PORT -c-1 --spa"]
