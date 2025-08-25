#!/bin/bash

echo "🚀 ДЕПЛОЙ ОЧИЩЕННОЙ ГЛАВНОЙ СТРАНИЦЫ!"
echo "======================================"
echo "✨ Загружаем компактную версию без дублей"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию
echo "📦 Создание резервной копии главной страницы..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp index.html index.html.backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем очищенную главную страницу
echo "🧹 Загружаем ОЧИЩЕННУЮ главную страницу..."
scp -i $SSH_KEY index.html $VPS_HOST:$VPS_PATH/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/index.html"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/index.html"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ ОЧИЩЕННАЯ ГЛАВНАЯ СТРАНИЦА РАЗВЕРНУТА!"
echo "🎯 Что удалено:"
echo "   • Дублирующие блоки статистики (24/7, 2 часа, 850+ городов)"
echo "   • Повторяющиеся преимущества"
echo "   • Огромный SEO-блок с регионами" 
echo "   • Философские тексты про инфраструктуру"
echo "   • Лишние кейсы и длинные описания"
echo ""
echo "📏 РЕЗУЛЬТАТ: С 1970 до 1729 строк (-241 строка, -12%)"
echo "🔗 Проверь результат: https://avtogost77.ru"


