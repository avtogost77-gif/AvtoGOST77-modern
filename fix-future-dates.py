#!/usr/bin/env python3
"""
Исправляем даты из будущего в sitemap.xml
"""

import re
from datetime import datetime, timedelta

def fix_sitemap_dates():
    """Исправляем даты из будущего на текущие"""
    
    print("🔧 Исправляем даты в sitemap.xml...")
    
    # Читаем файл
    with open('sitemap.xml', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Текущая дата
    today = datetime.now()
    print(f"📅 Текущая дата: {today.strftime('%Y-%m-%d')}")
    
    # Счетчик изменений
    changes = 0
    
    # Функция для проверки и исправления даты
    def fix_date(match):
        nonlocal changes
        full_match = match.group(0)
        date_str = match.group(1)
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d')
            if date > today:
                # Если дата в будущем, заменяем на недавнюю дату
                if date.year > today.year or (date.year == today.year and date.month > today.month):
                    # Заменяем на дату 2025-01-05 (недавняя дата)
                    new_date_str = "2025-01-05"
                    print(f"  ❌ {date_str} -> ✅ {new_date_str}")
                    changes += 1
                    return f"<lastmod>{new_date_str}</lastmod>"
            return full_match
        except Exception as e:
            print(f"  ⚠️ Ошибка обработки даты {date_str}: {e}")
            return full_match
    
    # Заменяем даты
    new_content = re.sub(r'<lastmod>(\d{4}-\d{2}-\d{2})</lastmod>', fix_date, content)
    
    # Сохраняем только если были изменения
    if changes > 0:
        with open('sitemap.xml', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Исправлено дат: {changes}")
    else:
        print("ℹ️ Даты из будущего не найдены")

if __name__ == "__main__":
    fix_sitemap_dates()