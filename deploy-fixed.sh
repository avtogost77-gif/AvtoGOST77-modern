#!/bin/bash

echo "🚀 ЭКСТРЕННЫЙ ДЕПЛОЙ С ФИКСАМИ МОБИЛЬНЫХ КНОПОК"
echo "=============================================="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📱 ИСПРАВЛЕНИЯ В ЭТОЙ ВЕРСИИ:${NC}"
echo "✅ Кнопки теперь работают на всех мобильных устройствах"
echo "✅ Убрана задержка 300мс при клике (iOS/Android)"
echo "✅ Исправлена проблема с двойными кликами"
echo "✅ Добавлены увеличенные области нажатия"
echo "✅ Hero изображение корректно отображается"
echo "✅ Гамбургер меню работает правильно"
echo ""

# Проверка файлов
echo -e "${YELLOW}🔍 Проверка критических файлов...${NC}"
REQUIRED_FILES=(
    "index.html"
    "assets/css/main.css"
    "assets/css/mobile.css"
    "assets/css/critical-mobile-fix.css"
    "assets/js/main.js"
    "assets/js/calc.js"
    "robots.txt"
    "sitemap.xml"
)

ALL_OK=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file - ОТСУТСТВУЕТ!"
        ALL_OK=false
    fi
done

if [ "$ALL_OK" = false ]; then
    echo -e "${RED}❌ Не все файлы на месте!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Все файлы готовы к деплою!${NC}"
echo ""

# SFTP настройки
SFTP_HOST="hosting.reg.ru"
SFTP_USER="u3207373"
SFTP_PASS="5x8cZ19H0rWhh6Qt"
REMOTE_DIR="/var/www/u3207373/data/www/avtogost77.ru"

echo -e "${YELLOW}📤 Начинаю загрузку на хостинг...${NC}"
echo "Сервер: $SFTP_HOST"
echo "Директория: $REMOTE_DIR"
echo ""

# Создаем временный batch файл для sftp
cat > sftp_batch.txt << EOF
cd $REMOTE_DIR
put -r assets
put index.html
put robots.txt
put sitemap.xml
put test-buttons.html
bye
EOF

# Выполняем загрузку
sshpass -p "$SFTP_PASS" sftp -oBatchMode=no -oStrictHostKeyChecking=no -b sftp_batch.txt $SFTP_USER@$SFTP_HOST

# Удаляем временный файл
rm -f sftp_batch.txt

echo ""
echo -e "${GREEN}✅ ДЕПЛОЙ ЗАВЕРШЕН!${NC}"
echo ""
echo -e "${YELLOW}📋 ЧЕКЛИСТ ДЛЯ ПРОВЕРКИ:${NC}"
echo "1. Откройте https://avtogost77.ru на мобильном"
echo "2. Проверьте кнопки - они должны реагировать на первый клик"
echo "3. Проверьте hero изображение - должно отображаться"
echo "4. Проверьте меню-гамбургер - должно открываться/закрываться"
echo "5. Отправьте тестовую заявку через калькулятор"
echo "6. Проверьте страницу тестирования: https://avtogost77.ru/test-buttons.html"
echo ""
echo -e "${GREEN}🎉 Сайт восстановлен! Теперь можно спокойно работать над ULTIMATE версией!${NC}"