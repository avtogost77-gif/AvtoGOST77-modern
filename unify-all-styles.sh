#!/bin/bash

echo "🎨 УНИФИКАЦИЯ СТИЛЕЙ НА ВСЕМ САЙТЕ"
echo "=================================="
echo "🎯 Привязываем стили главной ко всем страницам"

# Создаем бэкап всех HTML файлов
echo "📦 Создаем полный бэкап..."
tar -czf styles-unification-backup-$(date +%Y%m%d-%H%M%S).tar.gz *.html

# Получаем список всех HTML страниц (кроме бэкапов)
ALL_PAGES=($(find . -name "*.html" -not -path "./backup*" -not -path "./test*" -not -path "./*backup*" | sed 's|^\./||'))

echo "📊 Найдено страниц для обработки: ${#ALL_PAGES[@]}"

# Создаем единый CSS файл со всеми стилями главной
echo "🎨 Создаем единый CSS файл..."
cat > assets/css/unified-site-styles.css << 'EOF'
/* ЕДИНЫЕ СТИЛИ ДЛЯ ВСЕГО САЙТА */
/* Базируется на стилях главной страницы */

/* Классы для замены инлайн стилей */
.calculator-preview {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    margin: 2rem 0;
    text-align: center;
}

.calculator-preview h3 {
    color: white !important;
    margin-top: 0;
}

.calculator-preview p {
    font-size: 1.2rem;
    margin-top: 1rem;
}

.calculator-preview .btn {
    background: white;
    color: #28a745;
    margin-top: 1rem;
}

.legal-reference {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #f9fafb;
}

/* Утилиты */
.text-center { text-align: center; }
.text-primary { color: #2563eb; }
.text-success { color: #28a745; }
.text-muted { color: #6c757d; }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }

/* Единая цветовая схема */
:root {
    --primary-color: #2563eb;
    --secondary-color: #28a745;
    --success-color: #20c997;
    --text-muted: #6c757d;
    --border-color: #e0e0e0;
    --bg-light: #f9fafb;
}

/* Стандартизация заголовков */
h1, h2, h3, h4, h5, h6 {
    color: #1f2937;
    line-height: 1.3;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }

/* Стандартизация кнопок */
.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.btn-secondary:hover {
    background: #1e7e34;
}
EOF

PROCESSED=0
UPDATED=0

# Обрабатываем каждую страницу
for page in "${ALL_PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        echo "🔧 Обрабатываем: $page"
        ((PROCESSED++))
        
        # Проверяем есть ли уже master-styles
        if grep -q "master-styles" "$page"; then
            echo "  ℹ️ Уже использует master-styles"
            
            # Добавляем единый CSS если его нет
            if ! grep -q "unified-site-styles.css" "$page"; then
                sed -i '/master-styles.*css/a\    <link rel="stylesheet" href="assets/css/unified-site-styles.css">' "$page"
                echo "  ✅ Добавлен unified-site-styles.css"
                ((UPDATED++))
            fi
        else
            echo "  🔄 Добавляем полную стилизацию"
            
            # Ищем head секцию и добавляем стили
            if grep -q "<head>" "$page"; then
                # Добавляем после head или после charset
                if grep -q '<meta charset=' "$page"; then
                    sed -i '/<meta charset=/a\    <link rel="stylesheet" href="assets/css/master/master-styles.min.css">\n    <link rel="stylesheet" href="assets/css/unified-site-styles.css">' "$page"
                else
                    sed -i '/<head>/a\    <link rel="stylesheet" href="assets/css/master/master-styles.min.css">\n    <link rel="stylesheet" href="assets/css/unified-site-styles.css">' "$page"
                fi
                echo "  ✅ Добавлены все стили"
                ((UPDATED++))
            fi
        fi
        
        # Заменяем инлайн стили на классы
        sed -i 's/style="text-align:\s*center;*"/class="text-center"/g' "$page"
        sed -i 's/style="color:\s*#2563eb;*"/class="text-primary"/g' "$page"
        sed -i 's/style="color:\s*#28a745;*"/class="text-success"/g' "$page"
        sed -i 's/style="margin-bottom:\s*0;*"/class="mb-0"/g' "$page"
        sed -i 's/style="margin-top:\s*0;*"/class="mt-0"/g' "$page"
        
        echo "  🎨 Инлайн стили заменены на классы"
    fi
done

echo ""
echo "🎉 УНИФИКАЦИЯ ЗАВЕРШЕНА!"
echo "========================"
echo "📊 Обработано страниц: $PROCESSED"
echo "✅ Обновлено страниц: $UPDATED"
echo "🎨 Создан: assets/css/unified-site-styles.css"
echo "📦 Бэкап: styles-unification-backup-*.tar.gz"
echo ""
echo "🔍 Проверяем результат..."
echo "Страницы с master-styles: $(grep -l "master-styles" *.html 2>/dev/null | wc -l)"
echo "Страницы с unified-styles: $(grep -l "unified-site-styles" *.html 2>/dev/null | wc -l)"


