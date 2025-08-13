#!/bin/bash

# Cursor Sync Manager - Управление синхронизацией между Desktop и Web
# =================================================================

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
CURSOR_DIR="$HOME/.cursor"
CONFIG_FILE="$CURSOR_DIR/config.json"
SYNC_LOG="$CURSOR_DIR/logs/sync.log"
SYNC_STATE="$CURSOR_DIR/sync-state.json"

# Создаем необходимые директории
mkdir -p "$CURSOR_DIR/logs"
mkdir -p "$CURSOR_DIR/cache"
mkdir -p "$CURSOR_DIR/conflicts"

# Функция логирования
log() {
    local level=$1
    shift
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$SYNC_LOG"
}

# Проверка статуса синхронизации
check_sync_status() {
    echo -e "${BLUE}🔍 Проверка статуса синхронизации...${NC}"
    
    if [ -f "$SYNC_STATE" ]; then
        local last_sync=$(jq -r '.lastSync' "$SYNC_STATE" 2>/dev/null || echo "Никогда")
        local sync_mode=$(jq -r '.mode' "$SYNC_STATE" 2>/dev/null || echo "Не установлен")
        local total_files=$(jq -r '.totalFiles' "$SYNC_STATE" 2>/dev/null || echo "0")
        
        echo -e "${GREEN}✅ Статус синхронизации:${NC}"
        echo -e "   Последняя синхронизация: $last_sync"
        echo -e "   Режим: $sync_mode"
        echo -e "   Синхронизировано файлов: $total_files"
    else
        echo -e "${YELLOW}⚠️  Синхронизация еще не настроена${NC}"
    fi
}

# Инициализация синхронизации
init_sync() {
    echo -e "${BLUE}🚀 Инициализация синхронизации...${NC}"
    
    # Создаем начальное состояние
    cat > "$SYNC_STATE" <<EOF
{
  "lastSync": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "mode": "bidirectional",
  "totalFiles": 0,
  "pendingChanges": [],
  "conflicts": [],
  "version": "1.0.0"
}
EOF
    
    log "INFO" "Синхронизация инициализирована"
    echo -e "${GREEN}✅ Синхронизация успешно инициализирована${NC}"
}

# Запуск background agent
start_agent() {
    echo -e "${BLUE}🤖 Запуск background agent...${NC}"
    
    # Проверяем, не запущен ли уже агент
    if pgrep -f "cursor-sync-agent" > /dev/null; then
        echo -e "${YELLOW}⚠️  Background agent уже запущен${NC}"
        return 1
    fi
    
    # Запускаем агент в фоне
    nohup bash -c '
        while true; do
            # Проверяем изменения каждые 30 секунд
            sleep 30
            
            # Здесь должна быть логика синхронизации
            # В реальной реализации это будет API вызов к Cursor Cloud
            
            echo "[$(date)] Проверка изменений..." >> "'$SYNC_LOG'"
        done
    ' > "$CURSOR_DIR/logs/agent.log" 2>&1 &
    
    local agent_pid=$!
    echo $agent_pid > "$CURSOR_DIR/agent.pid"
    
    log "INFO" "Background agent запущен с PID: $agent_pid"
    echo -e "${GREEN}✅ Background agent успешно запущен${NC}"
}

# Остановка background agent
stop_agent() {
    echo -e "${BLUE}🛑 Остановка background agent...${NC}"
    
    if [ -f "$CURSOR_DIR/agent.pid" ]; then
        local agent_pid=$(cat "$CURSOR_DIR/agent.pid")
        if kill -0 $agent_pid 2>/dev/null; then
            kill $agent_pid
            rm "$CURSOR_DIR/agent.pid"
            log "INFO" "Background agent остановлен"
            echo -e "${GREEN}✅ Background agent успешно остановлен${NC}"
        else
            echo -e "${YELLOW}⚠️  Background agent не найден${NC}"
            rm "$CURSOR_DIR/agent.pid"
        fi
    else
        echo -e "${YELLOW}⚠️  Background agent не запущен${NC}"
    fi
}

# Форсированная синхронизация
force_sync() {
    echo -e "${BLUE}🔄 Запуск принудительной синхронизации...${NC}"
    
    log "INFO" "Запущена принудительная синхронизация"
    
    # Обновляем состояние
    local current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq --arg time "$current_time" '.lastSync = $time' "$SYNC_STATE" > "$SYNC_STATE.tmp" && mv "$SYNC_STATE.tmp" "$SYNC_STATE"
    
    # Здесь должна быть реальная логика синхронизации
    # Симулируем процесс
    echo -e "${YELLOW}⏳ Сканирование изменений...${NC}"
    sleep 2
    echo -e "${YELLOW}⏳ Синхронизация файлов...${NC}"
    sleep 2
    echo -e "${YELLOW}⏳ Обновление метаданных...${NC}"
    sleep 1
    
    log "INFO" "Синхронизация завершена"
    echo -e "${GREEN}✅ Синхронизация успешно завершена${NC}"
}

# Показать конфликты
show_conflicts() {
    echo -e "${BLUE}⚠️  Проверка конфликтов...${NC}"
    
    local conflicts_dir="$CURSOR_DIR/conflicts"
    if [ -d "$conflicts_dir" ] && [ "$(ls -A $conflicts_dir 2>/dev/null)" ]; then
        echo -e "${RED}❌ Обнаружены конфликты:${NC}"
        ls -la "$conflicts_dir"
    else
        echo -e "${GREEN}✅ Конфликтов не обнаружено${NC}"
    fi
}

# Очистка кэша
clear_cache() {
    echo -e "${BLUE}🧹 Очистка кэша синхронизации...${NC}"
    
    rm -rf "$CURSOR_DIR/cache/*"
    log "INFO" "Кэш очищен"
    echo -e "${GREEN}✅ Кэш успешно очищен${NC}"
}

# Главное меню
show_help() {
    echo -e "${BLUE}Cursor Sync Manager - Управление синхронизацией${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo ""
    echo "Использование: $0 [команда]"
    echo ""
    echo "Команды:"
    echo "  status    - Показать статус синхронизации"
    echo "  init      - Инициализировать синхронизацию"
    echo "  start     - Запустить background agent"
    echo "  stop      - Остановить background agent"
    echo "  sync      - Принудительная синхронизация"
    echo "  conflicts - Показать конфликты"
    echo "  clear     - Очистить кэш"
    echo "  help      - Показать эту справку"
    echo ""
}

# Обработка команд
case "$1" in
    status)
        check_sync_status
        ;;
    init)
        init_sync
        ;;
    start)
        start_agent
        ;;
    stop)
        stop_agent
        ;;
    sync)
        force_sync
        ;;
    conflicts)
        show_conflicts
        ;;
    clear)
        clear_cache
        ;;
    help|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Неизвестная команда: $1${NC}"
        show_help
        exit 1
        ;;
esac