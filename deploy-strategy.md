# 🚀 СТРАТЕГИЯ ДЕПЛОЯ С СОХРАНЕНИЕМ АВТОГЕНЕРАЦИИ

## 📋 ПРОБЛЕМА
При деплое нашего архива мы затираем автоматически сгенерированные страницы:
- 15+ дополнительных страниц в routes/moskva/
- Страницы калькуляторов (если они генерировались)
- Другие автогенерированные страницы

## 🎯 РЕШЕНИЕ

### Вариант 1: СЕЛЕКТИВНЫЙ ДЕПЛОЙ (Рекомендуется)
```bash
# 1. Создать бэкап текущего состояния
cd /www/wwwroot/avtogost77.ru/
tar -czf backup-before-deploy-$(date +%Y%m%d-%H%M%S).tar.gz .

# 2. Распаковать наш архив во временную папку
mkdir /tmp/deploy-temp
cd /tmp/deploy-temp
wget https://raw.githubusercontent.com/avtogost77-gif/AvtoGOST77-modern/main/avtogost-deploy-20250806-094949.zip
unzip avtogost-deploy-20250806-094949.zip

# 3. Копировать только наши измененные файлы, НЕ затирая автогенерацию
cd /www/wwwroot/avtogost77.ru/

# Копируем основные файлы
cp /tmp/deploy-temp/*.html .
cp /tmp/deploy-temp/robots.txt .
cp /tmp/deploy-temp/sitemap.xml .
cp /tmp/deploy-temp/.htaccess .
cp -r /tmp/deploy-temp/assets/* assets/
cp /tmp/deploy-temp/*.xml .
cp /tmp/deploy-temp/*.json .
cp /tmp/deploy-temp/*.yml .

# НЕ ТРОГАЕМ папки routes/, industries/, calculators/
# Они содержат автогенерированные страницы!

# 4. Очистка
rm -rf /tmp/deploy-temp
```

### Вариант 2: ОБЪЕДИНЕНИЕ SITEMAP
```bash
# После селективного деплоя нужно объединить sitemap
cd /www/wwwroot/avtogost77.ru/

# Сохранить текущий sitemap с автогенерацией
cp sitemap.xml sitemap-auto.xml

# Скачать наш sitemap
wget -O sitemap-new.xml https://raw.githubusercontent.com/avtogost77-gif/AvtoGOST77-modern/main/sitemap.xml

# Объединить вручную или скриптом
# Нужно добавить в sitemap-new.xml все URL из sitemap-auto.xml, которых там нет
```

### Вариант 3: ЗАПУСТИТЬ ГЕНЕРАТОР ПОСЛЕ ДЕПЛОЯ
```bash
# После полного деплоя запустить генераторы
cd /www/wwwroot/avtogost77.ru/

# Установить зависимости
npm install

# Запустить генераторы
npm run generate:routes-extended
npm run generate:calculators
npm run generate:industries

# Обновить sitemap
npm run update:sitemap
```

## 🔍 ПРОВЕРКА ПОСЛЕ ДЕПЛОЯ
```bash
# 1. Проверить количество файлов
find . -name "*.html" -type f | wc -l
# Должно быть 180+ файлов

# 2. Проверить наличие критичных страниц
ls routes/moskva/moskva-ivanovo.html
ls routes/moskva/moskva-kostroma.html

# 3. Проверить sitemap
grep -c "<url>" sitemap.xml
# Должно быть 90+ URL
```

## ⚠️ ВАЖНО
1. НЕ затирать папки routes/, industries/, calculators/ при деплое
2. Всегда делать бэкап перед деплоем
3. После деплоя проверять количество страниц и sitemap
4. Рассмотреть возможность настройки CI/CD для автоматического объединения

## 🎯 РЕКОМЕНДАЦИЯ
Использовать **Вариант 1** (селективный деплой) + проверка sitemap.
Это самый безопасный способ, который сохранит автогенерированные страницы.