#!/bin/bash

# Скрипт для объединения и минификации CSS и JS файлов
# Версия: 1.0.0 - 2025-08-16

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Оптимизация ресурсов сайта ===${NC}"
echo -e "${YELLOW}Начало процесса оптимизации...${NC}"

# Создаем директории для объединенных файлов, если они не существуют
mkdir -p assets/css/dist
mkdir -p assets/js/dist

# Функция для проверки наличия утилиты
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Ошибка: $1 не установлен. Установите его с помощью npm install -g $1${NC}"
        exit 1
    fi
}

# Проверяем наличие необходимых утилит
check_command uglifyjs
check_command cleancss

echo -e "${YELLOW}Проверка зависимостей завершена. Начинаем объединение файлов...${NC}"

# Объединение и минификация CSS файлов оптимизации
echo -e "${BLUE}Объединение CSS файлов оптимизации...${NC}"

cat assets/css/redesign-fixes.css \
    assets/css/header-optimization.css \
    assets/css/hero-optimization.css \
    assets/css/calculator-optimization.css \
    assets/css/benefits-optimization.css \
    assets/css/form-optimization.css \
    assets/css/visual-hierarchy.css \
    assets/css/social-proof.css \
    assets/css/footer-optimization.css > assets/css/dist/optimizations.css

echo -e "${GREEN}CSS файлы оптимизации объединены в assets/css/dist/optimizations.css${NC}"

# Минификация объединенного CSS файла оптимизации
echo -e "${BLUE}Минификация объединенного CSS файла оптимизации...${NC}"
cleancss -o assets/css/dist/optimizations.min.css assets/css/dist/optimizations.css

echo -e "${GREEN}CSS файл оптимизации минифицирован в assets/css/dist/optimizations.min.css${NC}"

# Объединение и минификация JS файлов оптимизации
echo -e "${BLUE}Объединение JS файлов оптимизации...${NC}"

cat assets/js/header-interactions.js \
    assets/js/hero-animations.js \
    assets/js/benefits-animations.js \
    assets/js/form-handler-enhanced.js \
    assets/js/page-navigation.js \
    assets/js/testimonials-slider.js \
    assets/js/footer-interactions.js > assets/js/dist/optimizations.js

echo -e "${GREEN}JS файлы оптимизации объединены в assets/js/dist/optimizations.js${NC}"

# Минификация объединенного JS файла оптимизации
echo -e "${BLUE}Минификация объединенного JS файла оптимизации...${NC}"
uglifyjs assets/js/dist/optimizations.js -o assets/js/dist/optimizations.min.js -c -m

echo -e "${GREEN}JS файл оптимизации минифицирован в assets/js/dist/optimizations.min.js${NC}"

# Объединение и минификация существующих JS файлов
echo -e "${BLUE}Объединение существующих JS файлов...${NC}"

cat assets/js/ux-improvements.js \
    assets/js/tldr-toc.js \
    assets/js/calculator-ui-enhanced.js > assets/js/dist/enhanced-features.js

echo -e "${GREEN}Существующие JS файлы объединены в assets/js/dist/enhanced-features.js${NC}"

# Минификация объединенного JS файла существующих функций
echo -e "${BLUE}Минификация объединенного JS файла существующих функций...${NC}"
uglifyjs assets/js/dist/enhanced-features.js -o assets/js/dist/enhanced-features.min.js -c -m

echo -e "${GREEN}JS файл существующих функций минифицирован в assets/js/dist/enhanced-features.min.js${NC}"

# Создаем файл с заменами для index.html
echo -e "${BLUE}Создание файла с заменами для index.html...${NC}"

cat > replace-assets.sed << EOF
# Замена CSS файлов оптимизации
/<link rel="stylesheet" href="assets\/css\/redesign-fixes.css">/,/<link rel="stylesheet" href="assets\/css\/footer-optimization.css">/ c\\
    <!-- ОПТИМИЗИРОВАННЫЕ СТИЛИ -->\\
    <link rel="stylesheet" href="assets/css/dist/optimizations.min.css?v=$(date +%Y%m%d)">

# Замена JS файлов оптимизации
/<script src="assets\/js\/header-interactions.js/,/<script src="assets\/js\/footer-interactions.js/ c\\
    <!-- ОПТИМИЗИРОВАННЫЕ СКРИПТЫ -->\\
    <script src="assets/js/dist/optimizations.min.js?v=$(date +%Y%m%d)" defer></script>

# Замена некоторых существующих JS файлов
/<script src="assets\/js\/ux-improvements.js/,/<script src="assets\/js\/calculator-ui-enhanced.js/ c\\
    <script src="assets/js/dist/enhanced-features.min.js?v=$(date +%Y%m%d)" defer></script>
EOF

echo -e "${GREEN}Файл с заменами создан${NC}"

# Создаем резервную копию index.html
echo -e "${BLUE}Создание резервной копии index.html...${NC}"
cp index.html index.html.backup

# Применяем замены к index.html
echo -e "${BLUE}Применение замен к index.html...${NC}"
sed -i -f replace-assets.sed index.html

echo -e "${GREEN}Замены применены к index.html${NC}"

# Удаляем временный файл с заменами
rm replace-assets.sed

# Выводим статистику по размерам файлов
echo -e "${BLUE}=== Статистика по размерам файлов ===${NC}"

original_css_size=$(du -ch assets/css/redesign-fixes.css assets/css/header-optimization.css assets/css/hero-optimization.css assets/css/calculator-optimization.css assets/css/benefits-optimization.css assets/css/form-optimization.css assets/css/visual-hierarchy.css assets/css/social-proof.css assets/css/footer-optimization.css | grep total | cut -f1)
optimized_css_size=$(du -h assets/css/dist/optimizations.min.css | cut -f1)

original_js_size=$(du -ch assets/js/header-interactions.js assets/js/hero-animations.js assets/js/benefits-animations.js assets/js/form-handler-enhanced.js assets/js/page-navigation.js assets/js/testimonials-slider.js assets/js/footer-interactions.js | grep total | cut -f1)
optimized_js_size=$(du -h assets/js/dist/optimizations.min.js | cut -f1)

echo -e "Размер оригинальных CSS файлов: ${YELLOW}$original_css_size${NC}"
echo -e "Размер оптимизированного CSS файла: ${GREEN}$optimized_css_size${NC}"
echo -e "Размер оригинальных JS файлов: ${YELLOW}$original_js_size${NC}"
echo -e "Размер оптимизированного JS файла: ${GREEN}$optimized_js_size${NC}"

echo -e "${GREEN}=== Оптимизация завершена ===${NC}"
echo -e "${YELLOW}Примечание: Файлы не удалены. После проверки работоспособности вы можете удалить оригинальные файлы.${NC}"
echo -e "${BLUE}Для отката изменений используйте: mv index.html.backup index.html${NC}"
