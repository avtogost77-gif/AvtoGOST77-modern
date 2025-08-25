#!/bin/bash

# Скрипт для настройки HTTPS редиректа на сервере avtogost77.ru
# Выполняется на сервере

echo "🔒 Настройка HTTPS редиректа для avtogost77.ru..."

# Создаем конфигурацию nginx для HTTPS редиректа
cat > /etc/nginx/sites-available/avtogost77-https-redirect << 'EOF'
server {
    listen 80;
    server_name avtogost77.ru www.avtogost77.ru;
    
    # Редирект всех HTTP запросов на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name avtogost77.ru www.avtogost77.ru;
    
    # SSL конфигурация (замените на реальные пути к сертификатам)
    ssl_certificate /etc/letsencrypt/live/avtogost77.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avtogost77.ru/privkey.pem;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS заголовок
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Основная конфигурация сайта
    root /www/wwwroot/avtogost77.ru;
    index index.html index.htm;
    
    # Логи
    access_log /var/log/nginx/avtogost77_access.log;
    error_log /var/log/nginx/avtogost77_error.log;
    
    # Основные настройки
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Кеширование статических файлов
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Запрет доступа к скрытым файлам
    location ~ /\. {
        deny all;
    }
    
    # Запрет доступа к backup файлам
    location ~ \.(backup|bak|old|tmp)$ {
        deny all;
    }
}
EOF

echo "✅ Конфигурация nginx создана"

# Проверяем синтаксис конфигурации
if nginx -t; then
    echo "✅ Синтаксис nginx корректен"
    
    # Перезагружаем nginx
    systemctl reload nginx
    echo "✅ Nginx перезагружен"
    
    echo "🔒 HTTPS редирект настроен!"
    echo "📋 Проверьте работу редиректа:"
    echo "   curl -I http://avtogost77.ru/"
    echo "   curl -I https://avtogost77.ru/"
else
    echo "❌ Ошибка в конфигурации nginx"
    exit 1
fi
