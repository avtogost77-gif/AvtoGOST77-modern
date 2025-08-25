#!/bin/bash

# Скрипт для исправления поврежденных HTML файлов (отсутствующий тег </body>)

echo "🔄 Исправление поврежденных HTML файлов..."

for file in $(find . -maxdepth 1 -name "*.html"); do
    echo "Проверка $file..."

    # Проверяем, есть ли закрывающий тег </body>
    if ! grep -q "</body>" "$file"; then
        echo "🔧 Исправляем $file - добавляем </body>"

        # Добавляем </body> перед </html>
        sed -i '/<\/html>/i\
</body>' "$file"

        echo "✅ Исправлен $file"
    else
        echo "✅ $file в порядке"
    fi
done

echo "🎉 Все файлы проверены и исправлены!"

