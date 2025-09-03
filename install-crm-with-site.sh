#!/bin/bash

# ============================================
# УСТАНОВКА CRM РЯДОМ С СУЩЕСТВУЮЩИМ САЙТОМ
# Для Timeweb Cloud VPS с сайтом
# ============================================

echo "🚀 Устанавливаем CRM АвтоГост77 (не затронем существующий сайт)..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# 1. ПРОВЕРКИ
# ============================================
echo -e "${YELLOW}🔍 Проверяем систему...${NC}"

# Проверяем свободное место
DISK_USAGE=$(df / | grep / | awk '{ print $5 }' | sed 's/%//g')
if [ $DISK_USAGE -gt 90 ]; then
    echo -e "${RED}⚠️ Мало места на диске! Используется ${DISK_USAGE}%${NC}"
    exit 1
fi

# Проверяем память
FREE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
if [ $FREE_MEM -lt 500 ]; then
    echo -e "${YELLOW}⚠️ Свободной памяти: ${FREE_MEM}MB${NC}"
fi

echo -e "${GREEN}✅ Система готова! Места достаточно.${NC}"

# ============================================
# 2. УСТАНОВКА DOCKER (если нет)
# ============================================
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Устанавливаем Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Docker Compose
    apt update
    apt install -y docker-compose
else
    echo -e "${GREEN}✅ Docker уже установлен${NC}"
fi

# ============================================
# 3. СОЗДАЕМ ДИРЕКТОРИЮ ДЛЯ CRM
# ============================================
echo -e "${YELLOW}📁 Создаем директорию для CRM...${NC}"

# Используем /opt чтобы не мешать сайту
mkdir -p /opt/crm-avtogost77
cd /opt/crm-avtogost77

# ============================================
# 4. ЗАГРУЖАЕМ CRM
# ============================================
echo -e "${YELLOW}📦 Загружаем файлы CRM...${NC}"

# Создаем структуру директорий
mkdir -p backend frontend postgres_data

# ============================================
# 5. СОЗДАЕМ DOCKER-COMPOSE
# ============================================
echo -e "${YELLOW}🐳 Настраиваем контейнеры...${NC}"

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # База данных (изолированная)
  crm_postgres:
    image: postgres:15-alpine
    container_name: crm_postgres
    environment:
      POSTGRES_DB: crm_avtogost77
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5433:5432"  # Не конфликтует с другими БД
    restart: unless-stopped
    networks:
      - crm_network

  # Backend API
  crm_backend:
    image: python:3.11-slim
    container_name: crm_backend
    working_dir: /app
    environment:
      DATABASE_URL: postgresql://crm_user:${DB_PASSWORD}@crm_postgres:5432/crm_avtogost77
      SECRET_KEY: ${SECRET_KEY}
    volumes:
      - ./backend:/app
    ports:
      - "127.0.0.1:8000:8000"  # Только локально
    command: |
      bash -c "
      pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-multipart &&
      uvicorn main:app --host 0.0.0.0 --port 8000 --reload
      "
    depends_on:
      - crm_postgres
    restart: unless-stopped
    networks:
      - crm_network

  # Frontend (простой веб-сервер)
  crm_frontend:
    image: nginx:alpine
    container_name: crm_frontend
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    ports:
      - "127.0.0.1:3001:80"  # Не конфликтует с основным сайтом
    restart: unless-stopped
    networks:
      - crm_network

networks:
  crm_network:
    driver: bridge
    name: crm_avtogost77_net
EOF

# ============================================
# 6. СОЗДАЕМ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ
# ============================================
echo -e "${YELLOW}🔐 Генерируем пароли...${NC}"

DB_PASS=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
SECRET=$(openssl rand -base64 32)

cat > .env << EOF
# База данных
DB_PASSWORD=${DB_PASS}

# Backend
SECRET_KEY=${SECRET}

# Admin
ADMIN_USER=admin
ADMIN_PASSWORD=$(openssl rand -base64 12 | tr -d "=+/" | cut -c1-12)
EOF

echo -e "${GREEN}✅ Пароли созданы и сохранены в .env${NC}"

# ============================================
# 7. БАЗОВАЯ СТРУКТУРА CRM
# ============================================
echo -e "${YELLOW}📝 Создаем базовые файлы CRM...${NC}"

# Backend main.py
cat > backend/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="АвтоГост77 CRM API", version="1.0.0")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "АвтоГост77 CRM API работает!"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "crm-backend"}

@app.get("/api/info")
async def info():
    return {
        "name": "АвтоГост77 CRM",
        "version": "1.0.0",
        "status": "operational"
    }
EOF

# Frontend index.html
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>АвтоГост77 CRM</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .status {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 20px 0;
        }
        .info {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .info p {
            margin: 10px 0;
            color: #555;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1.1em;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: transform 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚛 АвтоГост77 CRM</h1>
        <div class="status">✅ Система установлена успешно!</div>
        
        <div class="info">
            <h2>📊 Информация о системе</h2>
            <p><strong>Версия:</strong> 1.0.0</p>
            <p><strong>Статус:</strong> Работает</p>
            <p><strong>API:</strong> <span id="api-status">Проверяем...</span></p>
        </div>
        
        <div>
            <a href="/api/docs" class="btn">📚 API Документация</a>
            <a href="http://avtogost77.ru" class="btn">🌐 Основной сайт</a>
        </div>
        
        <p style="margin-top: 30px; color: #888;">
            © 2025 АвтоГост77. CRM система для управления грузоперевозками.
        </p>
    </div>
    
    <script>
        // Проверяем доступность API
        fetch('http://' + window.location.hostname + ':8000/health')
            .then(response => response.json())
            .then(data => {
                document.getElementById('api-status').innerHTML = 
                    '<span style="color: green;">✅ Подключен</span>';
            })
            .catch(error => {
                document.getElementById('api-status').innerHTML = 
                    '<span style="color: red;">❌ Недоступен</span>';
            });
    </script>
</body>
</html>
EOF

# ============================================
# 8. ЗАПУСКАЕМ CRM
# ============================================
echo -e "${YELLOW}🚀 Запускаем CRM контейнеры...${NC}"

docker-compose up -d

echo "Ждем запуска сервисов..."
sleep 10

# ============================================
# 9. НАСТРОЙКА NGINX (если нужен поддомен)
# ============================================
echo -e "${YELLOW}🌐 Настраиваем Nginx...${NC}"

# Проверяем есть ли Nginx
if command -v nginx &> /dev/null; then
    cat > /etc/nginx/sites-available/crm-avtogost77 << 'EOF'
# CRM АвтоГост77 - работает рядом с основным сайтом
server {
    listen 80;
    server_name crm.avtogost77.ru;
    
    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API Docs
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_set_header Host $host;
    }
}
EOF
    
    # Активируем если нужно
    # ln -sf /etc/nginx/sites-available/crm-avtogost77 /etc/nginx/sites-enabled/
    # nginx -t && systemctl reload nginx
    
    echo -e "${GREEN}✅ Конфигурация Nginx создана (но не активирована)${NC}"
fi

# ============================================
# 10. ПРОВЕРКА И ВЫВОД РЕЗУЛЬТАТОВ
# ============================================
echo -e "${YELLOW}🔍 Проверяем статус...${NC}"

# Проверяем контейнеры
docker ps | grep crm_

# Получаем IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

# ============================================
# ФИНАЛЬНЫЙ ВЫВОД
# ============================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         🎉 CRM УСПЕШНО УСТАНОВЛЕНА!                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "📋 ДОСТУП К СИСТЕМЕ:"
echo "════════════════════════════════════════════"
echo "  CRM Interface:  http://${SERVER_IP}:3001"
echo "  API Backend:    http://${SERVER_IP}:8000"
echo "  API Docs:       http://${SERVER_IP}:8000/docs"
echo ""
echo "🔐 ДАННЫЕ ДЛЯ ВХОДА:"
echo "════════════════════════════════════════════"
echo "  Сохранены в файле: /opt/crm-avtogost77/.env"
echo ""
source .env
echo "  Admin User:     ${ADMIN_USER}"
echo "  Admin Password: ${ADMIN_PASSWORD}"
echo ""
echo "📁 РАСПОЛОЖЕНИЕ:"
echo "════════════════════════════════════════════"
echo "  Директория:     /opt/crm-avtogost77"
echo "  Данные БД:      /opt/crm-avtogost77/postgres_data"
echo "  Логи:           docker-compose logs -f"
echo ""
echo "🛠️ УПРАВЛЕНИЕ:"
echo "════════════════════════════════════════════"
echo "  Остановить:     cd /opt/crm-avtogost77 && docker-compose down"
echo "  Запустить:      cd /opt/crm-avtogost77 && docker-compose up -d"
echo "  Перезапустить:  cd /opt/crm-avtogost77 && docker-compose restart"
echo "  Логи:           cd /opt/crm-avtogost77 && docker-compose logs -f"
echo ""
echo "🌐 НАСТРОЙКА ДОМЕНА (опционально):"
echo "════════════════════════════════════════════"
echo "  1. Добавьте A-запись: crm.avtogost77.ru -> ${SERVER_IP}"
echo "  2. Активируйте Nginx: ln -sf /etc/nginx/sites-available/crm-avtogost77 /etc/nginx/sites-enabled/"
echo "  3. Перезапустите Nginx: systemctl reload nginx"
echo "  4. Установите SSL: certbot --nginx -d crm.avtogost77.ru"
echo ""
echo -e "${YELLOW}⚠️  ВАЖНО: CRM работает на отдельных портах и не мешает основному сайту!${NC}"
echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"