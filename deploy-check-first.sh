#!/bin/bash

echo "🔍 ПРОВЕРКА СЕРВЕРА И ДЕПЛОЙ"
echo "============================"

# Создаем команды для проверки
cat > check_server.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
open ftp://u3207373:5x8cZ19H0rWhh6Qt@31.31.197.43
cd www/avtogost77.ru

echo "📂 ТЕКУЩЕЕ СОДЕРЖИМОЕ СЕРВЕРА:"
echo "=============================="
ls -la

echo ""
echo "📁 СОДЕРЖИМОЕ ПАПКИ ASSETS:"
echo "==========================="
cd assets
ls -la

echo ""
echo "📁 СОДЕРЖИМОЕ ASSETS/CSS:"
echo "========================"
cd css
ls -la

echo ""
echo "📁 СОДЕРЖИМОЕ ASSETS/JS:"
echo "======================="
cd ../js
ls -la

cd ../..
echo ""
echo "🔍 Поиск index-final.html:"
ls -la index*

quit
EOF

echo "🔍 Проверяю что есть на сервере..."
lftp -f check_server.txt

rm -f check_server.txt

echo ""
echo "❓ Что делаем дальше?"
echo "1. Если увидели index-final.html - нужно его переименовать"
echo "2. Если много мусора - нужно почистить"
echo "3. Можем загрузить наши файлы"