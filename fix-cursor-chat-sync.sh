#!/bin/bash

# Скрипт для исправления синхронизации чатов между Cursor Desktop и Web
# ===================================================================

echo "🔧 Cursor Chat Sync Fix Tool"
echo "==========================="
echo ""

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Находим директории Cursor
CURSOR_DIRS=(
    "$HOME/.config/Cursor"
    "$HOME/.cursor"
    "$HOME/.local/share/Cursor"
)

echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Этот скрипт очистит локальный кэш Cursor${NC}"
echo -e "${YELLOW}   Убедитесь, что у вас есть важные несохраненные данные!${NC}"
echo ""
read -p "Продолжить? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отменено."
    exit 0
fi

echo ""
echo "🧹 Шаг 1: Очистка кэша и временных данных..."

for dir in "${CURSOR_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Обработка: $dir${NC}"
        
        # Очищаем кэш
        if [ -d "$dir/Cache" ]; then
            rm -rf "$dir/Cache"/*
            echo "   ✅ Кэш очищен"
        fi
        
        # Очищаем состояние синхронизации
        if [ -f "$dir/User/globalStorage/state.vscdb" ]; then
            # Создаем бэкап на всякий случай
            cp "$dir/User/globalStorage/state.vscdb" "$dir/User/globalStorage/state.vscdb.backup"
            echo "   ✅ Создан бэкап состояния"
        fi
        
        # Очищаем логи
        if [ -d "$dir/logs" ]; then
            rm -rf "$dir/logs"/*
            echo "   ✅ Логи очищены"
        fi
    fi
done

echo ""
echo "🔄 Шаг 2: Сброс настроек синхронизации..."

# Создаем файл с правильными настройками синхронизации
SETTINGS_FILE="$HOME/.cursor/User/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    # Бэкап настроек
    cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup"
    echo "   ✅ Создан бэкап настроек"
fi

echo ""
echo -e "${GREEN}✅ Очистка завершена!${NC}"
echo ""
echo "📋 Теперь выполните следующие шаги:"
echo ""
echo "1. ${GREEN}Полностью закройте Cursor Desktop${NC}"
echo "   - File → Exit (не просто закройте окно)"
echo ""
echo "2. ${GREEN}Откройте Cursor Desktop заново${NC}"
echo ""
echo "3. ${GREEN}Проверьте авторизацию${NC}"
echo "   - Settings → Account"
echo "   - Если не авторизованы, войдите в аккаунт"
echo ""
echo "4. ${GREEN}Подождите 2-3 минуты${NC}"
echo "   - Дайте время на синхронизацию"
echo ""
echo "5. ${GREEN}Откройте Cursor Web${NC}"
echo "   - Войдите в тот же аккаунт"
echo "   - Чаты должны появиться"
echo ""
echo "🆘 Если не помогло:"
echo "   • Попробуйте VPN (иногда есть проблемы с доступом к серверам)"
echo "   • Проверьте файрвол/антивирус"
echo "   • Напишите в поддержку: hi@cursor.com"
echo ""
echo "💡 Совет: Включите автосинхронизацию в Settings → Sync"