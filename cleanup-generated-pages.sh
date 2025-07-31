#!/bin/bash
# 🧹 СКРИПТ ОЧИСТКИ РЕПОЗИТОРИЯ ОТ СГЕНЕРИРОВАННЫХ СТРАНИЦ

echo "🧹 НАЧИНАЕМ ОЧИСТКУ РЕПОЗИТОРИЯ..."
echo "=================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Проверяем, что мы в правильной директории
if [ ! -f "index.html" ] || [ ! -d ".git" ]; then
    echo -e "${RED}❌ Ошибка: запустите скрипт из корня репозитория!${NC}"
    exit 1
fi

# 2. Считаем файлы для удаления
echo "📊 Анализ файлов..."
ROUTE_FILES=$(find . -maxdepth 1 -name "*-*-*.html" -o -name "*-*-nedorogo.html" -o -name "*-*-srochno.html" | grep -v index | wc -l)
echo -e "Найдено сгенерированных файлов: ${YELLOW}${ROUTE_FILES}${NC}"

# 3. Показываем примеры файлов
echo -e "\n📋 Примеры файлов для удаления:"
find . -maxdepth 1 -name "*-*-*.html" | head -5 | sed 's/^\.\//  - /'

# 4. Спрашиваем подтверждение
echo -e "\n${YELLOW}⚠️  ВНИМАНИЕ: Это действие удалит все сгенерированные страницы из Git!${NC}"
echo "Файлы останутся на диске, но будут исключены из репозитория."
read -p "Продолжить? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Отменено пользователем${NC}"
    exit 1
fi

# 5. Создаем/обновляем .gitignore
echo -e "\n📝 Обновляем .gitignore..."
cat >> .gitignore << 'EOF'

# Сгенерированные страницы маршрутов
-*-*.html
!index*.html
!test*.html

# Временные файлы
*.zip
*.log
temp/
cache/
test-deploy/
EOF

echo -e "${GREEN}✅ .gitignore обновлен${NC}"

# 6. Удаляем файлы из Git (но не с диска)
echo -e "\n🗑️ Удаляем файлы из Git индекса..."

# Создаем список файлов для удаления
find . -maxdepth 1 \( -name "*-*-*.html" -o -name "*-*-nedorogo.html" -o -name "*-*-srochno.html" \) \
    -not -name "index*.html" -not -name "test*.html" | sed 's/^\.\///' > files_to_remove.txt

# Удаляем файлы из git пакетами
if [ -s files_to_remove.txt ]; then
    cat files_to_remove.txt | xargs -n 100 git rm --cached --quiet 2>/dev/null || true
    REMOVED=$(wc -l < files_to_remove.txt)
    echo -e "${GREEN}✅ Удалено из Git: ${REMOVED} файлов${NC}"
else
    echo -e "${YELLOW}Нет файлов для удаления${NC}"
fi

# Удаляем временный файл
rm -f files_to_remove.txt

# 7. Проверяем размер репозитория
echo -e "\n📏 Размер репозитория:"
echo -e "До очистки: ${YELLOW}$(du -sh .git | cut -f1)${NC}"

# 8. Создаем коммит
echo -e "\n💾 Создаем коммит..."
git add .gitignore
git commit -m "🧹 Очистка репозитория: удалены сгенерированные страницы из Git

- Удалено ${ROUTE_FILES} сгенерированных файлов
- Обновлен .gitignore
- Файлы остаются на диске для деплоя
- Репозиторий теперь содержит только исходный код"

echo -e "${GREEN}✅ Коммит создан${NC}"

# 9. Рекомендации
echo -e "\n📌 ${YELLOW}РЕКОМЕНДАЦИИ:${NC}"
echo "1. Запустите 'git push' для отправки изменений"
echo "2. Для полной очистки истории используйте BFG Repo-Cleaner:"
echo "   java -jar bfg.jar --delete-files '*-*-*.html' --no-blob-protection"
echo "3. Настройте CI/CD для автоматической генерации при деплое"
echo "4. Используйте 'node scripts/generate-routes.js' для генерации страниц"

echo -e "\n${GREEN}🎉 Очистка завершена!${NC}"
echo "Репозиторий теперь легкий и быстрый!"