#!/usr/bin/env python3
import ftplib
import os
import sys
from pathlib import Path

# Данные для подключения
FTP_HOST = "31.31.197.43"
FTP_USER = "u3207373"
FTP_PASS = "5x8cZ19H0rWhh6Qt"
REMOTE_DIR = "www/avtogost77.ru"

def deploy():
    print("🚀 Python FTP Deploy Script")
    print("=========================")
    
    try:
        # Подключаемся
        print(f"📡 Подключаюсь к {FTP_HOST}...")
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("✅ Подключение успешно!")
        
        # Переходим в нужную директорию
        ftp.cwd(REMOTE_DIR)
        print(f"📂 Перешел в директорию: {REMOTE_DIR}")
        
        # Показываем текущее содержимое
        print("\n📋 Текущее содержимое сервера:")
        files = []
        ftp.retrlines('LIST', lambda x: files.append(x))
        for f in files[:10]:  # Показываем первые 10 файлов
            print(f"  {f}")
        if len(files) > 10:
            print(f"  ... и еще {len(files) - 10} файлов")
        
        # Загружаем критичные файлы
        print("\n📤 Загружаю основные файлы...")
        
        # HTML файлы
        critical_files = [
            'index.html',
            'robots.txt',
            'sitemap.xml',
            '.htaccess',
            'favicon.svg',
            'dadata-config.js'
        ]
        
        for filename in critical_files:
            if os.path.exists(filename):
                with open(filename, 'rb') as f:
                    ftp.storbinary(f'STOR {filename}', f)
                    print(f"  ✅ {filename}")
            else:
                print(f"  ⚠️  {filename} не найден")
        
        # CSS файлы
        print("\n📤 Загружаю CSS...")
        try:
            ftp.cwd('assets/css')
        except:
            ftp.mkd('assets')
            ftp.cwd('assets')
            ftp.mkd('css')
            ftp.cwd('css')
        
        css_files = ['main.css', 'mobile.css', 'styles.css', 'emergency-mobile-fix.css']
        for css in css_files:
            css_path = f'assets/css/{css}'
            if os.path.exists(css_path):
                with open(css_path, 'rb') as f:
                    ftp.storbinary(f'STOR {css}', f)
                    print(f"  ✅ {css}")
        
        # JS файлы
        print("\n📤 Загружаю JS...")
        ftp.cwd('..')
        try:
            ftp.cwd('js')
        except:
            ftp.mkd('js')
            ftp.cwd('js')
        
        js_files = ['main.js', 'emergency-fix.js', 'fias-integration.js', 'form-handler.js', 'calc.js']
        for js in js_files:
            js_path = f'assets/js/{js}'
            if os.path.exists(js_path):
                with open(js_path, 'rb') as f:
                    ftp.storbinary(f'STOR {js}', f)
                    print(f"  ✅ {js}")
        
        print("\n✅ Деплой завершен успешно!")
        print("🌐 Проверьте сайт: https://avtogost77.ru")
        
        ftp.quit()
        
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(deploy())