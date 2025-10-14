# Базовый образ
FROM node:20-alpine

# Рабочая директория
WORKDIR /bot

# Копируем package.json и lock
COPY ./app ./

# Устанавливаем зависимости
RUN npm ci --omit=dev

# Собираем TypeScript
RUN npm run build:local

# Открываем порт (если нужен для webhook)
EXPOSE 3000

# Запуск
CMD ["node", "dist/app.js"]

