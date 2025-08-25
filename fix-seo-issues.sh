#!/bin/bash

# Скрипт для исправления SEO проблем: H1=Title и 404 ошибки
echo "🔧 Исправление SEO проблем: H1=Title и 404 ошибки..."

# Создаем бэкап
mkdir -p seo-fix-backup-$(date +%Y%m%d-%H%M%S)

# Функция для исправления H1=Title
fix_h1_title() {
    local file="$1"
    local filename=$(basename "$file")
    local backup_dir="seo-fix-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Создаем бэкап
    cp "$file" "$backup_dir/"
    
    echo "🔧 Исправление H1=Title в $filename..."
    
    # Исправляем конкретные страницы
    case "$filename" in
        "blog-3-spot-orders.html")
            # Меняем H1 на более короткий и информативный
            sed -i 's|<h1>Спот-заявки в логистике: что это и как использовать в 2025</h1>|<h1>Спот-заявки в логистике: быстрые перевозки по выгодным ценам</h1>|g' "$file"
            echo "✅ Исправлен H1 для blog-3-spot-orders.html"
            ;;
        "blog-5-logistics-optimization.html")
            # Меняем H1 на более короткий
            sed -i 's|<h1>Оптимизация логистических затрат: 10 проверенных способов сэкономить до 30%</h1>|<h1>Оптимизация логистики: как сэкономить до 30% на перевозках</h1>|g' "$file"
            echo "✅ Исправлен H1 для blog-5-logistics-optimization.html"
            ;;
        "blog-9-dangerous-goods.html")
            # Меняем H1 на более короткий
            sed -i 's|<h1>Перевозка опасных грузов автотранспортом: правила ADR 2025</h1>|<h1>Перевозка опасных грузов: правила ADR и безопасность</h1>|g' "$file"
            echo "✅ Исправлен H1 для blog-9-dangerous-goods.html"
            ;;
    esac
}

# Исправляем H1=Title проблемы
fix_h1_title "blog-3-spot-orders.html"
fix_h1_title "blog-5-logistics-optimization.html"
fix_h1_title "blog-9-dangerous-goods.html"

# Создаем редиректы для 404 ошибок
echo "🔧 Создание редиректов для 404 ошибок..."

# Добавляем редиректы в .htaccess
cat >> .htaccess << 'EOF'

# Редиректы для исправления 404 ошибок
RewriteRule ^routes/moskva-sankt-peterburg/?$ /gruzoperevozki-moskva-spb.html [R=301,L]
RewriteRule ^templates/?$ /services.html [R=301,L]
EOF

echo "✅ Добавлены редиректы в .htaccess"

# Создаем Nginx редиректы
cat > nginx-404-redirects.conf << 'EOF'
# Редиректы для исправления 404 ошибок
location = /routes/moskva-sankt-peterburg {
    return 301 https://avtogost77.ru/gruzoperevozki-moskva-spb.html;
}

location = /routes/moskva-sankt-peterburg/ {
    return 301 https://avtogost77.ru/gruzoperevozki-moskva-spb.html;
}

location = /templates {
    return 301 https://avtogost77.ru/services.html;
}

location = /templates/ {
    return 301 https://avtogost77.ru/services.html;
}
EOF

echo "✅ Создан файл nginx-404-redirects.conf"

# Создаем скрипт деплоя
cat > deploy-seo-fixes.sh << 'EOF'
#!/bin/bash

echo "🚀 Деплой SEO исправлений..."

# Загружаем исправленные файлы
scp -i ~/.ssh/id_ed25519 blog-3-spot-orders.html blog-5-logistics-optimization.html blog-9-dangerous-goods.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/

# Загружаем .htaccess
scp -i ~/.ssh/id_ed25519 .htaccess root@193.160.208.183:/www/wwwroot/avtogost77.ru/

echo "✅ SEO исправления загружены на сервер"
echo "🔄 Перезапустите nginx: systemctl reload nginx"
echo ""
echo "📊 Проверьте через 24-48 часов:"
echo "   - H1=Title ошибки исчезли"
echo "   - 404 ошибки исправлены"
EOF

chmod +x deploy-seo-fixes.sh

echo ""
echo "✅ Исправление SEO проблем завершено!"
echo "📁 Бэкапы сохранены в: seo-fix-backup-$(date +%Y%m%d-%H%M%S)/"
echo ""
echo "📋 Что было исправлено:"
echo "   ✅ H1=Title на 3 страницах блога"
echo "   ✅ 404 ошибки: /routes/moskva-sankt-peterburg/ → /gruzoperevozki-moskva-spb.html"
echo "   ✅ 404 ошибки: /templates/ → /services.html"
echo ""
echo "🚀 Для деплоя запустите: ./deploy-seo-fixes.sh"
