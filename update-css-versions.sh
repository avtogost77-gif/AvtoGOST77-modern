#!/bin/bash

# Скрипт для обновления версий CSS файлов во всех HTML файлах
# Исключаем бэкап директории

echo "🔄 Обновление версий CSS файлов..."

# Обновляем master-styles.min.css с v=20250818 на v=20250825-clean
find . -name "*.html" \
  -not -path "./mega-cleanup-backup-20250825-191401/*" \
  -not -path "./backups/*" \
  -not -path "./inline-styles-backup/*" \
  -exec sed -i 's/master-styles\.min\.css?v=20250818/master-styles.min.css?v=20250825-clean/g' {} \;

# Обновляем unified-site-styles.css добавляя версию
find . -name "*.html" \
  -not -path "./mega-cleanup-backup-20250825-191401/*" \
  -not -path "./backups/*" \
  -not -path "./inline-styles-backup/*" \
  -exec sed -i 's/unified-site-styles\.css/unified-site-styles.css?v=20250825-clean/g' {} \;

echo "✅ Обновление завершено!"

# Проверяем результат
echo "📊 Статистика обновления:"
echo "Файлов с обновленной версией master-styles.min.css:"
find . -name "*.html" \
  -not -path "./mega-cleanup-backup-20250825-191401/*" \
  -not -path "./backups/*" \
  -not -path "./inline-styles-backup/*" \
  -exec grep -l "master-styles.min.css?v=20250825-clean" {} \; | wc -l

echo "Файлов с обновленной версией unified-site-styles.css:"
find . -name "*.html" \
  -not -path "./mega-cleanup-backup-20250825-191401/*" \
  -not -path "./backups/*" \
  -not -path "./inline-styles-backup/*" \
  -exec grep -l "unified-site-styles.css?v=20250825-clean" {} \; | wc -l

