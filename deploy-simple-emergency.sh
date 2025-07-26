#!/bin/bash

echo "🚨 ПРОСТОЙ EMERGENCY DEPLOY"
echo "=========================="

# SSH данные
SSH_HOST="31.31.197.43"
SSH_USER="u3207373"
SSH_PASS="5x8cZ19H0rWhh6Qt"
REMOTE_DIR="www/avtogost77.ru"

echo "📤 Загрузка экстренных исправлений..."

# Создаем SFTP скрипт
cat > emergency_batch.txt << 'EOF'
cd www/avtogost77.ru
put assets/css/emergency-mobile-fix.css assets/css/
put assets/js/emergency-fix.js assets/js/
put index.html
quit
EOF

echo "🔄 Выполнение SFTP..."
if command -v sshpass &> /dev/null; then
    sshpass -p "$SSH_PASS" sftp -o StrictHostKeyChecking=no -b emergency_batch.txt $SSH_USER@$SSH_HOST
else
    echo "⚠️ Запустите вручную:"
    echo "sftp $SSH_USER@$SSH_HOST"
    echo "Пароль: $SSH_PASS"
    cat emergency_batch.txt
fi

# Очистка
rm -f emergency_batch.txt

echo ""
echo "✅ EMERGENCY FIX ОТПРАВЛЕН!"
echo "🧪 Тестируйте: https://avtogost77.ru"