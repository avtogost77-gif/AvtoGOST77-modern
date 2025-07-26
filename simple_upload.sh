#!/bin/bash
echo "🚀 Загружаю сайт на FTP..."

# Простая загрузка через curl
curl -T index.html ftp://31.31.197.43/ --user u3207373:fGX954fqGU2w3ruY
curl -T "assets/css/main.css" ftp://31.31.197.43/assets/css/ --user u3207373:fGX954fqGU2w3ruY --ftp-create-dirs
curl -T "assets/js/main.js" ftp://31.31.197.43/assets/js/ --user u3207373:fGX954fqGU2w3ruY --ftp-create-dirs

echo "✅ Загрузка завершена!"