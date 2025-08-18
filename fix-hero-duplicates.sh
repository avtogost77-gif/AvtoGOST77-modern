#!/bin/bash

# Скрипт для удаления дублирующих hero-background блоков
# АвтоГОСТ - 14 августа 2025

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Удаляем дублирующие hero-background блоки...${NC}"
echo "=================================="

# Создаем backup
backup_dir="backup-hero-fix-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
find . -maxdepth 1 -name "*.html" -exec cp {} "$backup_dir/" \;
find . -path "./blog" -name "*.html" -exec cp {} "$backup_dir/" \;
echo -e "${GREEN}✅ Backup создан: $backup_dir${NC}"

# Функция для обработки одного файла
process_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo -e "${BLUE}📄 Обрабатываем: $filename${NC}"
    
    # Проверяем, есть ли hero-background
    if grep -q "hero-background" "$file"; then
        # Создаем временный файл
        temp_file=$(mktemp)
        
        # Удаляем hero-background блок с picture
        sed '/<div class="hero-background">/,/<\/div>/d' "$file" > "$temp_file"
        
        # Заменяем оригинальный файл
        mv "$temp_file" "$file"
        
        echo -e "${GREEN}✅ Удален hero-background из: $filename${NC}"
    else
        echo -e "${YELLOW}⏭️ Hero-background не найден в: $filename${NC}"
    fi
}

# Обрабатываем основные HTML файлы
echo -e "${BLUE}📁 Обрабатываем основные HTML файлы...${NC}"

# Основные файлы в корне
find . -maxdepth 1 -name "*.html" -type f | while read -r file; do
    process_file "$file"
done

# Файлы в папке blog
find . -path "./blog" -name "*.html" -type f | while read -r file; do
    process_file "$file"
done

echo -e "${GREEN}✅ Удаление дублирующих hero-background завершено!${NC}"
echo -e "${BLUE}📁 Backup сохранен в: $backup_dir${NC}"

# Подсчитываем количество обработанных файлов
total_files=$(find . -maxdepth 1 -name "*.html" -type f | wc -l)
blog_files=$(find . -path "./blog" -name "*.html" -type f | wc -l)
total_processed=$((total_files + blog_files))

echo -e "${BLUE}📊 Статистика:${NC}"
echo "- Обработано основных файлов: $total_files"
echo "- Обработано файлов блога: $blog_files"
echo "- Всего обработано: $total_processed"

echo -e "${YELLOW}📋 Следующие шаги:${NC}"
echo "1. Пересобрать CSS файлы"
echo "2. Задеплоить исправления на сервер"
echo "3. Проверить отображение hero секций"
