#!/bin/bash

# 🎯 СОЗДАНИЕ ЕДИНОГО МАСТЕР CSS ФАЙЛА
# Объединяем все актуальные стили в один файл

echo "🚀 Начинаем унификацию CSS..."

# Создаем директорию для мастер стилей
mkdir -p assets/css/master

# Очищаем старый файл если есть
rm -f assets/css/master/master-styles.css

echo "/* =============================================" > assets/css/master/master-styles.css
echo "   АВТОГОСТ77 - ЕДИНАЯ СИСТЕМА СТИЛЕЙ 2025" >> assets/css/master/master-styles.css
echo "   Версия: MASTER UNIFIED EDITION" >> assets/css/master/master-styles.css
echo "   Все стили объединены для максимальной производительности" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 1. Базовые переменные и сброс
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   БАЗОВЫЕ ПЕРЕМЕННЫЕ И СБРОС" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/styles.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 2. Критические стили
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   КРИТИЧЕСКИЕ СТИЛИ" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/critical-optimized.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 3. Оптимизации (новые стили от последних правок)
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   ОПТИМИЗАЦИИ И НОВЫЕ КОМПОНЕНТЫ" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/dist/optimizations.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 4. Калькулятор современный
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   КАЛЬКУЛЯТОР СОВРЕМЕННЫЙ" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/calculator-modern.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 5. Исправления редизайна
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   ИСПРАВЛЕНИЯ РЕДИЗАЙНА" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/redesign-fixes.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

# 6. Мобильные стили
echo "/* =============================================" >> assets/css/master/master-styles.css
echo "   МОБИЛЬНЫЕ ОПТИМИЗАЦИИ" >> assets/css/master/master-styles.css
echo "   ============================================= */" >> assets/css/master/master-styles.css
cat assets/css/mobile.css >> assets/css/master/master-styles.css
echo "" >> assets/css/master/master-styles.css

echo "✅ Мастер CSS создан: assets/css/master/master-styles.css"

# Минифицируем если есть clean-css
if command -v cleancss &> /dev/null; then
    echo "🔄 Минификация CSS..."
    cleancss -o assets/css/master/master-styles.min.css assets/css/master/master-styles.css
    echo "✅ Минифицированный файл: assets/css/master/master-styles.min.css"
else
    echo "⚠️  clean-css не найден, копируем как есть..."
    cp assets/css/master/master-styles.css assets/css/master/master-styles.min.css
fi

# Показываем размер итогового файла
echo "📊 Размер итогового файла:"
ls -lh assets/css/master/master-styles.min.css

echo "🎉 Унификация CSS завершена!"
