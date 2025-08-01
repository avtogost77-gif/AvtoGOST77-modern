#!/bin/bash

echo "🔧 БЫСТРЫЕ ФИКСЫ ДЛЯ САЙТА"

# 1. Отключаем фуру (комментируем все блоки с truck-animation)
echo "🚚 Отключаем фуру..."
sed -i '/<div class="truck-animation-container"/,/<\/div>$/s/^/<!-- /' index.html
sed -i '/<div class="truck-animation-container"/,/<\/div>$/s/$/ -->/' index.html

# Или проще - скрываем через стиль
sed -i 's/<div class="truck-animation-container"/<div class="truck-animation-container" style="display:none;"/' index.html

# 2. Убираем дубликаты скриптов
echo "🧹 Убираем дубликаты..."
# Оставляем только первое вхождение telegram-sender.js
awk '!seen[$0]++ || !/telegram-sender.js/' index.html > index.tmp && mv index.tmp index.html

# 3. Создаем logo.png если нет
echo "🖼️ Создаем logo.png..."
if [ ! -f assets/img/logo.png ]; then
    cd assets/img/
    ln -s icon.svg logo.png
    cd ../..
fi

# 4. Фиксим калькулятор - убираем обязательность объема
echo "🧮 Фиксим калькулятор..."
sed -i 's/required//g' assets/js/calc.js

echo "✅ ВСЕ ГОТОВО!"
echo ""
echo "Теперь делай:"
echo "1. git add -A"
echo "2. git commit -m '🔧 Быстрые фиксы: отключил фуру, починил калькулятор'"
echo "3. git push origin main"