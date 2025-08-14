#!/bin/bash

# Image Optimization Script
# Сжатие, WebP конвертация, responsive изображения

echo "🖼️ Начинаем оптимизацию изображений..."

# Создаем backup
backup_dir="backup-images-optimization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp -r assets/img "$backup_dir/"
echo "✅ Backup создан: $backup_dir"

# Проверяем наличие инструментов
echo "🔍 Проверяем инструменты..."

# Проверяем ImageMagick
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick найден"
    IMAGEMAGICK_AVAILABLE=true
else
    echo "⚠️ ImageMagick не найден, используем базовые методы"
    IMAGEMAGICK_AVAILABLE=false
fi

# Проверяем cwebp (WebP конвертация)
if command -v cwebp &> /dev/null; then
    echo "✅ WebP конвертер найден"
    WEBP_AVAILABLE=true
else
    echo "⚠️ WebP конвертер не найден, пропускаем WebP"
    WEBP_AVAILABLE=false
fi

# Функция для оптимизации изображения
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    local name="${filename%.*}"
    local dir=$(dirname "$file")
    
    echo "📝 Обрабатываем: $filename"
    
    # Пропускаем уже оптимизированные файлы
    if [[ "$filename" == *"-optimized"* ]] || [[ "$filename" == *".webp" ]]; then
        echo "⏭️ Пропускаем уже оптимизированный файл"
        return
    fi
    
    # Создаем WebP версию если возможно
    if [ "$WEBP_AVAILABLE" = true ] && [[ "$extension" =~ ^(jpg|jpeg|png)$ ]]; then
        local webp_file="$dir/${name}.webp"
        echo "🔄 Создаем WebP версию: ${name}.webp"
        
        if [ "$IMAGEMAGICK_AVAILABLE" = true ]; then
            convert "$file" -quality 85 -strip "$webp_file"
        else
            cwebp -q 85 -m 6 -af -f 50 -sharpness 0 -mt -v "$file" -o "$webp_file"
        fi
        
        # Показываем размеры
        local original_size=$(wc -c < "$file")
        local webp_size=$(wc -c < "$webp_file")
        local savings=$((100 - (webp_size * 100 / original_size)))
        echo "📊 WebP: ${original_size} → ${webp_size} байт (экономия ${savings}%)"
    fi
    
    # Оптимизируем оригинальный файл
    if [ "$IMAGEMAGICK_AVAILABLE" = true ]; then
        echo "🔄 Оптимизируем оригинал..."
        
        case "$extension" in
            jpg|jpeg)
                convert "$file" -quality 85 -strip -interlace Plane "$file"
                ;;
            png)
                convert "$file" -strip -interlace Plane "$file"
                ;;
            gif)
                convert "$file" -strip -layers optimize "$file"
                ;;
        esac
    fi
    
    echo "✅ Обработано: $filename"
}

# Функция для создания responsive изображений
create_responsive_images() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    local name="${filename%.*}"
    local dir=$(dirname "$file")
    
    # Только для основных изображений
    if [[ "$filename" == "hero-logistics"* ]] || [[ "$filename" == "logo"* ]]; then
        echo "📱 Создаем responsive версии для: $filename"
        
        if [ "$IMAGEMAGICK_AVAILABLE" = true ]; then
            # Мобильная версия (768px)
            convert "$file" -resize 768x -quality 85 -strip "$dir/${name}-mobile.$extension"
            
            # Планшетная версия (1024px)
            convert "$file" -resize 1024x -quality 85 -strip "$dir/${name}-tablet.$extension"
            
            # WebP версии
            if [ "$WEBP_AVAILABLE" = true ]; then
                convert "$file" -resize 768x -quality 85 -strip "$dir/${name}-mobile.webp"
                convert "$file" -resize 1024x -quality 85 -strip "$dir/${name}-tablet.webp"
            fi
        fi
    fi
}

# Обрабатываем все изображения
echo "🔄 Обрабатываем изображения..."

find assets/img -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) | while read -r file; do
    optimize_image "$file"
    create_responsive_images "$file"
done

# Создаем отчет о размерах
echo ""
echo "📊 Отчет о размерах изображений:"
echo "================================"

find assets/img -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | while read -r file; do
    size=$(wc -c < "$file")
    filename=$(basename "$file")
    echo "$filename: ${size} байт"
done | sort -k2 -n

echo ""
echo "✅ Оптимизация изображений завершена!"
echo "📝 Следующий шаг: обновить HTML для использования WebP"
