# Руководство по исправлению Mojibake (проблем с кодировкой)

## Что такое Mojibake?

**Mojibake** (文字化け) - это искажение текста, возникающее при неправильной интерпретации кодировки символов. Часто встречается при переносе файлов между разными операционными системами, особенно с Windows на Linux.

### Типичные симптомы:
- Русские символы отображаются как `Ð°Ð±Ð²` или `ÃÃÃ`
- Названия файлов выглядят как `ÐÐ¾ÐºÑÐ¼ÐµÐ½Ñ.pdf`
- Текст в PDF файлах читается нормально, но метаданные (названия, автор) искажены

## Причины возникновения

1. **Windows использует CP1251/Windows-1251** для русских символов
2. **Linux использует UTF-8** по умолчанию
3. **PDF файлы** могут содержать метаданные в разных кодировках
4. **Имена файлов** могут быть закодированы в CP1251

## Решение проблемы

### 1. Установка зависимостей

```bash
# Основные инструменты
sudo apt-get update
sudo apt-get install iconv file pdftk exiftool

# Дополнительные инструменты (опционально)
sudo apt-get install convmv recode
```

### 2. Использование скриптов

#### Bash скрипт (fix-mojibake.sh)

**Для всех типов файлов:**

```bash
# Сделать скрипт исполняемым
chmod +x fix-mojibake.sh

# Обработать текущую директорию
./fix-mojibake.sh

# Обработать конкретную директорию
./fix-mojibake.sh /path/to/your/files

# Обработать с другой кодировкой
./fix-mojibake.sh . utf-8

# Показать справку
./fix-mojibake.sh --help
```

#### Python скрипт (fix-pdf-encoding.py)

**Специально для PDF файлов:**

```bash
# Сделать скрипт исполняемым
chmod +x fix-pdf-encoding.py

# Обработать один PDF файл
./fix-pdf-encoding.py document.pdf

# Обработать все PDF в директории
./fix-pdf-encoding.py /path/to/pdfs

# Обработать без создания резервных копий
./fix-pdf-encoding.py . --no-backup

# Не обрабатывать поддиректории
./fix-pdf-encoding.py . --no-recursive
```

### 3. Ручные команды

#### Исправление имен файлов

```bash
# Переименование файлов с исправлением кодировки
convmv -f cp1251 -t utf8 --notest *

# Альтернативный способ
for file in *; do
    new_name=$(echo "$file" | iconv -f cp1251 -t utf8)
    if [ "$file" != "$new_name" ]; then
        mv "$file" "$new_name"
    fi
done
```

#### Исправление содержимого файлов

```bash
# Конвертация текстового файла
iconv -f cp1251 -t utf8 input.txt > output.txt

# Конвертация с игнорированием ошибок
iconv -f cp1251 -t utf8//IGNORE input.txt > output.txt

# Пакетная обработка всех .txt файлов
for file in *.txt; do
    iconv -f cp1251 -t utf8 "$file" > "${file}.utf8"
    mv "${file}.utf8" "$file"
done
```

#### Исправление PDF метаданных

```bash
# Извлечение метаданных
pdftk document.pdf dump_data > metadata.txt

# Исправление кодировки метаданных
iconv -f cp1251 -t utf8 metadata.txt > metadata_utf8.txt

# Обновление PDF
pdftk document.pdf update_info_utf8 metadata_utf8.txt output document_fixed.pdf

# Альтернативный способ через exiftool
exiftool -Title="Новое название" -Author="Новый автор" document.pdf
```

## Пошаговое решение для PDF файлов

### Шаг 1: Диагностика

```bash
# Проверить кодировку файла
file -i document.pdf

# Посмотреть метаданные
exiftool document.pdf

# Извлечь метаданные через pdftk
pdftk document.pdf dump_data
```

### Шаг 2: Создание резервной копии

```bash
cp document.pdf document.pdf.backup
```

### Шаг 3: Исправление метаданных

```bash
# Извлечь метаданные
pdftk document.pdf dump_data > metadata.txt

# Исправить кодировку (если нужно)
iconv -f cp1251 -t utf8 metadata.txt > metadata_utf8.txt

# Обновить PDF
pdftk document.pdf update_info_utf8 metadata_utf8.txt output document_fixed.pdf

# Заменить оригинал
mv document_fixed.pdf document.pdf
```

### Шаг 4: Проверка результата

```bash
# Проверить метаданные
exiftool document.pdf

# Открыть PDF и проверить отображение
```

## Автоматизация для больших объемов

### Скрипт для пакетной обработки

```bash
#!/bin/bash
# batch-fix-pdf.sh

for pdf in *.pdf; do
    echo "Обработка: $pdf"
    
    # Создать резервную копию
    cp "$pdf" "${pdf}.backup"
    
    # Извлечь метаданные
    pdftk "$pdf" dump_data > "${pdf}.metadata"
    
    # Исправить кодировку
    iconv -f cp1251 -t utf8 "${pdf}.metadata" > "${pdf}.metadata_utf8"
    
    # Обновить PDF
    pdftk "$pdf" update_info_utf8 "${pdf}.metadata_utf8" output "${pdf}.fixed"
    
    # Заменить оригинал
    mv "${pdf}.fixed" "$pdf"
    
    # Удалить временные файлы
    rm "${pdf}.metadata" "${pdf}.metadata_utf8"
    
    echo "Готово: $pdf"
done
```

## Полезные команды для диагностики

```bash
# Определить кодировку файла
file -bi filename

# Посмотреть hex-дамп начала файла
hexdump -C filename | head -5

# Проверить BOM (Byte Order Mark)
od -t x1 filename | head -1

# Найти файлы с определенной кодировкой
find . -type f -exec file -bi {} \; | grep "charset="

# Проверить локаль системы
locale

# Установить локаль для UTF-8
export LC_ALL=C.UTF-8
```

## Предотвращение проблем в будущем

### Настройка системы

```bash
# Установить UTF-8 локаль
sudo locale-gen ru_RU.UTF-8
sudo update-locale LANG=ru_RU.UTF-8

# Добавить в ~/.bashrc
export LANG=ru_RU.UTF-8
export LC_ALL=ru_RU.UTF-8
```

### Настройка приложений

```bash
# Для файлового менеджера (если используется)
export NEMO_PREFERENCES="encoding=utf-8"

# Для текстовых редакторов
# В nano: set encoding=utf-8
# В vim: set encoding=utf-8
```

## Часто задаваемые вопросы

### Q: Скрипт не работает с некоторыми файлами
A: Попробуйте другие кодировки: `windows-1251`, `koi8-r`, `iso-8859-1`

### Q: PDF файлы повреждены после обработки
A: Всегда создавайте резервные копии. Используйте флаг `--no-backup` только для тестирования

### Q: Имена файлов все еще искажены
A: Используйте `convmv` для переименования файлов с не-ASCII символами

### Q: Метаданные PDF не обновляются
A: Убедитесь, что установлен `pdftk` и `exiftool`. Попробуйте оба инструмента

## Контакты и поддержка

Если у вас возникли проблемы с использованием скриптов:

1. Проверьте, что все зависимости установлены
2. Убедитесь, что у вас есть права на запись в директорию
3. Создайте резервные копии перед обработкой
4. Проверьте логи выполнения скриптов

---

**Дата создания:** $(date +%Y-%m-%d)  
**Версия:** 1.0  
**Автор:** AI Assistant

