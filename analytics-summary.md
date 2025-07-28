# 📊 ИСТОРИЯ АНАЛИТИЧЕСКИХ КОДОВ - АвтоГОСТ

## 🎯 АКТУАЛЬНЫЕ КОДЫ (В ИСПОЛЬЗОВАНИИ)

### Google Analytics 4
- **Код**: `G-EMQ3D0X8K7`
- **Статус**: ✅ Активный
- **Используется в**: index.html, index-final.html, help.html, terms.html, track.html, faq-seo-optimized.html, blog-*.html
- **Назначение**: Основная веб-аналитика

### Yandex Metrika  
- **Код**: `98832562`
- **Статус**: ✅ Активный
- **Используется в**: index.html, index-final.html, track.html
- **Назначение**: Российская веб-аналитика с тепловыми картами

## 📜 УСТАРЕВШИЕ КОДЫ (НЕ ИСПОЛЬЗУЮТСЯ)

### Google Analytics 4 (старый)
- **Код**: `G-BZZPY2YQPP`
- **Статус**: ❌ Заменен
- **История**: Упоминался в переписке, но не найден в файлах
- **Заменен на**: G-EMQ3D0X8K7

### Yandex Metrika (старый)
- **Код**: `103413788` 
- **Статус**: ❌ Устарел
- **Используется в**: services.html, privacy.html, about.html, news.html, marketplace-delivery.html, urgent-delivery.html, moscow-regions.html, faq.html, contact.html
- **Заменен на**: 98832562

## 🔧 ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ

### Для новых страниц:
```html
<!-- Вставить в <head> -->
<!-- #include virtual="/includes/analytics.html" -->
```

### Или напрямую:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-EMQ3D0X8K7"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-EMQ3D0X8K7');
</script>

<!-- Yandex Metrika -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
    ym(98832562, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
    });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/98832562" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
```

## 📈 СТАТИСТИКА ВНЕДРЕНИЯ

### ✅ С актуальными кодами (G-EMQ3D0X8K7 + 98832562):
- index.html
- index-final.html
- track.html
- help.html
- terms.html
- blog-*.html

### ⚠️ С устаревшими кодами (требуют обновления):
- services.html (103413788)
- privacy.html (103413788)
- about.html (103413788)
- news.html (103413788)
- marketplace-delivery.html (103413788)
- urgent-delivery.html (103413788)
- moscow-regions.html (103413788)
- faq.html (103413788)
- contact.html (103413788)

### ❌ Без аналитики (7,863 сгенерированных страниц):
- Все автоматически созданные страницы маршрутов
- Требуют добавления инклюда

## 🎯 ПЛАН ДЕЙСТВИЙ

1. **Обновить устаревшие страницы** - заменить 103413788 на 98832562
2. **Добавить аналитику на сгенерированные страницы** - использовать инклюд
3. **Создать единый шаблон** для всех новых страниц
4. **Настроить цели в Google Analytics** для отслеживания конверсий
5. **Настроить события в Yandex Metrika** для детальной аналитики

## 📊 МЕТРИКИ ДЛЯ ОТСЛЕЖИВАНИЯ

### Google Analytics:
- Просмотры страниц
- Пользователи
- Сеансы
- Показатель отказов
- Время на сайте
- Конверсии (заполнение калькулятора)

### Yandex Metrika:
- Тепловые карты
- Записи сеансов
- Скролл-карты
- Формы аналитика
- Кик-аналитика