#!/bin/bash

# Скрипт для деплоя CRM системы АвтоГОСТ77 на VPS

set -e

# Настройки VPS
VPS_HOST="root@193.160.208.183"
VPS_PATH="/opt/avtogost77-crm"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🚀 Деплой CRM системы АвтоГОСТ77 на VPS..."

# Проверяем SSH ключ
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH ключ не найден: $SSH_KEY"
    exit 1
fi

# Проверяем наличие файлов проекта
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ docker-compose.prod.yml не найден. Запустите из корня проекта CRM."
    exit 1
fi

echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем архив проекта
echo "📦 Создание архива проекта..."
tar -czf avtogost77-crm-deploy.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env' \
    --exclude='backend/app/uploads' \
    --exclude='backend/app/logs' \
    .

# Загружаем архив на VPS
echo "📤 Загрузка проекта на VPS..."
scp -i $SSH_KEY avtogost77-crm-deploy.tar.gz $VPS_HOST:/tmp/

# Распаковываем и настраиваем на VPS
echo "⚙️ Настройка на VPS..."
ssh -i $SSH_KEY $VPS_HOST << 'EOF'
    # Переходим в домашнюю директорию
    cd /opt
    
    # Создаем бэкап, если директория существует
    if [ -d "avtogost77-crm" ]; then
        mv avtogost77-crm avtogost77-crm.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Создаем новую директорию
    mkdir -p avtogost77-crm
    cd avtogost77-crm
    
    # Распаковываем архив
    tar -xzf /tmp/avtogost77-crm-deploy.tar.gz
    
    # Создаем .env файл
    cat > .env << 'ENVEOF'
# PostgreSQL
POSTGRES_PASSWORD=avtogost77_secure_2025

# Backend
SECRET_KEY=avtogost77_crm_secret_key_2025_super_secure
DATABASE_URL=postgresql://avtogost77:avtogost77_secure_2025@postgres:5432/avtogost77_crm

# Telegram (нужно будет заполнить реальными данными)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=@avtogost77

# Email (нужно будет заполнить реальными данными)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@avtogost77.ru

# Domain
DOMAIN=avtogost77.ru
ENVEOF

    # Создаем необходимые директории
    mkdir -p backend/app/uploads backend/app/logs nginx/conf.d ssl
    chmod 755 backend/app/uploads backend/app/logs
    
    # Устанавливаем Docker, если не установлен
    if ! command -v docker &> /dev/null; then
        echo "Устанавливаем Docker..."
        apt-get update
        apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io
        systemctl enable docker
        systemctl start docker
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "Устанавливаем Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Останавливаем старые контейнеры
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Запускаем CRM систему
    echo "🚀 Запускаем CRM систему..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Ждем запуска
    sleep 30
    
    # Проверяем статус
    echo "✅ Проверка статуса контейнеров:"
    docker-compose -f docker-compose.prod.yml ps
    
    # Удаляем временный архив
    rm -f /tmp/avtogost77-crm-deploy.tar.gz
    
    echo "🎉 CRM система развернута!"
    echo "🌐 Фронтенд: http://193.160.208.183"
    echo "📊 API: http://193.160.208.183/api"
    echo "📖 Документация: http://193.160.208.183/docs"
EOF

# Удаляем локальный архив
rm -f avtogost77-crm-deploy.tar.gz

echo "✅ Деплой завершен!"
echo ""
echo "🌐 CRM система доступна по адресу: http://193.160.208.183"
echo "📊 API документация: http://193.160.208.183/docs"
echo ""
echo "📝 Не забудьте настроить переменные окружения в файле /opt/avtogost77-crm/.env на сервере:"
echo "   - TELEGRAM_BOT_TOKEN"
echo "   - EMAIL_USER и EMAIL_PASSWORD"
echo ""
echo "🔧 Для просмотра логов:"
echo "   ssh -i $SSH_KEY $VPS_HOST \"cd $VPS_PATH && docker-compose -f docker-compose.prod.yml logs -f\""
