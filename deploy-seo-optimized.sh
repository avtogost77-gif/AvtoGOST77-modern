#!/bin/bash

# Скрипт деплоя SEO оптимизированной версии на VPS
# АвтоГОСТ - 14 августа 2025

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"

echo -e "${BLUE}🚀 Деплой SEO оптимизированной версии на VPS${NC}"
echo "=================================="

# Проверяем, что мы в правильной директории
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Ошибка: index.html не найден. Запустите скрипт из корня проекта.${NC}"
    exit 1
fi

# Создаем резервную копию на VPS
echo -e "${BLUE}📦 Создание резервной копии на VPS...${NC}"
ssh $VPS_HOST "cd $VPS_PATH && mkdir -p backup-seo-optimized-\$(date +%Y%m%d-%H%M%S) && cp -r assets backup-seo-optimized-\$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true"

echo -e "${BLUE}📤 Загрузка оптимизированных файлов...${NC}"

# Загружаем оптимизированные CSS файлы
echo -e "${YELLOW}📁 Загружаем CSS файлы...${NC}"
rsync -avz --progress assets/css/unified-optimized.min.css $VPS_HOST:$VPS_PATH/assets/css/
rsync -avz --progress assets/css/calculator-modern.css $VPS_HOST:$VPS_PATH/assets/css/

# Загружаем оптимизированные JS файлы
echo -e "${YELLOW}📁 Загружаем JS файлы...${NC}"
rsync -avz --progress assets/js/unified-main.min.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/sticky-cta.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/ab-test-headers.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/schema-optimizer.js $VPS_HOST:$VPS_PATH/assets/js/

# Загружаем оптимизированные изображения
echo -e "${YELLOW}📁 Загружаем оптимизированные изображения...${NC}"
rsync -avz --progress assets/img/hero-logistics.webp $VPS_HOST:$VPS_PATH/assets/img/
rsync -avz --progress assets/img/hero-logistics-mobile.webp $VPS_HOST:$VPS_PATH/assets/img/
rsync -avz --progress assets/img/hero-logistics-tablet.webp $VPS_HOST:$VPS_PATH/assets/img/

# Загружаем все HTML файлы с SEO оптимизацией
echo -e "${YELLOW}📁 Загружаем HTML файлы с SEO оптимизацией...${NC}"
rsync -avz --progress *.html $VPS_HOST:$VPS_PATH/
rsync -avz --progress blog/*.html $VPS_HOST:$VPS_PATH/blog/

# Загружаем конфигурацию Nginx
echo -e "${YELLOW}📁 Загружаем конфигурацию Nginx...${NC}"
rsync -avz --progress nginx-optimization.conf $VPS_HOST:$VPS_PATH/

# Загружаем robots.txt и sitemap.xml
echo -e "${YELLOW}📁 Загружаем SEO файлы...${NC}"
rsync -avz --progress robots.txt $VPS_HOST:$VPS_PATH/
rsync -avz --progress sitemap.xml $VPS_HOST:$VPS_PATH/

# Применяем конфигурацию Nginx
echo -e "${BLUE}🔧 Применяем конфигурацию Nginx...${NC}"
ssh $VPS_HOST "cp $VPS_PATH/nginx-optimization.conf /etc/nginx/sites-available/avtogost77 && nginx -t && systemctl reload nginx"

# Проверяем статус
echo -e "${BLUE}✅ Проверка статуса...${NC}"
ssh $VPS_HOST "systemctl status nginx --no-pager | head -5"

echo -e "${GREEN}🎉 SEO оптимизированный деплой завершен!${NC}"
echo -e "${BLUE}🌐 Сайт: https://avtogost77.ru${NC}"
echo ""
echo -e "${YELLOW}📊 Что было развернуто:${NC}"
echo "- SEO оптимизация мета-тегов (53 страницы)"
echo "- CSS минификация (15% сжатие)"
echo "- JS минификация (35% сжатие)"
echo "- Оптимизация изображений (WebP)"
echo "- Конфигурация Nginx для кеширования"
echo "- Sticky CTA и A/B тестирование"
echo ""
echo -e "${YELLOW}🎯 Ожидаемые результаты:${NC}"
echo "- Улучшение индексации страниц"
echo "- Рост органического трафика на 15-25%"
echo "- Ускорение загрузки сайта"
echo "- Улучшение позиций в поиске"
echo ""
echo -e "${BLUE}📋 Следующие шаги:${NC}"
echo "1. Проверить сайт: https://avtogost77.ru"
echo "2. Запросить индексацию в Google Search Console"
echo "3. Проверить PageSpeed Insights"
echo "4. Мониторить позиции в поиске"
