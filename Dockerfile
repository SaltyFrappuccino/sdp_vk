# Этап 1: Сборка фронтенда
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Этап 2: Сборка бэкенда
FROM node:18 AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN apt-get update && apt-get install -y python3 make g++
RUN npm install
COPY backend/ .
RUN npm run build

# Этап 3: Финальный образ
FROM node:18
WORKDIR /app
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./frontend

EXPOSE 3000
CMD [ "node", "dist/index.js" ]