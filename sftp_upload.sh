#!/bin/bash
echo "🚀 Загружаю через SFTP..."

# Загружаем основные файлы через SFTP
sftp -o ConnectTimeout=30 -o StrictHostKeyChecking=no u3207373@31.31.197.43 << EOF
put index.html
mkdir assets
mkdir assets/css
mkdir assets/js
put assets/css/main.css assets/css/
put assets/js/main.js assets/js/
bye
EOF

echo "✅ SFTP загрузка завершена!"