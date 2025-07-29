#!/bin/bash

# 🚀 СКРИПТ СИНХРОНИЗАЦИИ С VPS
# Синхронизирует репозиторий с VPS, удаляя лишние файлы

echo "🚀 Начинаем синхронизацию с VPS..."
echo "=================================="

# Конфигурация
VPS_HOST="root@5378159-xv69554"  # Твой VPS
VPS_PATH="/var/www/avtogost77"
REPO_URL="https://github.com/avtogost77-gif/AvtoGOST77-modern.git"

# Команды для выполнения на VPS
COMMANDS='
cd '"$VPS_PATH"' || exit 1

echo "📍 Текущая директория: $(pwd)"
echo "📊 Статус до синхронизации:"
git status --short

echo -e "\n🔄 Получаем последние изменения..."
git fetch origin main

echo -e "\n🧹 Сбрасываем локальные изменения..."
git reset --hard origin/main

echo -e "\n🗑️ Удаляем неотслеживаемые файлы..."
# Сначала показываем что будет удалено
echo "Будут удалены:"
git clean -fdn
# Затем удаляем
git clean -fd

echo -e "\n✅ Синхронизация завершена!"
echo "📊 Финальный статус:"
git status --short
git log --oneline -1

echo -e "\n📁 Количество HTML файлов:"
find . -name "*.html" -type f | wc -l
'

# Выполняем команды на VPS
echo "🔐 Подключаемся к VPS..."
ssh $VPS_HOST "$COMMANDS"

if [ $? -eq 0 ]; then
    echo -e "\n✅ Синхронизация успешно завершена!"
else
    echo -e "\n❌ Ошибка при синхронизации!"
    exit 1
fi

echo -e "\n💡 Совет: Добавьте этот скрипт в GitHub Actions для автоматической синхронизации!"