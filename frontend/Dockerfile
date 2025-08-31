# Стадия сборки
FROM node:18-alpine as build

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Стадия production
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=build /app/build /var/www/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]