#!/bin/bash

# Скрипт для исправления всех проблем, обнаруженных Яндексом
# Включает исправление canonical, удаление проблемных файлов, настройку редиректов

echo "🔧 Исправление проблем, обнаруженных Яндексом..."

# 1. Исправляем canonical URL
echo "📋 Шаг 1: Исправление canonical URL..."
chmod +x fix-canonical-urls.sh
./fix-canonical-urls.sh

# 2. Удаляем проблемные файлы (без .html)
echo "🗑️ Шаг 2: Удаление проблемных файлов без .html..."

# Проверяем и удаляем файлы, которые вызывают проблемы
problem_files=(
    "gruzoperevozki-spb"
    "sbornye-gruzy"
    "moscow-spb-delivery.html"
)

for file in "${problem_files[@]}"; do
    if [ -f "$file" ]; then
        echo "❌ Удаляем проблемный файл: $file"
        rm "$file"
    fi
done

# 3. Создаем .htaccess для редиректов (если используется Apache)
echo "🔄 Шаг 3: Создание .htaccess для редиректов..."
cat > .htaccess << 'EOF'
# Редиректы для исправления проблем с canonical
RewriteEngine On

# Редирект с www на без www
RewriteCond %{HTTP_HOST} ^www\.avtogost77\.ru$ [NC]
RewriteRule ^(.*)$ https://avtogost77.ru/$1 [R=301,L]

# Редирект с HTTP на HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Редирект проблемных URL без .html на правильные
RewriteRule ^gruzoperevozki-spb$ /gruzoperevozki-spb.html [R=301,L]
RewriteRule ^sbornye-gruzy$ /sbornye-gruzy.html [R=301,L]

# Редирект moscow-spb-delivery.html на правильную страницу
RewriteRule ^moscow-spb-delivery\.html$ /gruzoperevozki-moskva-spb.html [R=301,L]

# Убираем trailing slash с главной страницы
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.+)/$
RewriteRule ^ %1 [R=301,L]

# Безопасность
<Files ".htaccess">
    Order allow,deny
    Deny from all
</Files>

# Кеширование
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Gzip сжатие
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

# 4. Создаем nginx конфигурацию для редиректов (если используется nginx)
echo "🔄 Шаг 4: Создание nginx конфигурации..."
cat > nginx-redirects.conf << 'EOF'
# Nginx конфигурация для редиректов
server {
    listen 80;
    server_name avtogost77.ru www.avtogost77.ru;
    
    # Редирект с www на без www
    if ($host = www.avtogost77.ru) {
        return 301 https://avtogost77.ru$request_uri;
    }
    
    # Редирект с HTTP на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name avtogost77.ru;
    
    # SSL конфигурация
    ssl_certificate /etc/letsencrypt/live/avtogost77.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avtogost77.ru/privkey.pem;
    
    # Редиректы для проблемных URL
    location = /gruzoperevozki-spb {
        return 301 https://avtogost77.ru/gruzoperevozki-spb.html;
    }
    
    location = /sbornye-gruzy {
        return 301 https://avtogost77.ru/sbornye-gruzy.html;
    }
    
    location = /moscow-spb-delivery.html {
        return 301 https://avtogost77.ru/gruzoperevozki-moskva-spb.html;
    }
    
    # Основная конфигурация
    root /www/wwwroot/avtogost77.ru;
    index index.html index.htm;
    
    # Кеширование статических файлов
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
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
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

# 5. Обновляем sitemap.xml (убираем проблемные URL)
echo "📋 Шаг 5: Обновление sitemap.xml..."
# Удаляем проблемные URL из sitemap
sed -i '/moscow-spb-delivery\.html/d' sitemap.xml

# 6. Создаем скрипт для деплоя исправлений
echo "📤 Шаг 6: Создание скрипта деплоя..."
cat > deploy-yandex-fixes.sh << 'EOF'
#!/bin/bash

echo "🚀 Деплой исправлений для Яндекс..."

# Загружаем исправленные файлы
scp -i ~/.ssh/id_ed25519 *.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 sitemap.xml root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 robots.txt root@193.160.208.183:/www/wwwroot/avtogost77.ru/

# Загружаем конфигурации (если нужно)
# scp -i ~/.ssh/id_ed25519 .htaccess root@193.160.208.183:/www/wwwroot/avtogost77.ru/
# scp -i ~/.ssh/id_ed25519 nginx-redirects.conf root@193.160.208.183:/etc/nginx/sites-available/

echo "✅ Исправления загружены на сервер"
echo "🔄 Перезапустите nginx: systemctl reload nginx"
EOF

chmod +x deploy-yandex-fixes.sh

echo ""
echo "✅ Все исправления подготовлены!"
echo ""
echo "📋 Что было исправлено:"
echo "   ✅ Canonical URL на всех страницах"
echo "   ✅ Удалены проблемные файлы без .html"
echo "   ✅ Созданы редиректы для проблемных URL"
echo "   ✅ Обновлен sitemap.xml"
echo "   ✅ Создан скрипт деплоя"
echo ""
echo "🚀 Для применения исправлений выполните:"
echo "   ./deploy-yandex-fixes.sh"
echo ""
echo "📊 После деплоя проверьте:"
echo "   - https://avtogost77.ru/gruzoperevozki-spb (должен редиректить на .html)"
echo "   - https://avtogost77.ru/sbornye-gruzy (должен редиректить на .html)"
echo "   - https://avtogost77.ru/moscow-spb-delivery.html (должен редиректить на gruzoperevozki-moskva-spb.html)"
