#!/bin/bash

# Скрипт для исправления проблем с кодировкой (mojibake)
# при переносе файлов с Windows 10 на Ubuntu
# Автор: AI Assistant
# Дата: $(date +%Y-%m-%d)

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Проверка зависимостей
check_dependencies() {
    log "Проверка зависимостей..."
    
    local deps=("iconv" "file" "find" "grep" "sed")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Отсутствуют зависимости: ${missing_deps[*]}"
        log "Установите их командой: sudo apt-get install ${missing_deps[*]}"
        exit 1
    fi
    
    log "Все зависимости установлены"
}

# Функция для определения кодировки файла
detect_encoding() {
    local file="$1"
    local encoding
    
    # Пробуем определить кодировку
    encoding=$(file -bi "$file" | sed 's/.*charset=//')
    
    if [ "$encoding" = "unknown-8bit" ] || [ "$encoding" = "binary" ]; then
        # Пробуем другие методы определения
        if grep -q $'\xEF\xBB\xBF' "$file" 2>/dev/null; then
            echo "utf-8"
        elif grep -q $'\xFF\xFE' "$file" 2>/dev/null; then
            echo "utf-16le"
        elif grep -q $'\xFE\xFF' "$file" 2>/dev/null; then
            echo "utf-16be"
        else
            echo "cp1251"
        fi
    else
        echo "$encoding"
    fi
}

# Функция для исправления кодировки файла
fix_file_encoding() {
    local file="$1"
    local target_encoding="${2:-utf-8}"
    
    if [ ! -f "$file" ]; then
        warn "Файл не найден: $file"
        return 1
    fi
    
    local current_encoding=$(detect_encoding "$file")
    log "Файл: $file"
    log "  Текущая кодировка: $current_encoding"
    log "  Целевая кодировка: $target_encoding"
    
    if [ "$current_encoding" = "$target_encoding" ]; then
        log "  Кодировка уже корректная, пропускаем"
        return 0
    fi
    
    # Создаем резервную копию
    local backup_file="${file}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$file" "$backup_file"
    log "  Создана резервная копия: $backup_file"
    
    # Пробуем разные варианты конвертации
    local success=false
    
    # Вариант 1: Прямая конвертация
    if iconv -f "$current_encoding" -t "$target_encoding" "$file" > "${file}.tmp" 2>/dev/null; then
        mv "${file}.tmp" "$file"
        success=true
        log "  Конвертация успешна (прямая)"
    else
        # Вариант 2: Попробуем cp1251 -> utf-8
        if iconv -f "cp1251" -t "$target_encoding" "$file" > "${file}.tmp" 2>/dev/null; then
            mv "${file}.tmp" "$file"
            success=true
            log "  Конвертация успешна (cp1251 -> $target_encoding)"
        else
            # Вариант 3: Попробуем windows-1251 -> utf-8
            if iconv -f "windows-1251" -t "$target_encoding" "$file" > "${file}.tmp" 2>/dev/null; then
                mv "${file}.tmp" "$file"
                success=true
                log "  Конвертация успешна (windows-1251 -> $target_encoding)"
            else
                # Вариант 4: Попробуем с игнорированием ошибок
                if iconv -f "cp1251" -t "$target_encoding"//IGNORE "$file" > "${file}.tmp" 2>/dev/null; then
                    mv "${file}.tmp" "$file"
                    success=true
                    log "  Конвертация успешна (с игнорированием ошибок)"
                fi
            fi
        fi
    fi
    
    if [ "$success" = true ]; then
        log "  ✅ Файл успешно исправлен"
    else
        error "  ❌ Не удалось исправить кодировку файла"
        rm -f "${file}.tmp"
        return 1
    fi
}

# Функция для исправления имен файлов
fix_filename_encoding() {
    local dir="${1:-.}"
    local target_encoding="${2:-utf-8}"
    
    log "Исправление кодировки имен файлов в директории: $dir"
    
    find "$dir" -type f -name "*" | while read -r file; do
        local dirname=$(dirname "$file")
        local basename=$(basename "$file")
        local new_basename
        
        # Проверяем, содержит ли имя файла не-ASCII символы
        if echo "$basename" | grep -q '[^[:ascii:]]'; then
            log "Найден файл с не-ASCII символами: $file"
            
            # Пробуем исправить имя файла
            new_basename=$(echo "$basename" | iconv -f "cp1251" -t "$target_encoding" 2>/dev/null || \
                          echo "$basename" | iconv -f "windows-1251" -t "$target_encoding" 2>/dev/null || \
                          echo "$basename")
            
            if [ "$new_basename" != "$basename" ]; then
                local new_file="$dirname/$new_basename"
                if [ ! -e "$new_file" ]; then
                    mv "$file" "$new_file"
                    log "  Переименован: $file -> $new_file"
                else
                    warn "  Файл с таким именем уже существует: $new_file"
                fi
            fi
        fi
    done
}

# Функция для обработки PDF файлов
fix_pdf_metadata() {
    local dir="${1:-.}"
    
    log "Обработка PDF файлов в директории: $dir"
    
    # Проверяем наличие pdftk
    if ! command -v pdftk &> /dev/null; then
        warn "pdftk не установлен. Установите: sudo apt-get install pdftk"
        return 1
    fi
    
    find "$dir" -type f -name "*.pdf" | while read -r pdf_file; do
        log "Обработка PDF: $pdf_file"
        
        # Создаем резервную копию
        local backup_file="${pdf_file}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$pdf_file" "$backup_file"
        
        # Извлекаем метаданные
        local info_file="${pdf_file}.info"
        pdftk "$pdf_file" dump_data_utf8 > "$info_file" 2>/dev/null || \
        pdftk "$pdf_file" dump_data > "$info_file" 2>/dev/null
        
        if [ -f "$info_file" ]; then
            # Исправляем кодировку метаданных
            fix_file_encoding "$info_file"
            
            # Обновляем PDF с исправленными метаданными
            pdftk "$pdf_file" update_info_utf8 "$info_file" output "${pdf_file}.fixed" 2>/dev/null || \
            pdftk "$pdf_file" update_info "$info_file" output "${pdf_file}.fixed" 2>/dev/null
            
            if [ -f "${pdf_file}.fixed" ]; then
                mv "${pdf_file}.fixed" "$pdf_file"
                log "  ✅ Метаданные PDF исправлены"
            else
                warn "  Не удалось обновить метаданные PDF"
            fi
            
            rm -f "$info_file"
        fi
    done
}

# Основная функция
main() {
    local target_dir="${1:-.}"
    local target_encoding="${2:-utf-8}"
    
    echo -e "${BLUE}=== Скрипт исправления проблем с кодировкой (mojibake) ===${NC}"
    echo -e "${BLUE}Целевая директория: $target_dir${NC}"
    echo -e "${BLUE}Целевая кодировка: $target_encoding${NC}"
    echo
    
    # Проверяем зависимости
    check_dependencies
    
    # Проверяем существование директории
    if [ ! -d "$target_dir" ]; then
        error "Директория не найдена: $target_dir"
        exit 1
    fi
    
    # Исправляем имена файлов
    fix_filename_encoding "$target_dir" "$target_encoding"
    
    # Исправляем кодировку содержимого файлов
    log "Исправление кодировки содержимого файлов..."
    
    # Обрабатываем текстовые файлы
    find "$target_dir" -type f \( -name "*.txt" -o -name "*.md" -o -name "*.html" -o -name "*.htm" -o -name "*.css" -o -name "*.js" -o -name "*.xml" -o -name "*.json" \) | while read -r file; do
        fix_file_encoding "$file" "$target_encoding"
    done
    
    # Обрабатываем PDF файлы
    fix_pdf_metadata "$target_dir"
    
    log "Обработка завершена!"
    echo
    echo -e "${GREEN}Рекомендации:${NC}"
    echo "1. Проверьте резервные копии файлов (*.backup.*)"
    echo "2. Убедитесь, что все файлы отображаются корректно"
    echo "3. При необходимости удалите резервные копии"
    echo "4. Для PDF файлов может потребоваться дополнительная обработка"
}

# Обработка аргументов командной строки
show_help() {
    echo "Использование: $0 [директория] [кодировка]"
    echo
    echo "Аргументы:"
    echo "  директория  - путь к директории для обработки (по умолчанию: текущая)"
    echo "  кодировка   - целевая кодировка (по умолчанию: utf-8)"
    echo
    echo "Примеры:"
    echo "  $0                    # Обработать текущую директорию в UTF-8"
    echo "  $0 /path/to/files     # Обработать указанную директорию"
    echo "  $0 . utf-8           # Явно указать кодировку"
    echo
    echo "Поддерживаемые кодировки:"
    echo "  utf-8, cp1251, windows-1251, iso-8859-1, koi8-r"
}

# Проверяем аргументы
case "${1:-}" in
    -h|--help|help)
        show_help
        exit 0
        ;;
esac

# Запускаем основную функцию
main "${1:-.}" "${2:-utf-8}"

