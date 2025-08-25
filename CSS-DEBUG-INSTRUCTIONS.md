# 🔧 Диагностика проблем с CSS

## Проблема
Браузер показывает 404 ошибки для CSS и JS файлов, но файлы присутствуют на сервере.

## Причина
Service Worker кэширует старую версию страницы с неправильными путями к файлам.

## Решение

### Шаг 1: Проверьте диагностические страницы
1. Откройте [отладочную страницу без SW](https://avtogost77.ru/debug-no-sw.html)
2. Если там CSS работает - проблема в Service Worker
3. Откройте [тестовую страницу CSS](https://avtogost77.ru/test-css.html)

### Шаг 2: Очистите кэш Service Worker
1. Откройте [страницу очистки кэша](https://avtogost77.ru/sw-cache-cleaner.html)
2. Нажмите **"Очистить весь кэш"**
3. Нажмите **"Очистить SW кэш"**
4. Нажмите **"Обновить SW"**

### Шаг 3: Перезагрузите страницы
1. Выполните принудительную перезагрузку главной страницы (Ctrl+F5)
2. Проверьте, что CSS загрузился

## Проверенные файлы
Все файлы доступны на сервере по правильным путям:
- ✅ `assets/css/master/master-styles.min.css`
- ✅ `assets/css/unified-site-styles.css`
- ✅ `assets/css/vendor/aos.min.css`
- ✅ `assets/js/bundles/critical-bundle.min.js`
- ✅ `assets/js/bundles/performance-bundle.min.js`
- ✅ `assets/js/vendor/aos.min.js`
- ✅ `assets/js/vendor/jspdf.umd.min.js`

## Если проблема не решилась
1. Очистите кэш браузера полностью
2. Попробуйте в режиме инкогнито
3. Проверьте на другом устройстве/браузере

