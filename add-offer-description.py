#!/usr/bin/env python3
"""Добавление description к Offer элементам"""

import os
import re
import json

def add_offer_description(filepath):
    """Добавляет description к Offer элементам"""
    print(f"Обрабатываю {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Ищем все JSON-LD блоки
    pattern = r'<script type="application/ld\+json">\s*(\{[^<]+\})\s*</script>'
    
    def fix_schema(match):
        json_str = match.group(1)
        try:
            data = json.loads(json_str)
            modified = False
            
            # Проверяем hasOfferCatalog
            if 'hasOfferCatalog' in data and 'itemListElement' in data['hasOfferCatalog']:
                for item in data['hasOfferCatalog']['itemListElement']:
                    if item.get('@type') == 'Offer' and 'description' not in item:
                        # Добавляем description из itemOffered или создаем новое
                        if 'itemOffered' in item and 'description' in item['itemOffered']:
                            item['description'] = item['itemOffered']['description']
                        else:
                            item['description'] = item.get('name', 'Услуга грузоперевозки')
                        modified = True
            
            if modified:
                print(f"  ✓ Добавлен description к Offer элементам")
                return f'<script type="application/ld+json">\n{json.dumps(data, ensure_ascii=False, indent=2)}\n</script>'
                
        except json.JSONDecodeError:
            print(f"  Ошибка парсинга JSON в {filepath}")
        
        return match.group(0)
    
    # Заменяем все JSON-LD блоки
    new_content = re.sub(pattern, fix_schema, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

# Список файлов для проверки
files_to_check = [
    '/workspace/index.html',
    '/workspace/sbornye-gruzy.html',
    '/workspace/dostavka-na-marketpleysy.html',
    '/workspace/transportnaya-kompaniya.html',
    '/workspace/gruzoperevozki-spb.html',
    '/workspace/gruzoperevozki-ekaterinburg.html',
    '/workspace/logistika-dlya-biznesa.html',
    '/workspace/gruzoperevozki-po-moskve.html',
    '/workspace/gruzoperevozki-iz-moskvy.html'
]

fixed_count = 0
for filepath in files_to_check:
    if os.path.exists(filepath):
        if add_offer_description(filepath):
            fixed_count += 1

print(f"\n✅ Обработано файлов: {fixed_count}")