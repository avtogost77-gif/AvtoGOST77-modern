#!/bin/bash
# ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ 404 ОШИБОК

echo "🚨 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ 404 ОШИБОК"
echo "===================================="

# 1. ВАРИАНТ А: Запустить генератор страниц на сервере
echo "📝 Команды для запуска генератора на сервере:"
echo "cd /www/wwwroot/avtogost77.ru/"
echo "# Если есть package.json с генератором:"
echo "npm install"
echo "npm run generate-pages"
echo ""

# 2. ВАРИАНТ Б: Временный редирект через .htaccess
echo "📝 Или добавьте в .htaccess временные редиректы:"
cat << 'EOF'
# ВРЕМЕННОЕ РЕШЕНИЕ - редирект 404 страниц
RewriteEngine On

# Редирект всех routes на главную
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^routes/(.*)$ / [R=302,L]

# Редирект industries на главную
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^industries/(.*)$ / [R=302,L]

# Редирект calculators на главную
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^calculators/(.*)$ / [R=302,L]
EOF

echo ""
echo "3. ВАРИАНТ В: Скачать страницы с GitHub"
echo "================================================"
echo "Проверьте есть ли страницы в основной ветке GitHub:"
echo "https://github.com/avtogost77-gif/AvtoGOST77-modern"
echo ""
echo "Если есть - клонируйте репозиторий:"
echo "git clone https://github.com/avtogost77-gif/AvtoGOST77-modern temp-repo"
echo "cp -r temp-repo/routes /www/wwwroot/avtogost77.ru/"
echo "cp -r temp-repo/industries /www/wwwroot/avtogost77.ru/"
echo "cp -r temp-repo/calculators /www/wwwroot/avtogost77.ru/"