#!/bin/bash

# Скрипт подготовки сборки для деплоя АвтоГОСТ
# Создает чистую папку с только нужными файлами

echo "🚀 Подготовка сборки для деплоя АвтоГОСТ..."

# Создаем директорию для деплоя
DEPLOY_DIR="avtogost-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

echo "📁 Создана папка: $DEPLOY_DIR"

# Копируем основные HTML файлы
echo "📄 Копирование HTML файлов..."
cp *.html $DEPLOY_DIR/ 2>/dev/null || true

# Удаляем ненужные/временные HTML файлы
rm -f $DEPLOY_DIR/google-verification-template.html
rm -f $DEPLOY_DIR/trust-documents.html  # Временный файл, контент уже в index.html

# Копируем важные конфиг файлы
echo "⚙️ Копирование конфигурационных файлов..."
cp .htaccess $DEPLOY_DIR/
cp robots.txt $DEPLOY_DIR/
cp sitemap.xml $DEPLOY_DIR/
cp favicon.svg $DEPLOY_DIR/
cp browserconfig.xml $DEPLOY_DIR/
cp manifest.json $DEPLOY_DIR/
cp sw.js $DEPLOY_DIR/

# Копируем ассеты
echo "🎨 Копирование ассетов..."
cp -r assets $DEPLOY_DIR/

# Копируем директории с контентом
echo "📂 Копирование директорий..."
cp -r routes $DEPLOY_DIR/
cp -r blog $DEPLOY_DIR/
cp -r industries $DEPLOY_DIR/
cp -r calculators $DEPLOY_DIR/

# Копируем RSS и YML файлы для маркетплейсов
echo "📡 Копирование фидов..."
cp turbo-rss.xml $DEPLOY_DIR/
cp yandex-*.yml $DEPLOY_DIR/ 2>/dev/null || true
cp yandex-*.json $DEPLOY_DIR/ 2>/dev/null || true

# Создаем файл версии
echo "📝 Создание файла версии..."
echo "Deploy date: $(date)" > $DEPLOY_DIR/version.txt
echo "Git commit: $(git rev-parse --short HEAD)" >> $DEPLOY_DIR/version.txt

# Очищаем от мусора
echo "🧹 Очистка от временных файлов..."
find $DEPLOY_DIR -name "*.md" -delete
find $DEPLOY_DIR -name "*.sh" -delete
find $DEPLOY_DIR -name ".DS_Store" -delete
find $DEPLOY_DIR -name "Thumbs.db" -delete
find $DEPLOY_DIR -name "*.swp" -delete
find $DEPLOY_DIR -name "*~" -delete

# Удаляем ненужные zip архивы
rm -f $DEPLOY_DIR/*.zip

# Проверяем размер
echo "📊 Статистика сборки:"
echo "Всего файлов: $(find $DEPLOY_DIR -type f | wc -l)"
echo "Размер: $(du -sh $DEPLOY_DIR | cut -f1)"

# Создаем архив для удобства
echo "📦 Создание архива..."
zip -r ${DEPLOY_DIR}.zip $DEPLOY_DIR -q

echo "✅ Готово! Сборка создана в папке: $DEPLOY_DIR"
echo "📦 Архив для деплоя: ${DEPLOY_DIR}.zip"

# Список важных файлов для проверки
echo ""
echo "⚠️ Проверьте наличие ключевых файлов:"
echo "- index.html ✓"
echo "- .htaccess ✓"
echo "- robots.txt ✓"
echo "- sitemap.xml ✓"
echo "- favicon.svg ✓"
echo "- assets/ ✓"
echo "- routes/ ✓"
echo ""
echo "📱 Новые SEO-страницы:"
echo "- transportnaya-kompaniya.html (727К запросов)"
echo "- sbornye-gruzy.html"
echo "- dostavka-na-marketpleysy.html"
echo "- rc-dostavka.html"
echo "- gruzoperevozki-spb.html"
echo "- gruzoperevozki-ekaterinburg.html"
echo "- logistika-dlya-biznesa.html"
echo "- gruzoperevozki-po-moskve.html"
echo "- gruzoperevozki-iz-moskvy.html"