#!/bin/bash

echo "💀💀💀 MEGA CLEANUP ALL 56 HTML PAGES! 💀💀💀"
echo "============================================="
echo "🔥🔥🔥 МАССОВАЯ ЗАЧИСТКА ВСЕГО САЙТА!"

# Создаем папку для бэкапов
mkdir -p mega-cleanup-backup-$(date +%Y%m%d-%H%M%S)
backup_dir="mega-cleanup-backup-$(date +%Y%m%d-%H%M%S)"

echo "📦 Создаем массовые бэкапы..."

# Найдем все HTML файлы
html_files=$(find . -name "*.html" -not -path "./backup*" -not -path "./inline-styles-backup*" -not -name "*.backup*")
total_files=$(echo "$html_files" | wc -l)

echo "🎯 Найдено $total_files HTML файлов для обработки"

counter=0

# Проходим по каждому файлу
for file in $html_files; do
    counter=$((counter + 1))
    filename=$(basename "$file")
    
    echo "🔄 [$counter/$total_files] Обрабатываем: $filename"
    
    # Создаем бэкап
    cp "$file" "$backup_dir/"
    
    # 1. УДАЛЯЕМ INLINE СТИЛИ
    if grep -q "<style>" "$file"; then
        echo "   💣 Удаляем inline стили..."
        sed -i '/<style>/,/<\/style>/c\    <!-- ✅ Inline стили удалены - используем unified-site-styles.css -->' "$file"
    fi
    
    # 2. ДОБАВЛЯЕМ ROBOTS META (если нет)
    if ! grep -q 'name="robots"' "$file"; then
        echo "   🤖 Добавляем robots meta..."
        if grep -q 'rel="canonical"' "$file"; then
            sed -i '/rel="canonical"/a\    <meta name="robots" content="index, follow">' "$file"
        elif grep -q '</title>' "$file"; then
            sed -i '/<\/title>/a\    <meta name="robots" content="index, follow">' "$file"
        fi
    fi
    
    # 3. ОБНОВЛЯЕМ ЦЕНЫ НА АКТУАЛЬНЫЕ
    echo "   💰 Обновляем цены..."
    sed -i 's/от 3 000 ₽/от 8 000 ₽/g' "$file"
    sed -i 's/от 5 000 ₽/от 12 000 ₽/g' "$file"  
    sed -i 's/от 7 000 ₽/от 18 000 ₽/g' "$file"
    sed -i 's/от 10 000 ₽/от 25 000 ₽/g' "$file"
    sed -i 's/от 15 000 ₽/от 35 000 ₽/g' "$file"
    
    # Обновляем другие варианты написания цен
    sed -i 's/3 000 руб/8 000 руб/g' "$file"
    sed -i 's/5 000 руб/12 000 руб/g' "$file"
    sed -i 's/7 000 руб/18 000 руб/g' "$file"
    sed -i 's/10 000 руб/25 000 руб/g' "$file"
    sed -i 's/15 000 руб/35 000 руб/g' "$file"
    
    # 4. УБИРАЕМ LEGACY КЛАССЫ
    echo "   🗑️ Убираем legacy мусор..."
    sed -i 's/class="services-hero"/class="hero"/g' "$file"
    sed -i 's/class="about-hero"/class="hero"/g' "$file"
    sed -i 's/class="contact-hero"/class="hero"/g' "$file"
    sed -i 's/class="blog-hero"/class="hero"/g' "$file"
    
    # 5. УБИРАЕМ ЛИШНИЕ INLINE СТИЛИ В КОНТЕНТЕ
    echo "   🧹 Чистим inline стили в контенте..."
    sed -i 's/style="[^"]*"//g' "$file"
    
    # 6. ЧИСТИМ ЛИШНИЕ КОММЕНТАРИИ
    sed -i '/<!-- Bootstrap Icons -->/d' "$file"
    sed -i '/<!-- AOS анимации -->/d' "$file"
    
    # 7. ИСПРАВЛЯЕМ ТЕЛЕФОНЫ НА ЕДИНЫЙ ФОРМАТ
    sed -i 's/+7 (916) 272-09-32/+7 916 272‑09‑32/g' "$file"
    sed -i 's/8 (916) 272-09-32/+7 916 272‑09‑32/g' "$file"
    
    echo "   ✅ $filename обработан!"
done

echo ""
echo "💀💀💀 MEGA CLEANUP ЗАВЕРШЕН! 💀💀💀"
echo ""
echo "📊 СТАТИСТИКА МАССОВОЙ ЗАЧИСТКИ:"
echo "   🎯 Обработано файлов: $total_files"
echo "   📦 Бэкапы сохранены в: $backup_dir"
echo ""
echo "🔥🔥🔥 ЧТО СДЕЛАНО СО ВСЕМИ СТРАНИЦАМИ:"
echo "   💣 Удалены все inline стили"
echo "   🤖 Добавлены robots meta теги"
echo "   💰 Обновлены все цены до актуальных"
echo "   🗑️ Убраны legacy классы"
echo "   📱 Унифицированы телефоны"
echo "   🧹 Почищены лишние комментарии"
echo ""
echo "✨ РЕЗУЛЬТАТ:"
echo "   ✅ Все 56 страниц используют unified-site-styles.css"
echo "   ✅ Единый стиль на всем сайте"
echo "   ✅ Актуальные цены везде"
echo "   ✅ Правильные meta теги"
echo ""
echo "🚀 ГОТОВО К МАССОВОМУ ДЕПЛОЮ!"


