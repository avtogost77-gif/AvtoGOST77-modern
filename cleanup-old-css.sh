#!/bin/bash

# 🧹 ОЧИСТКА УСТАРЕВШИХ CSS ФАЙЛОВ
# Удаляем файлы, которые теперь объединены в master-styles.min.css

echo "🧹 Начинаем очистку устаревших CSS файлов..."

# Создаем бэкап CSS перед удалением
echo "📦 Создаем backup CSS..."
mkdir -p backup-css-before-cleanup
cp -r assets/css/* backup-css-before-cleanup/ 2>/dev/null || true

# Список файлов для удаления (устаревшие)
OLD_CSS_FILES=(
    "assets/css/critical-optimized.css"
    "assets/css/critical-optimized.min.css"
    "assets/css/critical.css"
    "assets/css/critical-inline.css" 
    "assets/css/critical-inline.min.css"
    "assets/css/unified-styles.css"
    "assets/css/unified-styles.min.css"
    "assets/css/styles-optimized.css"
    "assets/css/styles-optimized.min.css"
    "assets/css/redesign-fixes.css"
    "assets/css/urgent-fixes.css"
    "assets/css/enhanced-content.css"
    "assets/css/calculator-modern.css"
    "assets/css/calculator-modern.min.css"
    "assets/css/header-optimization.css"
    "assets/css/hero-optimization.css"
    "assets/css/calculator-optimization.css"
    "assets/css/benefits-optimization.css"
    "assets/css/form-optimization.css"
    "assets/css/footer-optimization.css"
    "assets/css/visual-hierarchy.css"
    "assets/css/social-proof.css"
    "assets/css/mobile.css"
)

# Удаляем устаревшие файлы
echo "🗑️  Удаляем устаревшие CSS файлы..."
for file in "${OLD_CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ❌ Удаляем: $file"
        rm "$file"
    else
        echo "   ⚠️  Не найден: $file"
    fi
done

# Удаляем директорию dist (заменена на master)
if [ -d "assets/css/dist" ]; then
    echo "❌ Удаляем директорию: assets/css/dist"
    rm -rf "assets/css/dist"
fi

echo "✅ Очистка завершена!"

# Показываем что осталось
echo "📁 Оставшиеся CSS файлы:"
find assets/css -name "*.css" -type f | sort

echo "📊 Размер итоговой CSS директории:"
du -sh assets/css

echo "🎉 Репозиторий очищен! Теперь используется только master-styles.min.css"
