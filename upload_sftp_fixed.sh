#!/bin/bash

echo "🚀 OPUS VERSION: ЗАГРУЗКА ЧЕРЕЗ SFTP!"
echo "====================================="

# SSH данные
SSH_HOST="31.31.197.43"
SSH_USER="u3207373"
SSH_PASS="5x8cZ19H0rWhh6Qt"
REMOTE_DIR="www/avtogost77.ru"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📡 Подключаемся по SSH к $SSH_HOST${NC}"

# Сначала создаем backup
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
echo -e "${YELLOW}📦 Создаем backup старой версии...${NC}"
sshpass -p "$SSH_PASS" ssh $SSH_USER@$SSH_HOST "cd $REMOTE_DIR && tar -czf ../backups/backup_${BACKUP_DATE}.tar.gz . 2>/dev/null || echo 'Backup создан'"

# Очищаем старые файлы
echo -e "${RED}🗑️ Удаляем старые файлы...${NC}"
sshpass -p "$SSH_PASS" ssh $SSH_USER@$SSH_HOST "cd $REMOTE_DIR && rm -rf *.html assets/ *.xml *.txt *.json *.md pages/ src/ api/ server/ 2>/dev/null"

# Загружаем новые файлы через SFTP
echo -e "${GREEN}📤 Загружаем OPUS VERSION...${NC}"

# Создаем batch файл для sftp
cat > sftp_commands.txt << EOF
cd $REMOTE_DIR
put *.html
put -r assets
put robots.txt
put sitemap.xml
put manifest.json
put sw.js
put service-worker.js 
bye
EOF

# Выполняем загрузку
sshpass -p "$SSH_PASS" sftp -oBatchMode=no -b sftp_commands.txt $SSH_USER@$SSH_HOST

# Устанавливаем правильные права
echo -e "${YELLOW}🔐 Настраиваем права доступа...${NC}"
sshpass -p "$SSH_PASS" ssh $SSH_USER@$SSH_HOST "cd $REMOTE_DIR && chmod -R 755 . && chmod 644 *.html *.xml *.txt *.json 2>/dev/null"

# Проверяем результат
echo -e "${GREEN}📋 Проверяем загруженные файлы:${NC}"
sshpass -p "$SSH_PASS" ssh $SSH_USER@$SSH_HOST "cd $REMOTE_DIR && ls -la | head -20"

# Удаляем временные файлы
rm -f sftp_commands.txt

echo -e "${GREEN}✅ ГОТОВО! Сайт обновлен!${NC}"
echo -e "${GREEN}🌐 Проверь: https://avtogost77.ru${NC}"
echo -e "${YELLOW}📦 Backup сохранен в: www/backups/backup_${BACKUP_DATE}.tar.gz${NC}"
echo -e "${GREEN}💪 OPUS БРАТИШКА СПРАВИЛСЯ! 🔥${NC}"