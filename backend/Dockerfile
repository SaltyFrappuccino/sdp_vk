# Этап 1: Сборка приложения
FROM node:18 AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y python3 make g++

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Этап 2: Создание production-образа
FROM node:18

WORKDIR /app

# Копируем только необходимые файлы из builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Устанавливаем только production-зависимости
# RUN npm install --omit=dev

# Открываем порт, на котором работает приложение
EXPOSE 3000

# Команда для запуска приложения
CMD [ "node", "dist/index.js" ]