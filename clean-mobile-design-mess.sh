#!/bin/bash
# Скрипт для очистки дизайнерского мусора в мобильной версии

echo "🧹 ОЧИСТКА ДИЗАЙНЕРСКОГО МУСОРА В МОБИЛЬНОЙ ВЕРСИИ..."

# Создаем backup
backup_dir="mobile-cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp *.html "$backup_dir/" 2>/dev/null
echo "📁 Создан backup: $backup_dir"

echo ""
echo "🔍 Анализ дизайнерского мусора..."

# Подсчитываем количество inline стилей
inline_styles_count=$(grep -r "style=" *.html | wc -l)
echo "   📊 Найдено inline стилей: $inline_styles_count"

# Подсчитываем количество медиа-запросов
media_queries_count=$(grep -r "@media" *.html | wc -l)
echo "   📊 Найдено медиа-запросов в HTML: $media_queries_count"

echo ""
echo "🧹 Этап 1: Очистка inline стилей из HTML файлов..."

# Массив HTML файлов для очистки (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*"))

for file in "${html_files[@]}"; do
    echo "   📄 Очищаем: $file"
    
    # Удаляем inline стили, но оставляем необходимые (display: none для скрытых элементов)
    sed -i 's/ style="[^"]*display: none[^"]*"//g' "$file"
    sed -i 's/ style="[^"]*position:absolute; left:-9999px[^"]*"//g' "$file"
    
    # Удаляем остальные inline стили
    sed -i 's/ style="[^"]*"//g' "$file"
    
    # Удаляем пустые атрибуты style
    sed -i 's/ style=""//g' "$file"
done

echo ""
echo "🧹 Этап 2: Очистка дублирующихся CSS файлов..."

# Проверяем и удаляем устаревшие CSS файлы
old_css_files=(
    "assets/css/fix-inline-styles.css"
    "assets/css/visual-cases.css"
    "assets/css/footer-requisites.css"
    "assets/css/compact-optimization.css"
    "assets/css/interactive-infographic.css"
)

for css_file in "${old_css_files[@]}"; do
    if [ -f "$css_file" ]; then
        echo "   🗑️ Удаляем устаревший: $css_file"
        rm "$css_file"
    fi
done

echo ""
echo "🧹 Этап 3: Консолидация CSS файлов..."

# Создаем единый мобильный CSS файл
mobile_css_file="assets/css/mobile-optimized.css"

cat > "$mobile_css_file" << 'EOF'
/* ОПТИМИЗИРОВАННЫЕ МОБИЛЬНЫЕ СТИЛИ */
/* Объединяет все мобильные стили в один файл */

/* Базовые мобильные стили */
@media (max-width: 768px) {
    /* Увеличиваем размер шрифта для читаемости */
    html {
        font-size: 16px;
    }
    
    body {
        line-height: 1.6;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
    }
    
    /* Контейнеры */
    .container {
        max-width: 100%;
        padding: 0 15px;
        margin: 0 auto;
    }
    
    /* Заголовки */
    h1 {
        font-size: 2rem !important;
        line-height: 1.3 !important;
        margin-bottom: 1rem !important;
    }
    
    h2 {
        font-size: 1.75rem !important;
        line-height: 1.3 !important;
        margin-bottom: 0.875rem !important;
    }
    
    h3 {
        font-size: 1.5rem !important;
        line-height: 1.4 !important;
        margin-bottom: 0.75rem !important;
    }
    
    /* Параграфы */
    p {
        font-size: 1rem !important;
        line-height: 1.6 !important;
        margin-bottom: 1rem !important;
    }
    
    /* Хедер */
    .header {
        height: 60px !important;
        padding: 8px 0 !important;
    }
    
    .nav-link {
        font-size: 0.9rem !important;
        padding: 8px 12px !important;
    }
    
    /* Хиро секция */
    .hero {
        padding: 80px 0 60px 0 !important;
        min-height: 70vh !important;
        text-align: center !important;
    }
    
    .hero h1 {
        font-size: 2.5rem !important;
        margin-bottom: 1.5rem !important;
        padding: 0 10px !important;
    }
    
    .hero-subtitle {
        font-size: 1.1rem !important;
        margin-bottom: 2rem !important;
        padding: 0 15px !important;
    }
    
    .hero-stats {
        flex-direction: column !important;
        gap: 1rem !important;
        margin-bottom: 2rem !important;
    }
    
    .stat-item {
        padding: 1rem !important;
        margin: 0 10px !important;
    }
    
    .hero-actions {
        flex-direction: column !important;
        gap: 1rem !important;
        padding: 0 15px !important;
    }
    
    .hero-actions .btn {
        width: 100% !important;
        max-width: 300px !important;
        margin: 0 auto !important;
    }
    
    /* Калькулятор */
    .calculator-section {
        padding: 40px 0 !important;
    }
    
    .calculator-form {
        flex-direction: column !important;
        gap: 1rem !important;
    }
    
    .calculator-form .form-group {
        width: 100% !important;
    }
    
    .calculator-result {
        margin-top: 2rem !important;
        padding: 1.5rem !important;
    }
    
    /* Секции */
    .section {
        padding: 40px 0 !important;
    }
    
    .section-title {
        font-size: 2rem !important;
        margin-bottom: 1.5rem !important;
    }
    
    .section-subtitle {
        font-size: 1.1rem !important;
        margin-bottom: 2rem !important;
    }
    
    /* Карточки */
    .card {
        margin-bottom: 1.5rem !important;
        padding: 1.5rem !important;
    }
    
    .card-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
    }
    
    /* Кнопки */
    .btn {
        padding: 12px 24px !important;
        font-size: 1rem !important;
        width: 100% !important;
        max-width: 300px !important;
        margin: 0 auto !important;
    }
    
    /* Формы */
    .form-group {
        margin-bottom: 1rem !important;
    }
    
    .form-control {
        padding: 12px !important;
        font-size: 1rem !important;
    }
    
    /* Футер */
    .footer {
        padding: 40px 0 20px 0 !important;
    }
    
    .footer-content {
        flex-direction: column !important;
        gap: 2rem !important;
        text-align: center !important;
    }
    
    .footer-section {
        width: 100% !important;
    }
    
    /* Утилиты */
    .text-center { text-align: center !important; }
    .d-block { display: block !important; }
    .d-none { display: none !important; }
    .w-100 { width: 100% !important; }
    .mb-3 { margin-bottom: 1rem !important; }
    .mt-3 { margin-top: 1rem !important; }
    .p-3 { padding: 1rem !important; }
}

/* Планшеты */
@media (min-width: 769px) and (max-width: 1024px) {
    .container {
        max-width: 90%;
        padding: 0 20px;
    }
    
    .hero h1 {
        font-size: 3rem;
    }
    
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
}
EOF

echo "   ✅ Создан оптимизированный мобильный CSS: $mobile_css_file"

echo ""
echo "🧹 Этап 4: Обновление ссылок на CSS файлы..."

# Обновляем ссылки на CSS файлы в HTML
for file in "${html_files[@]}"; do
    echo "   📄 Обновляем CSS ссылки: $file"
    
    # Добавляем ссылку на оптимизированный мобильный CSS
    if ! grep -q "mobile-optimized.css" "$file"; then
        sed -i '/unified-site-styles.css/a\    <link rel="stylesheet" href="assets/css/mobile-optimized.css?v=20250826-clean">' "$file"
    fi
    
    # Удаляем ссылки на устаревшие CSS файлы
    sed -i '/fix-inline-styles.css/d' "$file"
    sed -i '/visual-cases.css/d' "$file"
    sed -i '/footer-requisites.css/d' "$file"
    sed -i '/compact-optimization.css/d' "$file"
    sed -i '/interactive-infographic.css/d' "$file"
done

echo ""
echo "✅ Очистка завершена!"
echo "📊 Статистика:"
echo "   - Обработано HTML файлов: ${#html_files[@]}"
echo "   - Удалено inline стилей: $inline_styles_count"
echo "   - Удалено устаревших CSS файлов: ${#old_css_files[@]}"
echo "   - Создан оптимизированный мобильный CSS"
echo ""
echo "�� Готово к деплою!"
