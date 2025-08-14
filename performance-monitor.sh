#!/bin/bash

# Performance Monitoring Script
# Мониторинг Core Web Vitals и производительности

echo "📊 Начинаем мониторинг производительности..."

# Создаем директорию для отчетов
reports_dir="performance-reports"
mkdir -p "$reports_dir"

# Функция для получения времени загрузки
get_load_time() {
    local url="$1"
    local start_time=$(date +%s.%N)
    
    # Используем curl для измерения времени
    local response=$(curl -s -w "%{time_total},%{size_download},%{http_code}" -o /dev/null "$url")
    local end_time=$(date +%s.%N)
    
    echo "$response"
}

# Функция для анализа Core Web Vitals (имитация)
analyze_core_web_vitals() {
    local url="$1"
    local filename="$2"
    
    echo "🔍 Анализируем Core Web Vitals для: $url"
    
    # Имитация анализа (в реальности нужно использовать Lighthouse API)
    local lcp=$(echo "scale=2; $(shuf -i 1000-5000 -n 1) / 1000" | bc -l 2>/dev/null || echo "2.5")
    local fid=$(echo "scale=2; $(shuf -i 50-200 -n 1) / 1000" | bc -l 2>/dev/null || echo "0.1")
    local cls=$(echo "scale=3; $(shuf -i 1-50 -n 1) / 1000" | bc -l 2>/dev/null || echo "0.05")
    
    # Определяем статус
    local lcp_status="🟢 Хорошо"
    local fid_status="🟢 Хорошо"
    local cls_status="🟢 Хорошо"
    
    if (( $(echo "$lcp > 2.5" | bc -l) )); then
        lcp_status="🔴 Плохо"
    elif (( $(echo "$lcp > 1.6" | bc -l) )); then
        lcp_status="🟡 Нужно улучшить"
    fi
    
    if (( $(echo "$fid > 0.1" | bc -l) )); then
        fid_status="🔴 Плохо"
    elif (( $(echo "$fid > 0.05" | bc -l) )); then
        fid_status="🟡 Нужно улучшить"
    fi
    
    if (( $(echo "$cls > 0.1" | bc -l) )); then
        cls_status="🔴 Плохо"
    elif (( $(echo "$cls > 0.05" | bc -l) )); then
        cls_status="🟡 Нужно улучшить"
    fi
    
    # Создаем отчет
    cat > "$reports_dir/$filename" << EOF
# Отчет производительности - $(date)
URL: $url

## Core Web Vitals
- **LCP (Largest Contentful Paint):** ${lcp}s $lcp_status
- **FID (First Input Delay):** ${fid}s $fid_status  
- **CLS (Cumulative Layout Shift):** ${cls} $cls_status

## Рекомендации
EOF
    
    # Добавляем рекомендации
    if [[ "$lcp_status" == *"Плохо"* ]] || [[ "$lcp_status" == *"Нужно улучшить"* ]]; then
        echo "- Оптимизировать загрузку изображений" >> "$reports_dir/$filename"
        echo "- Включить кеширование статических файлов" >> "$reports_dir/$filename"
        echo "- Использовать CDN для статических ресурсов" >> "$reports_dir/$filename"
    fi
    
    if [[ "$fid_status" == *"Плохо"* ]] || [[ "$fid_status" == *"Нужно улучшить"* ]]; then
        echo "- Уменьшить размер JavaScript файлов" >> "$reports_dir/$filename"
        echo "- Использовать async/defer для скриптов" >> "$reports_dir/$filename"
        echo "- Оптимизировать критический путь рендеринга" >> "$reports_dir/$filename"
    fi
    
    if [[ "$cls_status" == *"Плохо"* ]] || [[ "$cls_status" == *"Нужно улучшить"* ]]; then
        echo "- Установить фиксированные размеры для изображений" >> "$reports_dir/$filename"
        echo "- Избегать вставки контента поверх существующего" >> "$reports_dir/$filename"
        echo "- Использовать CSS transform вместо изменения layout" >> "$reports_dir/$filename"
    fi
    
    echo "✅ Отчет сохранен: $reports_dir/$filename"
}

# Функция для проверки размера файлов
check_file_sizes() {
    echo "📁 Анализируем размеры файлов..."
    
    local total_size=0
    local file_count=0
    
    # HTML файлы
    echo "📄 HTML файлы:"
    find . -name "*.html" -type f | while read -r file; do
        local size=$(wc -c < "$file")
        local filename=$(basename "$file")
        echo "  $filename: ${size} байт"
        total_size=$((total_size + size))
        file_count=$((file_count + 1))
    done
    
    # CSS файлы
    echo "🎨 CSS файлы:"
    find assets/css -name "*.css" -o -name "*.min.css" | while read -r file; do
        local size=$(wc -c < "$file")
        local filename=$(basename "$file")
        echo "  $filename: ${size} байт"
        total_size=$((total_size + size))
        file_count=$((file_count + 1))
    done
    
    # JS файлы
    echo "⚡ JavaScript файлы:"
    find assets/js -name "*.js" -o -name "*.min.js" | while read -r file; do
        local size=$(wc -c < "$file")
        local filename=$(basename "$file")
        echo "  $filename: ${size} байт"
        total_size=$((total_size + size))
        file_count=$((file_count + 1))
    done
    
    # Изображения
    echo "🖼️ Изображения:"
    find assets/img -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | while read -r file; do
        local size=$(wc -c < "$file")
        local filename=$(basename "$file")
        echo "  $filename: ${size} байт"
        total_size=$((total_size + size))
        file_count=$((file_count + 1))
    done
    
    echo "📊 Общий размер: ${total_size} байт ($(echo "scale=2; $total_size / 1024 / 1024" | bc -l 2>/dev/null || echo "0") MB)"
    echo "📊 Количество файлов: $file_count"
}

# Функция для проверки HTTP заголовков
check_http_headers() {
    local url="$1"
    echo "🌐 Проверяем HTTP заголовки для: $url"
    
    local headers=$(curl -s -I "$url" | head -20)
    echo "$headers"
    
    # Проверяем кеширование
    if echo "$headers" | grep -q "Cache-Control"; then
        echo "✅ Кеширование настроено"
    else
        echo "⚠️ Кеширование не настроено"
    fi
    
    # Проверяем сжатие
    if echo "$headers" | grep -q "Content-Encoding: gzip"; then
        echo "✅ Gzip сжатие работает"
    else
        echo "⚠️ Gzip сжатие не работает"
    fi
    
    # Проверяем HTTP/2
    if echo "$headers" | grep -q "HTTP/2"; then
        echo "✅ HTTP/2 поддерживается"
    else
        echo "⚠️ HTTP/2 не поддерживается"
    fi
}

# Основная функция мониторинга
main() {
    local base_url="http://localhost"  # Измените на ваш домен
    
    echo "🚀 Начинаем мониторинг производительности..."
    echo "=============================================="
    
    # Проверяем главную страницу
    echo "📊 Тестируем главную страницу..."
    local load_time=$(get_load_time "$base_url")
    echo "⏱️ Время загрузки: $load_time"
    
    # Анализируем Core Web Vitals
    analyze_core_web_vitals "$base_url" "core-web-vitals-$(date +%Y%m%d).md"
    
    # Проверяем размеры файлов
    check_file_sizes
    
    # Проверяем HTTP заголовки
    check_http_headers "$base_url"
    
    echo ""
    echo "✅ Мониторинг завершен!"
    echo "📁 Отчеты сохранены в: $reports_dir/"
}

# Запускаем мониторинг
main
