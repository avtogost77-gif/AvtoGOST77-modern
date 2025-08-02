# 🚀 ДЕПЛОЙ НАШЕГО КРАСИВОГО САЙТА

## 📋 **ПЛАН ДЕПЛОЯ:**

1. **🗑️ Очистить** старое говно Next.js
2. **📤 Залить** наши оптимизированные файлы
3. **🔧 Настроить** nginx на статику
4. **✅ Проверить** что всё работает

---

## 🚫 **STEP 1: УБИВАЕМ NEXT.JS НАХРЕН**

```bash
# Убиваем все процессы Next.js
sudo kill -9 211411 2>/dev/null || echo "Process already dead"
sudo fuser -k 3000/tcp 2>/dev/null || echo "Port 3000 is free"
sudo pkill -f "next-server" 2>/dev/null || echo "No next-server processes"

# Удаляем Next.js проекты
rm -rf /www/wwwroot/avtogost77.ru/avtogost-site/
rm -rf /www/wwwroot/default/avtogost-site/ 2>/dev/null || echo "Already removed"

# Проверяем что убили
netstat -tulpn | grep :3000 || echo "✅ Port 3000 is free!"
ps aux | grep next | grep -v grep || echo "✅ No Next.js processes!"
```

---

## 📤 **STEP 2: ЗАЛИВАЕМ НАШИ ФАЙЛЫ**

### **2.1 Backup старых файлов:**
```bash
cd /www/wwwroot/avtogost77.ru/
mkdir -p backup_$(date +%Y%m%d_%H%M)
cp *.html backup_$(date +%Y%m%d_%H%M)/ 2>/dev/null || echo "No HTML to backup"
```

### **2.2 Копируем новые файлы:**
```bash
# ТЕБЕ НУЖНО СКОПИРОВАТЬ ЭТИ ФАЙЛЫ:

# Главные страницы:
scp index.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp about.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp services.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp contact.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp faq.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp help.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp privacy.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp terms.html root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp track.html root@твой_сервер:/www/wwwroot/avtogost77.ru/

# Блог:
scp blog-*.html root@твой_сервер:/www/wwwroot/avtogost77.ru/

# Оптимизированные стили и скрипты:
scp -r assets/ root@твой_сервер:/www/wwwroot/avtogost77.ru/

# Мета файлы:
scp robots.txt root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp sitemap.xml root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp manifest.json root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp sw.js root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp browserconfig.xml root@твой_сервер:/www/wwwroot/avtogost77.ru/
scp .htaccess root@твой_сервер:/www/wwwroot/avtogost77.ru/

# Документация (опционально):
scp CALCULATOR_BUSINESS_LOGIC.md root@твой_сервер:/www/wwwroot/avtogost77.ru/
```

---

## 🔧 **STEP 3: НАСТРАИВАЕМ NGINX**

```bash
# Создаём правильный конфиг nginx
sudo tee /etc/nginx/sites-enabled/avtogost77 > /dev/null << 'EOF'
server {
    listen 80;
    server_name avtogost77.ru www.avtogost77.ru;
    
    root /www/wwwroot/avtogost77.ru;
    index index.html index.htm;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Кеширование статики
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # HTML файлы
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }
    
    # Основной location
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Скрыть версию nginx
    server_tokens off;
}
EOF

# Тестируем конфиг
sudo nginx -t

# Перезагружаем nginx
sudo systemctl reload nginx
```

---

## ✅ **STEP 4: ПРОВЕРЯЕМ РЕЗУЛЬТАТ**

```bash
# Проверяем HTTP ответ (должен быть без Next.js заголовков)
curl -I http://avtogost77.ru

# Проверяем что отдаётся HTML
curl -s http://avtogost77.ru | head -20

# Проверяем размер (должен быть меньше без Next.js)
du -sh /www/wwwroot/avtogost77.ru/

# Проверяем права доступа
ls -la /www/wwwroot/avtogost77.ru/index.html

# Тест калькулятора (должен работать)
curl -s http://avtogost77.ru | grep -i "calculator"

# Проверяем CSS и JS
curl -I http://avtogost77.ru/assets/css/styles-optimized.min.css
curl -I http://avtogost77.ru/assets/js/smart-calculator-v2.js
```

---

## 🎯 **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:**

```yaml
✅ HTTP/1.1 200 OK
✅ Server: nginx (без X-Powered-By: Next.js)
✅ Content-Type: text/html
❌ Нет x-nextjs-* заголовков
✅ Калькулятор работает с реальными расстояниями
✅ Оптимизированные CSS/JS загружаются
✅ Размер папки уменьшился
✅ Все HTML страницы доступны
```

---

## 🔥 **ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ:**

```bash
# Проверить логи nginx
sudo tail -f /var/log/nginx/error.log

# Проверить права доступа
sudo chown -R www:www /www/wwwroot/avtogost77.ru/
sudo chmod -R 644 /www/wwwroot/avtogost77.ru/*.html
sudo chmod -R 644 /www/wwwroot/avtogost77.ru/assets/

# Перезапустить nginx
sudo systemctl restart nginx

# Очистить кеш если есть
sudo rm -rf /var/cache/nginx/*
```

---

## 🎉 **ФИНАЛЬНАЯ ПРОВЕРКА:**

1. **Открыть сайт** в браузере
2. **Протестировать калькулятор** 
3. **Проверить мобильную версию**
4. **Убедиться что нет ошибок в консоли**

**ПОЕХАЛИ ДЕПЛОИТЬ КРАСОТУ!** 🚀✨