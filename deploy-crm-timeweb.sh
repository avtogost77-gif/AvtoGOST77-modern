#!/bin/bash

# ============================================
# АВТОМАТИЧЕСКАЯ УСТАНОВКА CRM AVTOGOST77
# Для Timeweb Cloud VPS
# ============================================

echo "🚀 Начинаем установку CRM АвтоГост77..."

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка что запущено от root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Этот скрипт должен быть запущен от root!${NC}" 
   exit 1
fi

# ============================================
# 1. ОБНОВЛЕНИЕ СИСТЕМЫ
# ============================================
echo -e "${YELLOW}📦 Обновляем систему...${NC}"
apt update && apt upgrade -y

# ============================================
# 2. УСТАНОВКА DOCKER
# ============================================
echo -e "${YELLOW}🐳 Устанавливаем Docker...${NC}"

# Проверяем, установлен ли Docker
if ! command -v docker &> /dev/null; then
    # Установка Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Установка Docker Compose
    apt install docker-compose -y
    
    echo -e "${GREEN}✅ Docker установлен!${NC}"
else
    echo -e "${GREEN}✅ Docker уже установлен!${NC}"
fi

# ============================================
# 3. УСТАНОВКА ДОПОЛНИТЕЛЬНЫХ ПАКЕТОВ
# ============================================
echo -e "${YELLOW}📦 Устанавливаем дополнительные пакеты...${NC}"
apt install -y git nginx certbot python3-certbot-nginx ufw

# ============================================
# 4. НАСТРОЙКА FIREWALL
# ============================================
echo -e "${YELLOW}🔒 Настраиваем firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8000
ufw allow 3000
ufw --force enable

# ============================================
# 5. КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ
# ============================================
echo -e "${YELLOW}📂 Загружаем CRM...${NC}"

# Переходим в домашнюю директорию
cd /opt

# Клонируем репозиторий
if [ -d "avtogost77-crm" ]; then
    echo "Директория уже существует, обновляем..."
    cd avtogost77-crm
    git pull
else
    git clone -b crm https://github.com/yourusername/yourrepo.git avtogost77-crm
    cd avtogost77-crm
fi

# ============================================
# 6. СОЗДАНИЕ ФАЙЛА ОКРУЖЕНИЯ
# ============================================
echo -e "${YELLOW}⚙️ Создаем конфигурацию...${NC}"

cat > .env << EOF
# База данных
POSTGRES_DB=avtogost77_crm
POSTGRES_USER=avtogost77
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Backend
SECRET_KEY=$(openssl rand -base64 32)
DATABASE_URL=postgresql://avtogost77:${POSTGRES_PASSWORD}@postgres:5432/avtogost77_crm

# Frontend
REACT_APP_API_URL=http://localhost:8000

# Админ
ADMIN_EMAIL=admin@avtogost77.ru
ADMIN_PASSWORD=$(openssl rand -base64 16)
EOF

echo -e "${GREEN}✅ Конфигурация создана!${NC}"

# ============================================
# 7. СОЗДАНИЕ DOCKER-COMPOSE
# ============================================
echo -e "${YELLOW}🐳 Создаем docker-compose.yml...${NC}"

cat > docker-compose-production.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL база данных
  postgres:
    image: postgres:15
    container_name: avtogost77_postgres
    env_file: .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./avtogost77-crm-mvp/backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: always
    networks:
      - crm_network

  # Backend API
  backend:
    build: ./avtogost77-crm-mvp/backend
    container_name: avtogost77_backend
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    restart: always
    networks:
      - crm_network
    volumes:
      - ./avtogost77-crm-mvp/backend:/app

  # Frontend
  frontend:
    image: nginx:alpine
    container_name: avtogost77_frontend
    ports:
      - "3000:80"
    volumes:
      - ./avtogost77-crm-mvp/frontend:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: always
    networks:
      - crm_network

volumes:
  postgres_data:

networks:
  crm_network:
    driver: bridge
EOF

# ============================================
# 8. НАСТРОЙКА NGINX
# ============================================
echo -e "${YELLOW}🌐 Настраиваем Nginx...${NC}"

cat > /etc/nginx/sites-available/crm-avtogost77 << 'EOF'
server {
    listen 80;
    server_name crm.avtogost77.ru;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API документация
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host $host;
    }
}
EOF

# Активируем сайт
ln -sf /etc/nginx/sites-available/crm-avtogost77 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# ============================================
# 9. ЗАПУСК CRM
# ============================================
echo -e "${YELLOW}🚀 Запускаем CRM...${NC}"

# Запускаем контейнеры
docker-compose -f docker-compose-production.yml up -d

# Ждем запуска
echo "Ожидаем запуска сервисов..."
sleep 10

# ============================================
# 10. ПРОВЕРКА СТАТУСА
# ============================================
echo -e "${YELLOW}🔍 Проверяем статус...${NC}"

# Проверяем контейнеры
docker ps

# Проверяем доступность
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend работает!${NC}"
else
    echo -e "${RED}❌ Backend не отвечает${NC}"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend работает!${NC}"
else
    echo -e "${RED}❌ Frontend не отвечает${NC}"
fi

# ============================================
# 11. ВЫВОД ИНФОРМАЦИИ
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 CRM УСПЕШНО УСТАНОВЛЕНА!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 Информация для доступа:"
echo "----------------------------"
echo "Frontend: http://$(curl -s ifconfig.me):3000"
echo "Backend API: http://$(curl -s ifconfig.me):8000"
echo "API Docs: http://$(curl -s ifconfig.me):8000/docs"
echo ""
echo "🔐 Данные администратора:"
echo "----------------------------"
echo "Email: admin@avtogost77.ru"
echo "Пароль сохранен в файле: /opt/avtogost77-crm/.env"
echo ""
echo "📁 Расположение:"
echo "----------------------------"
echo "Директория: /opt/avtogost77-crm"
echo "Конфигурация: /opt/avtogost77-crm/.env"
echo "Логи: docker-compose -f docker-compose-production.yml logs"
echo ""
echo "🛠️ Полезные команды:"
echo "----------------------------"
echo "Перезапустить: cd /opt/avtogost77-crm && docker-compose -f docker-compose-production.yml restart"
echo "Остановить: cd /opt/avtogost77-crm && docker-compose -f docker-compose-production.yml down"
echo "Логи: cd /opt/avtogost77-crm && docker-compose -f docker-compose-production.yml logs -f"
echo ""
echo -e "${YELLOW}⚠️ Не забудьте настроить SSL сертификат:${NC}"
echo "certbot --nginx -d crm.avtogost77.ru"
echo ""
echo -e "${GREEN}========================================${NC}"