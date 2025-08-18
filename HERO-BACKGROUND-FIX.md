# Исправление фона в хиро-блоке

## Проблема
Фоновое изображение `hero-logistics.webp` не отображалось в хиро-блоке на главной странице.

## Решение
1. Создан новый файл `assets/css/hero-fix-2.css` с явными стилями для фона:
   ```css
   /* Исправление фонового изображения в хиро-блоке */
   .hero {
       background-image: url('../img/hero-logistics.webp') !important;
       background-position: center 30% !important;
       background-size: cover !important;
       background-repeat: no-repeat !important;
   }

   /* Уменьшение прозрачности градиента для лучшей видимости фона */
   .hero::before {
       background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%) !important;
       opacity: 0.8 !important;
   }

   /* Улучшение контраста текста */
   .hero h1, .hero-subtitle, .stat-number, .stat-label {
       text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7) !important;
   }

   /* Усиление эффекта параллакса для фонового изображения */
   @media (min-width: 992px) {
       .hero {
           background-attachment: fixed !important;
       }
   }
   ```

2. Обновлена ссылка на CSS в `index.html`:
   ```html
   <link rel="stylesheet" href="assets/css/hero-fix-2.css?v=20250817">
   ```

3. Файлы загружены на сервер через `deploy-final.sh` и дополнительно через прямую загрузку `scp`.

## Ключевые изменения
1. Явное указание фонового изображения через `background-image`
2. Уменьшение прозрачности градиента для лучшей видимости изображения
3. Усиление контраста текста для лучшей читаемости на фоне изображения
4. Добавление эффекта параллакса для десктопных устройств

## Результат
Фоновое изображение теперь должно корректно отображаться в хиро-блоке на главной странице, создавая правильное визуальное впечатление и улучшая UX.
