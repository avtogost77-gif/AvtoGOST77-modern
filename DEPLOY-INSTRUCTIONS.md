# 📋 ИНСТРУКЦИЯ ПО ДЕПЛОЮ AVTOGOST77

## 🔍 Текущее состояние сервера:
- **Путь:** `/www/wwwroot/avtogost77.ru`
- **Размер:** ~10MB (без учета .git)
- **Пользователь:** www:www
- **Есть бекапы:** backup-20250805-004127, backup-old

## 📦 Что нужно сделать:

### 1. Загрузить архив на сервер
```bash
# Загрузите файл avtogost-deploy-20250805-210248.zip в папку:
cd /www/wwwroot/avtogost77.ru
```

### 2. Создать свежий бекап (ОБЯЗАТЕЛЬНО!)
```bash
# Создаем полный бекап текущей версии
tar -czf backup-full-$(date +%Y%m%d-%H%M%S).tar.gz --exclude='backup-*' --exclude='*.zip' --exclude='.git' .

# Проверяем что бекап создан
ls -lah backup-full-*.tar.gz
```

### 3. Распаковать новую версию
```bash
# Распаковываем архив
unzip avtogost-deploy-20250805-210248.zip

# Проверяем содержимое
ls -la avtogost-deploy-20250805-210248/
```

### 4. Обновить файлы
```bash
# Копируем все файлы с заменой
cp -rf avtogost-deploy-20250805-210248/* .

# ВАЖНО: Проверяем что новые страницы скопировались
ls -la *.html | grep -E "(transportnaya|sbornye|gruzoperevozki)"
```

### 5. Установить правильные права
```bash
# Права для владельца
chown -R www:www .

# Права для файлов
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;
chmod 644 .htaccess
chmod 644 robots.txt
chmod 644 sitemap.xml

# Права для директорий
find . -type d -exec chmod 755 {} \;
```

### 6. Очистить временные файлы
```bash
# Удаляем распакованную папку
rm -rf avtogost-deploy-20250805-210248/

# Удаляем старые zip архивы (опционально)
# rm -f ag77-*.zip
```

### 7. Проверить результат
```bash
# Проверяем что все новые страницы на месте
echo "=== Новые SEO страницы ==="
ls -la | grep transportnaya
ls -la | grep sbornye
ls -la | grep marketpleysy
ls -la | grep rc-dostavka
ls -la | grep gruzoperevozki
ls -la | grep logistika
```

## ✅ Чек-лист после деплоя:

### В браузере проверить:
1. ✅ https://avtogost77.ru/ - главная страница загружается
2. ✅ https://avtogost77.ru/transportnaya-kompaniya - работает без .html
3. ✅ https://avtogost77.ru/sbornye-gruzy - работает без .html
4. ✅ https://avtogost77.ru/robots.txt - открывается
5. ✅ https://avtogost77.ru/sitemap.xml - открывается

### В консоли проверить:
```bash
# Проверить размер
du -sh .

# Проверить количество HTML файлов (должно быть ~90+)
find . -name "*.html" -type f | wc -l

# Проверить что нет ошибок доступа
curl -I https://avtogost77.ru/transportnaya-kompaniya
```

## 🚨 Если что-то пошло не так:

### Откат к предыдущей версии:
```bash
# Удаляем все текущие файлы (кроме бекапов)
find . -maxdepth 1 ! -name 'backup-*' ! -name '.' -exec rm -rf {} \;

# Восстанавливаем из бекапа
tar -xzf backup-full-YYYYMMDD-HHMMSS.tar.gz

# Восстанавливаем права
chown -R www:www .
```

## 📊 Что изменилось:
- **Добавлено 9 новых SEO-страниц** (800K+ запросов/месяц)
- **Расширен контент главной** (2500+ слов)
- **Исправлены критические SEO-ошибки** (moskva → Москва)
- **Добавлены блоки доверия** (ИНН, ОГРНИП, клиенты)
- **Обновлен sitemap.xml** со всеми новыми страницами

## 🎯 Новые страницы:
1. `/transportnaya-kompaniya.html` - 727К запросов
2. `/sbornye-gruzy.html` - 15К запросов
3. `/dostavka-na-marketpleysy.html` - 8К запросов
4. `/rc-dostavka.html` - 50К запросов (информационный)
5. `/gruzoperevozki-spb.html` - 6К запросов
6. `/gruzoperevozki-ekaterinburg.html` - 3К запросов
7. `/logistika-dlya-biznesa.html` - 2К запросов (B2B)
8. `/gruzoperevozki-po-moskve.html` - 5.6К запросов
9. `/gruzoperevozki-iz-moskvy.html` - межгород

---
🚀 **Удачного деплоя!**