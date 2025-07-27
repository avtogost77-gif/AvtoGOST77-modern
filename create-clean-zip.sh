#!/bin/bash

echo "📦 СОЗДАЮ ЧИСТЫЙ ZIP ДЛЯ ДЕПЛОЯ"
echo "=============================="

# Создаем временную директорию
TEMP_DIR="avtogost77-clean"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📄 Копирую HTML файлы..."
# Основные страницы
cp index.html $TEMP_DIR/
cp help.html $TEMP_DIR/
cp terms.html $TEMP_DIR/
cp contact.html $TEMP_DIR/
cp services.html $TEMP_DIR/
cp faq.html $TEMP_DIR/
cp privacy.html $TEMP_DIR/

# Блог статьи (нужны для SEO)
cp blog-1-carrier-failed.html $TEMP_DIR/
cp blog-2-wildberries-delivery.html $TEMP_DIR/
cp blog-3-spot-orders.html $TEMP_DIR/
cp blog-4-remote-logistics.html $TEMP_DIR/
cp blog-5-logistics-optimization.html $TEMP_DIR/
cp blog-6-marketplace-insider.html $TEMP_DIR/

# SEO страницы
cp marketplace-delivery.html $TEMP_DIR/
cp moscow-regions.html $TEMP_DIR/
cp urgent-delivery.html $TEMP_DIR/
cp faq-seo-optimized.html $TEMP_DIR/
cp moscow-spb-delivery.html $TEMP_DIR/
cp logistics-for-pvh.html $TEMP_DIR/
cp ip-small-business-delivery.html $TEMP_DIR/
cp self-employed-delivery.html $TEMP_DIR/
cp confectionery-delivery.html $TEMP_DIR/
cp regions-to-marketplaces.html $TEMP_DIR/

echo "🔍 Копирую SEO файлы..."
cp sitemap.xml $TEMP_DIR/
cp robots.txt $TEMP_DIR/
cp .htaccess $TEMP_DIR/
cp dadata-config.js $TEMP_DIR/
cp favicon.svg $TEMP_DIR/
cp manifest.json $TEMP_DIR/
cp sw.js $TEMP_DIR/

echo "🎨 Копирую CSS..."
mkdir -p $TEMP_DIR/assets/css
cp assets/css/styles.css $TEMP_DIR/assets/css/
cp assets/css/main.css $TEMP_DIR/assets/css/
cp assets/css/mobile.css $TEMP_DIR/assets/css/
cp assets/css/emergency-mobile-fix.css $TEMP_DIR/assets/css/
cp assets/css/critical.css $TEMP_DIR/assets/css/
cp assets/css/critical-mobile-fix.css $TEMP_DIR/assets/css/

echo "⚡ Копирую JS..."
mkdir -p $TEMP_DIR/assets/js
cp assets/js/emergency-fix.js $TEMP_DIR/assets/js/
cp assets/js/fias-integration.js $TEMP_DIR/assets/js/
cp assets/js/form-handler.js $TEMP_DIR/assets/js/
cp assets/js/main.js $TEMP_DIR/assets/js/
cp assets/js/calc.js $TEMP_DIR/assets/js/
cp assets/js/modern-ux.js $TEMP_DIR/assets/js/
cp assets/js/seo-optimizer.js $TEMP_DIR/assets/js/
cp assets/js/content-generator.js $TEMP_DIR/assets/js/
cp assets/js/interactive-map.js $TEMP_DIR/assets/js/
cp assets/js/performance.js $TEMP_DIR/assets/js/
cp assets/js/sticky-bar.js $TEMP_DIR/assets/js/
cp assets/js/ticker.js $TEMP_DIR/assets/js/
cp assets/js/benefit.js $TEMP_DIR/assets/js/

echo "🖼️ Копирую изображения..."
mkdir -p $TEMP_DIR/assets/img
cp -r assets/img/* $TEMP_DIR/assets/img/

echo "📦 Создаю ZIP архив..."
ZIP_NAME="AVTOGOST-CLEAN-DEPLOY-$(date +%Y%m%d-%H%M%S).zip"
cd $TEMP_DIR
zip -r ../$ZIP_NAME .
cd ..

# Удаляем временную директорию
rm -rf $TEMP_DIR

echo ""
echo "✅ АРХИВ СОЗДАН: $ZIP_NAME"
echo ""
echo "📋 ИНСТРУКЦИЯ ДЛЯ ДЕПЛОЯ:"
echo "1. Зайди в ISPManager: https://vip284.hosting.reg.ru:1500/"
echo "2. Логин: u3207373"
echo "3. Пароль: 5x8cZ19H0rWhh6Qt"
echo "4. Удали всё из папки www/avtogost77.ru"
echo "5. Загрузи и распакуй этот архив"
echo ""

# Показываем размер архива
ls -lh $ZIP_NAME