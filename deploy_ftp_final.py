#!/usr/bin/env python3
import ftplib
import os
import zipfile
import sys
from pathlib import Path

# FTP credentials
FTP_HOST = "31.31.197.43"
FTP_USER = "u3207373"
FTP_PASS = "fGX954fqGU2w3ruY"
FTP_DIR = "/www/avtogost77.ru"

def deploy_via_ftp():
    """Deploy website via FTP"""
    print(f"🚀 Начинаю деплой на {FTP_HOST}...")
    
    # Extract ZIP first
    zip_path = "AVTOGOST-CLEAN-DEPLOY-20250727-071750.zip"
    extract_dir = "temp_deploy"
    
    if not os.path.exists(zip_path):
        print(f"❌ Архив {zip_path} не найден!")
        return False
        
    print(f"📦 Распаковываю архив {zip_path}...")
    os.makedirs(extract_dir, exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    try:
        # Connect to FTP
        print(f"🔌 Подключаюсь к FTP {FTP_HOST}...")
        ftp = ftplib.FTP(timeout=30)
        ftp.connect(FTP_HOST, 21)
        ftp.login(FTP_USER, FTP_PASS)
        print("✅ Успешно подключился к FTP!")
        
        # Change to target directory
        print(f"📁 Переход в директорию {FTP_DIR}...")
        ftp.cwd(FTP_DIR)
        
        # Clean existing files
        print("🧹 Очистка существующих файлов...")
        try:
            files = ftp.nlst()
            for file in files:
                if file not in ['.', '..']:
                    try:
                        ftp.delete(file)
                        print(f"  Удален: {file}")
                    except:
                        # Might be a directory
                        try:
                            ftp.rmd(file)
                            print(f"  Удалена папка: {file}")
                        except:
                            pass
        except Exception as e:
            print(f"⚠️ Ошибка при очистке: {e}")
        
        # Upload all files
        print("📤 Загрузка файлов...")
        uploaded = 0
        
        for root, dirs, files in os.walk(extract_dir):
            # Calculate relative path
            rel_path = os.path.relpath(root, extract_dir)
            
            # Create directories
            if rel_path != '.':
                ftp_path = rel_path.replace('\\', '/')
                try:
                    ftp.mkd(ftp_path)
                    print(f"  Создана папка: {ftp_path}")
                except:
                    pass  # Directory might already exist
                    
            # Upload files
            for file in files:
                local_file = os.path.join(root, file)
                if rel_path == '.':
                    remote_file = file
                else:
                    remote_file = f"{rel_path}/{file}".replace('\\', '/')
                
                try:
                    with open(local_file, 'rb') as f:
                        ftp.storbinary(f'STOR {remote_file}', f)
                    uploaded += 1
                    print(f"  ✓ {remote_file}")
                except Exception as e:
                    print(f"  ✗ {remote_file}: {e}")
        
        print(f"\n✅ Загружено файлов: {uploaded}")
        
        # Set permissions for .htaccess
        try:
            ftp.sendcmd('SITE CHMOD 644 .htaccess')
            print("✅ Права для .htaccess установлены")
        except:
            pass
            
        ftp.quit()
        print("\n🎉 Деплой успешно завершен!")
        
        # Cleanup
        import shutil
        shutil.rmtree(extract_dir)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    deploy_via_ftp()