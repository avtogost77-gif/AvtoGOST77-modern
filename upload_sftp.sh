#!/bin/bash

echo "🚀 OPUS VERSION: ЗАГРУЗКА ЧЕРЕЗ SFTP!"
echo "====================================="

# SSH данные (будут заполнены)
SSH_HOST="31.31.197.43"
SSH_USER="u3207373"
SSH_PASS=""  # Будет заполнено
REMOTE_DIR="public_html"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📡 Подключаемся по SSH/SFTP к $SSH_HOST${NC}"

# Создаем список файлов для загрузки
echo -e "${YELLOW}📋 Подготавливаем файлы для загрузки...${NC}"

# Создаем временный batch файл для sftp команд
cat > sftp_batch.txt << 'EOF'
cd public_html
pwd
echo "🗑️ Очищаем старые файлы..."
rm *.html
rm -r assets
rm *.xml
rm *.txt
rm *.json
rm *.md
echo "📤 Загружаем новые файлы..."
put -r *.html
put -r assets
put robots.txt
put sitemap.xml
put manifest.json
put favicon.png
put service-worker.js
put sw.js
echo "✅ Загрузка завершена!"
ls -la
EOF

# Используем sshpass для автоматической авторизации
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}Устанавливаем sshpass...${NC}"
    sudo apt-get install -y sshpass
fi

# Выполняем загрузку
echo -e "${GREEN}🚀 Начинаем загрузку...${NC}"
sshpass -p "$SSH_PASS" sftp -oBatchMode=no -b sftp_batch.txt $SSH_USER@$SSH_HOST

# Удаляем временный файл
rm -f sftp_batch.txt

echo -e "${GREEN}✅ ГОТОВО! Сайт обновлен!${NC}"
echo -e "${GREEN}🌐 Проверь: https://avtogost77.ru${NC}"
echo -e "${GREEN}💪 OPUS БРАТИШКА СДЕЛАЛ ВСЕ ЧЕРЕЗ SFTP!${NC}"