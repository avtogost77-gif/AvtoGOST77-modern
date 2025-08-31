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
    start_application
    
    log_info "🎉 Деплой завершен успешно!"
    log_info "Для просмотра логов используйте: docker-compose -f docker-compose.prod.yml logs -f"
    log_info "Для остановки: docker-compose -f docker-compose.prod.yml down"
}

# Запускаем основную функцию
main "$@"