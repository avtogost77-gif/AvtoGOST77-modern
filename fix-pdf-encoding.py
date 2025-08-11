#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для исправления проблем с кодировкой в PDF файлах
при переносе с Windows 10 на Ubuntu
"""

import os
import sys
import argparse
import shutil
from datetime import datetime
from pathlib import Path
import subprocess
import re

def log(message, level="INFO"):
    """Логирование с временными метками"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    colors = {
        "INFO": "\033[0;32m",    # Green
        "WARNING": "\033[1;33m", # Yellow
        "ERROR": "\033[0;31m",   # Red
        "RESET": "\033[0m"       # Reset
    }
    print(f"{colors.get(level, '')}[{timestamp}] {level}: {message}{colors['RESET']}")

def check_dependencies():
    """Проверка необходимых зависимостей"""
    dependencies = ['pdftk', 'exiftool']
    missing = []
    
    for dep in dependencies:
        try:
            subprocess.run([dep, '--version'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing.append(dep)
    
    if missing:
        log(f"Отсутствуют зависимости: {', '.join(missing)}", "ERROR")
        log("Установите их командой:", "WARNING")
        log("sudo apt-get install pdftk exiftool", "WARNING")
        return False
    
    return True

def detect_encoding(text):
    """Определение кодировки текста"""
    # Простые эвристики для определения кодировки
    if text.startswith('\ufeff'):  # UTF-8 BOM
        return 'utf-8-sig'
    
    # Проверяем на типичные символы mojibake
    mojibake_patterns = [
        (r'[а-яё]', 'cp1251'),  # Русские символы
        (r'[À-ÿ]', 'iso-8859-1'),  # Latin-1
        (r'[а-яё]', 'koi8-r'),  # KOI8-R
    ]
    
    for pattern, encoding in mojibake_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return encoding
    
    return 'utf-8'

def fix_text_encoding(text, from_encoding='cp1251', to_encoding='utf-8'):
    """Исправление кодировки текста"""
    try:
        # Пробуем разные варианты конвертации
        encodings_to_try = [from_encoding, 'windows-1251', 'cp866', 'koi8-r']
        
        for enc in encodings_to_try:
            try:
                # Декодируем из предполагаемой кодировки
                decoded = text.encode('latin1').decode(enc, errors='ignore')
                # Кодируем в целевую кодировку
                result = decoded.encode(enc).decode(to_encoding, errors='ignore')
                if result != text:
                    return result
            except (UnicodeEncodeError, UnicodeDecodeError):
                continue
        
        return text
    except Exception as e:
        log(f"Ошибка при конвертации текста: {e}", "ERROR")
        return text

def extract_pdf_metadata(pdf_path):
    """Извлечение метаданных из PDF"""
    metadata = {}
    
    try:
        # Пробуем pdftk
        result = subprocess.run(['pdftk', str(pdf_path), 'dump_data_utf8'], 
                              capture_output=True, text=True, check=True)
        metadata['pdftk'] = result.stdout
    except subprocess.CalledProcessError:
        try:
            # Пробуем без utf8
            result = subprocess.run(['pdftk', str(pdf_path), 'dump_data'], 
                                  capture_output=True, text=True, check=True)
            metadata['pdftk'] = result.stdout
        except subprocess.CalledProcessError:
            log(f"Не удалось извлечь метаданные pdftk из {pdf_path}", "WARNING")
    
    try:
        # Пробуем exiftool
        result = subprocess.run(['exiftool', '-j', str(pdf_path)], 
                              capture_output=True, text=True, check=True)
        metadata['exiftool'] = result.stdout
    except subprocess.CalledProcessError:
        log(f"Не удалось извлечь метаданные exiftool из {pdf_path}", "WARNING")
    
    return metadata

def fix_pdf_metadata_encoding(pdf_path, backup=True):
    """Исправление кодировки метаданных PDF"""
    pdf_path = Path(pdf_path)
    
    if not pdf_path.exists():
        log(f"Файл не найден: {pdf_path}", "ERROR")
        return False
    
    log(f"Обработка PDF: {pdf_path}")
    
    # Создаем резервную копию
    if backup:
        backup_path = pdf_path.with_suffix(f'.backup.{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf')
        shutil.copy2(pdf_path, backup_path)
        log(f"Создана резервная копия: {backup_path}")
    
    # Извлекаем метаданные
    metadata = extract_pdf_metadata(pdf_path)
    
    if not metadata:
        log("Не удалось извлечь метаданные", "ERROR")
        return False
    
    # Исправляем кодировку метаданных
    fixed_metadata = {}
    for tool, data in metadata.items():
        if data:
            fixed_data = fix_text_encoding(data)
            if fixed_data != data:
                fixed_metadata[tool] = fixed_data
                log(f"Исправлена кодировка метаданных ({tool})")
    
    # Обновляем PDF с исправленными метаданными
    success = False
    
    if 'pdftk' in fixed_metadata:
        try:
            # Создаем временный файл с метаданными
            info_file = pdf_path.with_suffix('.info')
            with open(info_file, 'w', encoding='utf-8') as f:
                f.write(fixed_metadata['pdftk'])
            
            # Обновляем PDF
            output_file = pdf_path.with_suffix('.fixed.pdf')
            subprocess.run(['pdftk', str(pdf_path), 'update_info_utf8', str(info_file), 
                          'output', str(output_file)], check=True)
            
            # Заменяем оригинальный файл
            shutil.move(output_file, pdf_path)
            success = True
            log("Метаданные PDF обновлены через pdftk")
            
            # Удаляем временный файл
            info_file.unlink()
            
        except subprocess.CalledProcessError as e:
            log(f"Ошибка при обновлении через pdftk: {e}", "ERROR")
    
    if not success and 'exiftool' in fixed_metadata:
        try:
            # Создаем временный JSON файл с метаданными
            json_file = pdf_path.with_suffix('.metadata.json')
            with open(json_file, 'w', encoding='utf-8') as f:
                f.write(fixed_metadata['exiftool'])
            
            # Обновляем PDF через exiftool
            subprocess.run(['exiftool', '-j=' + str(json_file), str(pdf_path)], check=True)
            success = True
            log("Метаданные PDF обновлены через exiftool")
            
            # Удаляем временный файл
            json_file.unlink()
            
        except subprocess.CalledProcessError as e:
            log(f"Ошибка при обновлении через exiftool: {e}", "ERROR")
    
    if success:
        log(f"✅ PDF успешно обработан: {pdf_path}")
    else:
        log(f"❌ Не удалось обработать PDF: {pdf_path}", "ERROR")
    
    return success

def process_directory(directory, recursive=True):
    """Обработка всех PDF файлов в директории"""
    directory = Path(directory)
    
    if not directory.exists():
        log(f"Директория не найдена: {directory}", "ERROR")
        return
    
    # Находим все PDF файлы
    pattern = '**/*.pdf' if recursive else '*.pdf'
    pdf_files = list(directory.glob(pattern))
    
    if not pdf_files:
        log(f"PDF файлы не найдены в {directory}")
        return
    
    log(f"Найдено {len(pdf_files)} PDF файлов")
    
    success_count = 0
    for pdf_file in pdf_files:
        if fix_pdf_metadata_encoding(pdf_file):
            success_count += 1
    
    log(f"Обработано успешно: {success_count}/{len(pdf_files)} файлов")

def main():
    parser = argparse.ArgumentParser(
        description="Исправление проблем с кодировкой в PDF файлах",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Примеры использования:
  %(prog)s file.pdf                    # Обработать один файл
  %(prog)s /path/to/directory          # Обработать все PDF в директории
  %(prog)s . --no-backup              # Обработать без создания резервных копий
  %(prog)s . --no-recursive           # Не обрабатывать поддиректории
        """
    )
    
    parser.add_argument('path', help='Путь к PDF файлу или директории')
    parser.add_argument('--no-backup', action='store_true', 
                       help='Не создавать резервные копии')
    parser.add_argument('--no-recursive', action='store_true',
                       help='Не обрабатывать поддиректории')
    parser.add_argument('--encoding', default='utf-8',
                       help='Целевая кодировка (по умолчанию: utf-8)')
    
    args = parser.parse_args()
    
    log("=== Скрипт исправления кодировки PDF файлов ===")
    
    # Проверяем зависимости
    if not check_dependencies():
        sys.exit(1)
    
    path = Path(args.path)
    
    if path.is_file():
        # Обрабатываем один файл
        if path.suffix.lower() == '.pdf':
            fix_pdf_metadata_encoding(path, backup=not args.no_backup)
        else:
            log("Указанный файл не является PDF", "ERROR")
            sys.exit(1)
    elif path.is_dir():
        # Обрабатываем директорию
        process_directory(path, recursive=not args.no_recursive)
    else:
        log(f"Путь не найден: {path}", "ERROR")
        sys.exit(1)
    
    log("Обработка завершена!")

if __name__ == '__main__':
    main()

