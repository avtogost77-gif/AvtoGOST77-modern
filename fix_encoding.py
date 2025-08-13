#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

def fix_filename_encoding(directory):
    """Исправляет кодировку имен файлов с cp1251 на utf-8"""
    
    if not os.path.exists(directory):
        print(f"Папка {directory} не найдена!")
        return
    
    print(f"Обрабатываем папку: {directory}")
    os.chdir(directory)
    
    files = os.listdir('.')
    
    for filename in files:
        if filename == '.' or filename == '..' or filename.startswith('.~lock'):
            continue
            
        # Пропускаем файлы с нормальными именами (уже исправленные)
        if filename in ['sfdgfhjhjhf.pdf'] or 'Вяземы' in filename or 'Казань' in filename or 'Новоселки' in filename:
            continue
            
        try:
            # Основной способ: latin1 -> cp1251
            new_name = filename.encode('latin1').decode('cp1251')
            
            # Проверяем что получилось что-то разумное (есть русские буквы)
            if new_name and any(c in new_name.lower() for c in 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'):
                
                # Проверяем что файл с таким именем еще не существует
                counter = 1
                original_new_name = new_name
                while os.path.exists(new_name):
                    name, ext = os.path.splitext(original_new_name)
                    new_name = f"{name}_{counter}{ext}"
                    counter += 1
                
                print(f"Переименовываем: {filename[:50]}... -> {new_name[:50]}...")
                os.rename(filename, new_name)
            
        except Exception as e:
            print(f"Ошибка с файлом {filename[:30]}...: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = "/home/oem123/Рабочий стол/Заявки Шаблоны/"
    
    fix_filename_encoding(directory)
    print("Готово!")