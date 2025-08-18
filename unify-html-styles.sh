#!/bin/bash

# 🎯 МАССОВОЕ ОБНОВЛЕНИЕ HTML СТРАНИЦ
# Заменяем все CSS ссылки на единый мастер файл

echo "🚀 Начинаем унификацию HTML страниц..."

# Создаем бэкап перед изменениями
echo "📦 Создаем backup..."
mkdir -p backup-before-unification
cp *.html backup-before-unification/ 2>/dev/null || true

# Список всех HTML файлов (исключаем тестовые и бэкапы)
find . -name "*.html" -not -path "./backup*" -not -path "./test*" -not -path "./backups*" > html_files.txt

echo "📋 Найдено HTML файлов для обновления:"
wc -l html_files.txt

# Новый блок CSS для вставки
NEW_CSS_BLOCK='    <!-- ЕДИНАЯ СИСТЕМА СТИЛЕЙ АВТОГОСТ77 -->
    <link rel="stylesheet" href="assets/css/master/master-styles.min.css?v=20250818">
    
    <!-- AOS АНИМАЦИИ -->
    <link rel="stylesheet" href="assets/css/vendor/aos.min.css">
    
    <!-- VENDOR СТИЛИ -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'

# Обрабатываем каждый HTML файл
while IFS= read -r file; do
    echo "🔄 Обрабатываем: $file"
    
    # Создаем временный файл
    temp_file=$(mktemp)
    
    # Читаем файл построчно и заменяем CSS блок
    in_head=false
    css_block_inserted=false
    
    while IFS= read -r line; do
        # Определяем начало head
        if [[ $line == *"<head>"* ]]; then
            in_head=true
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Определяем конец head
        if [[ $line == *"</head>"* ]]; then
            # Вставляем наш CSS блок перед закрытием head (если еще не вставили)
            if [[ $in_head == true && $css_block_inserted == false ]]; then
                echo "$NEW_CSS_BLOCK" >> "$temp_file"
                css_block_inserted=true
            fi
            in_head=false
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Пропускаем старые CSS ссылки в head
        if [[ $in_head == true ]]; then
            if [[ $line == *"<link rel=\"stylesheet\""* ]] || \
               [[ $line == *"<link rel=\"preload\""* && $line == *".css"* ]] || \
               [[ $line == *"<noscript><link rel=\"stylesheet\""* ]] || \
               [[ $line == *"<!-- КРИТИЧЕСКИЙ"* ]] || \
               [[ $line == *"<!-- НЕКРИТИЧЕСКИЙ"* ]] || \
               [[ $line == *"<!-- ОПТИМИЗИРОВАННЫЕ"* ]] || \
               [[ $line == *"<!-- РЕДИЗАЙН"* ]] || \
               [[ $line == *"<!-- ЕДИНЫЕ СТИЛИ"* ]]; then
                # Пропускаем эту строку (удаляем старые CSS)
                continue
            fi
            
            # Вставляем наш CSS блок после мета-тегов, перед первым не-мета элементом
            if [[ $css_block_inserted == false && ! $line == *"<meta"* && ! $line == *"<title"* && $line != *"charset"* && $line != *"viewport"* ]]; then
                echo "$NEW_CSS_BLOCK" >> "$temp_file"
                css_block_inserted=true
            fi
        fi
        
        # Добавляем обычные строки
        echo "$line" >> "$temp_file"
        
    done < "$file"
    
    # Заменяем оригинальный файл
    mv "$temp_file" "$file"
    
done < html_files.txt

echo "✅ Все HTML файлы обновлены!"

# Проверяем несколько ключевых файлов
echo "🔍 Проверяем результат на ключевых файлах:"
echo "index.html:"
grep -n "master-styles" index.html || echo "❌ Не найдено"

echo "services.html:"
grep -n "master-styles" services.html || echo "❌ Не найдено"

echo "gruzoperevozki-spb.html:"
grep -n "master-styles" gruzoperevozki-spb.html || echo "❌ Не найдено"

# Очистка
rm html_files.txt

echo "🎉 Унификация HTML завершена!"
echo "📁 Backup создан в: backup-before-unification/"
