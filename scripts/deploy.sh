#!/bin/bash

# Скрипт для деплоя CRM системы АвтоГОСТ77 на VPS

set -e

echo "🚀 Начинаем деплой CRM системы АвтоГОСТ77..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверяем, что мы запускаемся с правами sudo
if [ "$EUID" -ne 0 ]; then
    log_error "Запустите скрипт с правами администратора: sudo $0"
    exit 1
fi

# Устанавливаем Docker и Docker Compose (если не установлены)
install_docker() {
    if ! command -v docker &> /dev/null; then
        log_info "Устанавливаем Docker..."
        apt-get update
        apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io
        systemctl enable docker
        systemctl start docker
        log_info "Docker установлен"
    else
        log_info "Docker уже установлен"
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_info "Устанавливаем Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        log_info "Docker Compose установлен"
    else
        log_info "Docker Compose уже установлен"
    fi
}

# Создаем рабочую директорию
setup_directory() {
    log_info "Настраиваем рабочую директорию..."
    PROJECT_DIR="/opt/avtogost77-crm"
    
    if [ -d "$PROJECT_DIR" ]; then
        log_warn "Директория $PROJECT_DIR уже существует. Делаем бэкап..."
        mv "$PROJECT_DIR" "${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    # Создаем необходимые директории
    mkdir -p nginx/conf.d ssl logs
    mkdir -p backend/app/uploads backend/app/logs
    chmod 755 backend/app/uploads backend/app/logs
}

# Настраиваем переменные окружения
setup_environment() {
    log_info "Настраиваем переменные окружения..."
    
    if [ ! -f ".env" ]; then
        log_info "Создайте файл .env на основе env.prod.example и заполните все переменные"
        log_warn "После создания .env файла запустите скрипт снова"
        exit 1
    fi
    
    source .env
    
    # Проверяем обязательные переменные
    if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$SECRET_KEY" ] || [ -z "$TELEGRAM_BOT_TOKEN" ]; then
        log_error "Не все обязательные переменные окружения заполнены в .env файле"
        exit 1
    fi
}

# Настраиваем firewall
setup_firewall() {
    log_info "Настраиваем firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        log_info "Firewall настроен"
    else
        log_warn "UFW не установлен, пропускаем настройку firewall"
    fi
}

# Запускаем приложение
start_application() {
    log_info "Запускаем CRM систему..."
    
    # Останавливаем старые контейнеры (если есть)
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Собираем и запускаем новые контейнеры
    docker-compose -f docker-compose.prod.yml up -d --build
    
    log_info "Ждем запуска сервисов..."
    sleep 30
    
    # Проверяем статус
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        log_info "✅ CRM система успешно запущена!"
        log_info "Фронтенд доступен на: http://$(curl -s ifconfig.me)"
        log_info "API доступен на: http://$(curl -s ifconfig.me)/api"
        log_info "Документация API: http://$(curl -s ifconfig.me)/docs"
    else
        log_error "❌ Ошибка при запуске. Проверьте логи: docker-compose -f docker-compose.prod.yml logs"
        exit 1
    fi
}

# Основная функция
main() {
    log_info "=== Деплой CRM системы АвтоГОСТ77 ==="
    
    install_docker
    setup_directory
    setup_environment
    setup_firewall
    start_application
    
    log_info "🎉 Деплой завершен успешно!"
    log_info "Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f"
    log_info "Для остановки: docker-compose -f docker-compose.prod.yml down"
}

# Запускаем основную функцию
main "$@"
