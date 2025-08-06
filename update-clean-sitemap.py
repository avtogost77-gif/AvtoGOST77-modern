#!/usr/bin/env python3
"""
Обновляем sitemap.xml только с качественными страницами (без автогена)
"""

import os
from datetime import datetime
import glob

def generate_clean_sitemap():
    """Генерируем чистый sitemap без автогенерированных страниц"""
    
    # Базовый URL
    base_url = "https://avtogost77.ru"
    
    # Текущая дата
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Собираем все HTML файлы в корне
    html_files = []
    
    # Основные страницы
    core_pages = [
        ('/', 'weekly', '1.0'),
        ('/transportnaya-kompaniya.html', 'weekly', '0.9'),
        ('/sbornye-gruzy.html', 'weekly', '0.9'),
        ('/dostavka-na-marketpleysy.html', 'weekly', '0.9'),
        ('/rc-dostavka.html', 'weekly', '0.9'),
        ('/gruzoperevozki-spb.html', 'weekly', '0.9'),
        ('/gruzoperevozki-ekaterinburg.html', 'weekly', '0.9'),
        ('/logistika-dlya-biznesa.html', 'weekly', '0.9'),
        ('/gruzoperevozki-po-moskve.html', 'weekly', '0.9'),
        ('/gruzoperevozki-iz-moskvy.html', 'weekly', '0.9'),
        ('/services.html', 'monthly', '0.8'),
        ('/about.html', 'monthly', '0.8'),
        ('/contact.html', 'monthly', '0.8'),
        ('/help.html', 'monthly', '0.7'),
        ('/faq.html', 'monthly', '0.7'),
        ('/privacy.html', 'yearly', '0.5'),
        ('/terms.html', 'yearly', '0.5'),
        ('/track.html', 'monthly', '0.7'),
        ('/urgent-delivery.html', 'weekly', '0.8'),
        ('/self-employed-delivery.html', 'weekly', '0.8'),
        ('/ip-small-business-delivery.html', 'weekly', '0.8'),
    ]
    
    # Блог статьи
    blog_pages = []
    for i in range(1, 11):
        blog_file = f'blog-{i}-*.html'
        files = glob.glob(blog_file)
        for file in files:
            blog_pages.append((f'/{file}', 'monthly', '0.7'))
    
    # Блог главная
    if os.path.exists('blog/index.html'):
        blog_pages.append(('/blog/', 'weekly', '0.8'))
    
    # Генерируем sitemap
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'''
    
    # Добавляем основные страницы
    for url, freq, priority in core_pages:
        # Проверяем существование файла
        file_path = url.strip('/') if url != '/' else 'index.html'
        if url == '/' or os.path.exists(file_path):
            sitemap_content += f'''
    <url>
        <loc>{base_url}{url}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>{freq}</changefreq>
        <priority>{priority}</priority>
    </url>'''
    
    # Добавляем блог
    for url, freq, priority in blog_pages:
        sitemap_content += f'''
    <url>
        <loc>{base_url}{url}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>{freq}</changefreq>
        <priority>{priority}</priority>
    </url>'''
    
    sitemap_content += '''
</urlset>'''
    
    # Сохраняем
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    # Считаем количество URL
    url_count = sitemap_content.count('<url>')
    print(f"✅ Sitemap обновлен! Добавлено {url_count} страниц")
    
    # Показываем статистику
    print(f"📊 Только качественный контент:")
    print(f"   🏠 Основные страницы: {len([p for p in core_pages if p[0] == '/' or os.path.exists(p[0].strip('/') if p[0] != '/' else 'index.html')])}")
    print(f"   📝 Блог: {len(blog_pages)}")
    print(f"   🚫 Автоген (routes/industries/calculators): 0")

if __name__ == "__main__":
    generate_clean_sitemap()