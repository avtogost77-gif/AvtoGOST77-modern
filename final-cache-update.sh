#!/bin/bash
echo "🚀 ФИНАЛЬНОЕ ОБНОВЛЕНИЕ КЭША - ПОЛНОЕ ВОССТАНОВЛЕНИЕ САЙТА"
echo "📝 Обновляем версии всех файлов..."
find . -name "*.css" -exec sed -i "s/v=202508[0-9]*/v=20250831-final-restore/g" {} \;
find . -name "*.html" -exec sed -i "s/v=202508[0-9]*/v=20250831-final-restore/g" {} \;
find . -name "*.js" -exec sed -i "s/v=202508[0-9]*/v=20250831-final-restore/g" {} \;
echo "✅ Все версии обновлены!"
echo "🔄 Теперь обнови страницу в браузере с Ctrl+F5"
