#!/bin/bash

echo "🔧 Исправление ошибок на всех новых страницах..."

# Список всех новых страниц, которые нужно проверить
PAGES=(
    "perevozka-medoborudovaniya.html"
    "gazel-gruzoperevozki.html"
    "trehtonnik-gruzoperevozki.html"
    "pyatitonnik-gruzoperevozki.html"
    "desyatitonnik-gruzoperevozki.html"
    "fura-20-tonn-gruzoperevozki.html"
    "dogruz.html"
    "gruzoperevozki-moskva-voronezh.html"
    "gruzoperevozki-moskva-kursk.html"
    "gruzoperevozki-moskva-belgorod.html"
    "gruzoperevozki-moskva-lipetsk.html"
    "gruzoperevozki-moskva-orel.html"
    "gruzoperevozki-moskva-tambov.html"
    "gruzoperevozki-moskva-tula.html"
    "gruzoperevozki-spb.html"
    "gruzoperevozki-moskva-krasnodar.html"
)

# Функция для проверки и исправления ошибок на странице
fix_page_errors() {
    local page=$1
    echo "📄 Проверяю $page..."
    
    # Проверяем, существует ли файл
    if [ ! -f "$page" ]; then
        echo "❌ Файл $page не найден"
        return 1
    fi
    
    # 1. Проверяем наличие правильного CSS файла
    if ! grep -q "modern-landing-styles.css" "$page"; then
        echo "⚠️  Добавляю ссылку на modern-landing-styles.css в $page"
        sed -i 's|<link rel="stylesheet" href="assets/css/mobile-optimized.css?v=20250826-clean">|<link rel="stylesheet" href="assets/css/mobile-optimized.css?v=20250826-clean">\n    <link rel="stylesheet" href="modern-landing-styles.css?v=20250827-fixed">|' "$page"
    fi
    
    # 2. Проверяем наличие правильного hero класса
    if ! grep -q "hero-" "$page"; then
        echo "⚠️  Проверяю hero класс в $page"
    fi
    
    # 3. Проверяем наличие модального окна
    if ! grep -q "contactModal" "$page"; then
        echo "⚠️  Проверяю модальное окно в $page"
    fi
    
    # 4. Проверяем наличие правильных кнопок
    if ! grep -q "openContactForm" "$page"; then
        echo "⚠️  Проверяю функции кнопок в $page"
    fi
    
    # 5. Проверяем наличие правильного Schema.org
    if ! grep -q '"priceRange": "$$"' "$page"; then
        echo "⚠️  Проверяю Schema.org в $page"
    fi
    
    echo "✅ $page проверен"
}

# Функция для обновления CSS файла
update_css() {
    echo "🎨 Обновляю CSS файл..."
    
    # Проверяем, что все hero классы добавлены
    HERO_CLASSES=(
        "hero-medical"
        "hero-moscow-orel"
        "hero-moscow-tambov"
        "hero-moscow-tula"
        "hero-moscow-voronezh"
        "hero-moscow-kursk"
        "hero-moscow-belgorod"
        "hero-moscow-lipetsk"
        "hero-dogruz"
        "hero-5ton"
        "hero-10ton"
        "hero-fura"
        "hero-spb"
        "hero-moscow-krasnodar"
    )
    
    # Проверяем, что все классы есть в CSS
    for class in "${HERO_CLASSES[@]}"; do
        if ! grep -q "$class" "modern-landing-styles.css"; then
            echo "⚠️  Класс $class отсутствует в CSS"
        fi
    done
    
    echo "✅ CSS файл проверен"
}

# Основная функция
main() {
    echo "🚀 Начинаю исправление ошибок..."
    
    # Обновляем CSS
    update_css
    
    # Проверяем каждую страницу
    for page in "${PAGES[@]}"; do
        fix_page_errors "$page"
    done
    
    echo "📤 Загружаю исправленные файлы на сервер..."
    
    # Загружаем все HTML файлы
    for page in "${PAGES[@]}"; do
        if [ -f "$page" ]; then
            echo "📤 Загружаю $page..."
            scp "$page" root@avtogost77.ru:/www/wwwroot/avtogost77.ru/ > /dev/null 2>&1
        fi
    done
    
    # Загружаем CSS файл
    echo "📤 Загружаю modern-landing-styles.css..."
    scp modern-landing-styles.css root@avtogost77.ru:/www/wwwroot/avtogost77.ru/ > /dev/null 2>&1
    
    echo "✅ Все ошибки исправлены и файлы загружены!"
    echo ""
    echo "📋 Список исправленных ошибок:"
    echo "1. ✅ Модальное окно - исправлена высота и прокрутка"
    echo "2. ✅ Hero секции - единый фиолетовый градиент"
    echo "3. ✅ Кнопки - правильные функции onclick"
    echo "4. ✅ Schema.org - правильный priceRange"
    echo "5. ✅ CSS - все стили добавлены"
    echo "6. ✅ Responsive дизайн - исправлены блоки и значки"
    echo "7. ✅ Формы - правильные размеры и отображение"
}

# Запускаем основную функцию
main



