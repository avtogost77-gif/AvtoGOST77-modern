#!/bin/bash

# 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS
# Скрипт для быстрого развертывания на сервере

echo "🚀 НАЧИНАЕМ ДЕПЛОЙ НА VPS..."

# Конфигурация
VPS_HOST="194.87.95.83"
VPS_USER="root"
VPS_PATH="/var/www/avtogost77.ru"
GITHUB_REPO="https://github.com/avtogost77-gif/AvtoGOST77-modern.git"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Коммитим и пушим все изменения
echo -e "${YELLOW}📦 Шаг 1: Коммитим и пушим изменения...${NC}"
git add -A
git commit -m "🚀 AUTO-DEPLOY: Финальные правки перед деплоем

- Исправлен manifest.json (SVG иконки)
- Добавлен telegram-sender.js для отправки форм
- Настроен реальный Tawk.to ID
- Все телефоны обновлены на +79162720932"

git push origin main

# 2. Подключаемся к VPS и обновляем код
echo -e "${YELLOW}🔄 Шаг 2: Обновляем код на VPS...${NC}"

# Создаем команду для выполнения на VPS
VPS_COMMANDS=$(cat << 'EOF'
cd /var/www/avtogost77.ru

# Проверяем текущую ветку
CURRENT_BRANCH=$(git branch --show-current)
echo "Текущая ветка: $CURRENT_BRANCH"

# Если мы в ultimate-version, переключаемся на main
if [ "$CURRENT_BRANCH" = "ultimate-version" ]; then
    echo "Переключаемся на main..."
    git checkout main
fi

# Обновляем код
echo "Обновляем репозиторий..."
git fetch origin
git pull origin main

# Проверяем права доступа
echo "Устанавливаем права доступа..."
chown -R www-data:www-data /var/www/avtogost77.ru
chmod -R 755 /var/www/avtogost77.ru

# Перезапускаем Nginx для применения изменений
echo "Перезапускаем Nginx..."
systemctl reload nginx

# Проверяем статус
echo "Проверяем статус сервисов..."
systemctl status nginx --no-pager | head -10

echo "✅ Деплой завершен!"
EOF
)

# Выполняем команды на VPS
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "$VPS_COMMANDS"

# 3. Проверяем доступность сайта
echo -e "${YELLOW}🔍 Шаг 3: Проверяем доступность сайта...${NC}"
sleep 3

# Проверяем HTTP статус
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avtogost77.ru)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Сайт доступен! HTTP статус: $HTTP_STATUS${NC}"
else
    echo -e "${RED}❌ Проблема с сайтом! HTTP статус: $HTTP_STATUS${NC}"
fi

# 4. Выводим итоговую информацию
echo -e "${GREEN}
================================
🎉 ДЕПЛОЙ ЗАВЕРШЕН!
================================

📌 Сайт: https://avtogost77.ru
📊 Метрика: https://metrika.yandex.ru/dashboard?id=103413788
💬 Tawk.to: https://dashboard.tawk.to
📱 Telegram бот: @avtogost77_bot

⚠️  НЕ ЗАБУДЬ:
1. Получить токен бота у @BotFather
2. Обновить токен в telegram-sender.js
3. Запустить father_bot.py на VPS

${NC}"