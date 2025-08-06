#!/bin/bash
# ПОЛНАЯ ПРОВЕРКА СЕРВЕРА

echo "📋 ПОЛНАЯ ПРОВЕРКА СОСТОЯНИЯ САЙТА НА СЕРВЕРЕ"
echo "=============================================="

# 1. Проверка структуры каталогов
echo -e "\n1️⃣ СТРУКТУРА КАТАЛОГОВ:"
ls -la /www/wwwroot/avtogost77.ru/ | head -20

# 2. Проверка наличия ключевых папок
echo -e "\n2️⃣ ПРОВЕРКА ПАПОК routes, industries, calculators:"
ls -la /www/wwwroot/avtogost77.ru/routes/ 2>/dev/null | wc -l
ls -la /www/wwwroot/avtogost77.ru/industries/ 2>/dev/null | wc -l  
ls -la /www/wwwroot/avtogost77.ru/calculators/ 2>/dev/null | wc -l

# 3. Проверка генератора
echo -e "\n3️⃣ ПОИСК ГЕНЕРАТОРА:"
find /www/wwwroot/avtogost77.ru/ -name "generate*.js" -o -name "generate*.py" -o -name "package.json" | head -10

# 4. Проверка sitemap
echo -e "\n4️⃣ ПРОВЕРКА SITEMAP:"
ls -la /www/wwwroot/avtogost77.ru/sitemap*.xml
head -20 /www/wwwroot/avtogost77.ru/sitemap.xml

# 5. Проверка .htaccess
echo -e "\n5️⃣ ПРОВЕРКА .htaccess:"
head -30 /www/wwwroot/avtogost77.ru/.htaccess

# 6. Подсчет HTML файлов
echo -e "\n6️⃣ КОЛИЧЕСТВО HTML ФАЙЛОВ:"
find /www/wwwroot/avtogost77.ru/ -name "*.html" -type f | wc -l

# 7. Проверка последних изменений
echo -e "\n7️⃣ ПОСЛЕДНИЕ ИЗМЕНЕННЫЕ ФАЙЛЫ:"
find /www/wwwroot/avtogost77.ru/ -type f -mtime -1 -ls | head -20

# 8. Проверка логов
echo -e "\n8️⃣ ПОСЛЕДНИЕ ОШИБКИ 404:"
tail -50 /www/wwwlogs/avtogost77.ru.error.log | grep "404" | tail -10

# 9. Размер папок
echo -e "\n9️⃣ РАЗМЕР ОСНОВНЫХ ПАПОК:"
du -sh /www/wwwroot/avtogost77.ru/routes/ 2>/dev/null
du -sh /www/wwwroot/avtogost77.ru/industries/ 2>/dev/null
du -sh /www/wwwroot/avtogost77.ru/calculators/ 2>/dev/null
du -sh /www/wwwroot/avtogost77.ru/blog/ 2>/dev/null

# 10. Git статус (если есть)
echo -e "\n🔟 GIT СТАТУС:"
cd /www/wwwroot/avtogost77.ru/ && git status 2>/dev/null || echo "Git не инициализирован"