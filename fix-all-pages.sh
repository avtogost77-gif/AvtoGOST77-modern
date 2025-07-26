#!/bin/bash
echo "🔧 ИСПРАВЛЯЮ ВСЕ СТРАНИЦЫ САЙТА..."

# Список HTML файлов для обновления (исключаем index.html - он уже обновлен)
FILES=(
    "about.html"
    "news.html" 
    "moscow-regions.html"
    "blog-2-wildberries-delivery.html"
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
    "marketplace-delivery.html"
    "urgent-delivery.html"
    "privacy.html"
)

# Функция добавления единых стилей в header
add_common_styles() {
    local file=$1
    echo "  📝 Обновляю стили в $file"
    
    # Проверяем есть ли уже наши стили
    if ! grep -q "emergency-mobile-fix.css" "$file"; then
        # Находим строку с styles.css и добавляем наши стили перед ней
        sed -i '/assets\/css\/styles.css/i\
  <!-- ЕДИНЫЕ СТИЛИ ДЛЯ ВСЕХ СТРАНИЦ -->\
  <link rel="stylesheet" href="assets/css/emergency-mobile-fix.css">\
  <link rel="stylesheet" href="assets/css/main.css">\
  <link rel="stylesheet" href="assets/css/mobile.css">' "$file"
        
        # Добавляем конфигурацию DaData
        sed -i '/assets\/css\/styles.css/a\
  \
  <!-- DADATA API CONFIGURATION -->\
  <script src="dadata-config.js"></script>' "$file"
    fi
}

# Функция добавления единых JS модулей в footer
add_common_scripts() {
    local file=$1
    echo "  🔧 Обновляю скрипты в $file"
    
    # Проверяем есть ли уже наши скрипты
    if ! grep -q "emergency-fix.js" "$file"; then
        # Находим строку с main.js и добавляем наши модули перед ней
        sed -i '/assets\/js\/main.js/i\
  <!-- ЕДИНЫЕ JS МОДУЛИ ДЛЯ ВСЕХ СТРАНИЦ -->\
  <script src="assets/js/emergency-fix.js"></script>\
  <script src="assets/js/fias-integration.js"></script>\
  <script src="assets/js/form-handler.js"></script>' "$file"
    fi
}

# Обрабатываем каждый файл
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🔧 Обрабатываю $file..."
        add_common_styles "$file"
        add_common_scripts "$file"
        echo "✅ $file обновлен!"
    else
        echo "⚠️ Файл $file не найден, пропускаю"
    fi
done

echo ""
echo "🎉 ВСЕ СТРАНИЦЫ ОБНОВЛЕНЫ!"
echo "✅ Добавлены единые CSS модули"
echo "✅ Добавлены единые JS модули" 
echo "✅ Подключена DaData конфигурация"
echo ""
echo "🚀 САЙТ ГОТОВ К ДЕПЛОЮ!"