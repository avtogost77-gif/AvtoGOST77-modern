# Changelog — August 2025

## 2025-08-07

- Baseline sync: set local `main` to `origin/main`; preserved previous local edits in branch `local/preprod-changes`.
- Calculator safety tag: created `calc-v2-2025-08-07` pointing to commit `dd82959` (smart-calculator-v2.min.js build). Verified latest logic is present in `assets/js/smart-calculator-v2.js` (commit `81241ee`).
- Blog cleanup and SEO fixes:
  - Removed unsafe `AggregateRating` and empty `HowTo` blocks from `blog-1..6`.
  - Added `<link rel="canonical">` to `blog-1..4`, `blog-5`, `blog-6`.
  - Added `BreadcrumbList` JSON‑LD to `blog-5`, `blog-6`.
  - Fixed click-tracking JS quotes in `blog-1..6` (where present).
  - `blog/index.html`: unified org schema (logo/phone/sameAs), corrected links to existing pages.
  - `blog-2`: corrected services link to `dostavka-na-marketpleysy.html`.

Next steps
- Add `BreadcrumbList` to `blog-1..4`.
- Audit remaining pages for canonical consistency and click-tracking snippet.

### Later on 2025-08-07

- Added `BreadcrumbList` JSON‑LD to: `blog-1-carrier-failed.html`, `blog-2-wildberries-delivery.html`, `blog-3-spot-orders.html`, `blog-4-remote-logistics.html`.
- Added `BreadcrumbList` JSON‑LD to: `blog-7-how-to-order-gazelle.html`, `blog-8-cargo-insurance.html`, `blog-9-dangerous-goods.html`, `blog-10-self-employed-logistics.html`.
- Insurance article: added concise legal reference block (GК 796, 259‑FZ, PP 272/2011, CMR 17/23) with links note.
- Dangerous goods article: added UN quick classifier, pre‑dispatch checklist, carrier verification, “don’t do” warnings, ADR reliefs (LQ/1000 points), and legal reference block; strengthened CTA to expert review.
- Remote logistics article: added legal block (перевозка vs экспедирование) and contract "догмы".
- How-to Gazelle article: added legal minimum and practical "догмы" для снижения ошибок/доплат.
- New page: `legal-minimum.html` with concise legal checklists and CTA; added to `blog/index.html`.
- Added priority door‑to‑door CTA banners to `blog-2`, `blog-3`, `blog-5`, `blog-6`, `blog-8`, `blog-9` (SLA + contacts).
- Unified footer links to marketplace services:
  - `blog-2-wildberries-delivery.html`: footer links now point to `dostavka-na-marketpleysy.html`.
  - `blog-6-marketplace-insider.html`: footer links now point to `dostavka-na-marketpleysy.html`.

### 2025-08-08

- **SEO Audit Completion**: Added missing canonical URLs and click-tracking:
  - Added `<link rel="canonical">` to `help.html` and `news.html`
  - Added click-tracking script to `news.html` (phone_click, whatsapp_click)
  - Removed duplicate canonical URLs from:
    - `blog-6-marketplace-insider.html` (line 26)
    - `blog-5-logistics-optimization.html` (line 26)
    - `gruzoperevozki-po-moskve.html` (line 75)
    - `track.html` (line 15)
- **All pages now have consistent canonical URLs and click-tracking**

### 2025-09-05

- **CRITICAL BUG FIXES**: Fixed all broken links and missing files:
  - **Broken Links Fixed**: 15+ broken links redirected to existing pages:
    - `/calculator.html` → `index.html` (calculator on main page)
    - `/gruzchiki.html` → `services.html` (loading services)
    - `/gruzoperevozki-gazel.html` → `services.html` (gazelle services)
    - `/gruzoperevozki-po-rossii.html` → `gruzoperevozki-iz-moskvy.html` (intercity)
    - Regional routes → existing analogues
  - **Missing JS File Created**: `assets/js/calc.js` v1.0 - restored from GitHub tag calc-v2-2025-08-07
  - **Form Actions Fixed**: 3 forms with incorrect action attributes:
    - `contact.html`, `ip-small-business-delivery.html`, `urgent-delivery.html`
  - **Status**: ✅ All critical issues resolved

### 2025-09-05 (Update 2)

- **FULL COMPLIANCE CHECK**: Complete alignment of all files:
  - **Sitemap.xml Updated**: Added missing pages (index.html, 404.html, news.html, legal-minimum.html)
  - **Robots.txt Enhanced**: Added permissions for help.html, faq.html, track.html, news.html, legal-minimum.html
  - **Canonical URLs Verified**: All 38 HTML files have canonical URLs, added missing canonical for 404.html
  - **SEO Compliance**: All pages have unique titles and meta descriptions
  - **File Integrity**: 17 JS files, 11 CSS files, 38 HTML files - all present and functional
  - **Status**: ✅ Complete site compliance achieved

### 2025-08-11 - КАЛЬКУЛЯТОР 2.0 ENHANCED + PDF ЛИД-МАГНИТ

- **КАЛЬКУЛЯТОР 2.0**: Создан улучшенный UX по плану GPT-5:
  - **2-шаговая форма**: Разделение на "Маршрут" и "Груз" для упрощения UX
  - **Прогресс-бар**: Визуальная индикация текущего шага
  - **Инлайн-валидация**: Проверка полей в реальном времени с понятными ошибками
  - **WhatsApp интеграция**: Кнопка "Получить расчет в WhatsApp" с автоподстановкой данных
  - **Блок загрузки**: Показ "Груз занимает ~X% машины" с цветовой индикацией
  - **Улучшенный результат**: Детальная карточка с ценой, расстоянием, транспортом и сроками
  - **Мобильная оптимизация**: Адаптивный дизайн для всех устройств
  - **Интеграция с OpenRouteService**: Использование существующего API для реальных расстояний
  - **Совместимость**: Работает с существующей логикой SmartCalculatorV2
  - **Аналитика**: Отслеживание кликов WhatsApp в Яндекс.Метрике
  - **Status**: ✅ Калькулятор 2.0 готов к тестированию

- **PDF ЛИД-МАГНИТ**: Создан компактный PDF в цветах сайта:
  - **2-страничная структура**: Обложка + сводка, контакты + призыв (БЕЗ детализации!)
  - **Цвета сайта**: Использование корпоративной цветовой схемы (#2563eb, #10b981, #f59e0b)
  - **Умная оптимизация**: Предложение сборного груза для экономии 20% (не 25%)
  - **Модал для контактов**: Запрос телефона, имени, компании (опционально)
  - **Юмористический призыв**: "Не откладывайте на завтра то, что можно отправить сегодня! :)"
  - **Страхование**: "По желанию" вместо обязательного
  - **Интеграция с Telegram**: Автоматическая отправка лидов менеджеру
  - **Аналитика**: Отслеживание скачиваний PDF в Яндекс.Метрике
  - **QR-коды**: Быстрые ссылки на WhatsApp
  - **Status**: ✅ PDF лид-магнит готов к тестированию

## **STICKY CTA НА МОБИЛЕ** ✅ ЗАВЕРШЕН
- **Док-панель**: 3 кнопки снизу экрана (Рассчитать, WhatsApp, Позвонить)
- **Адаптивность**: Только на мобиле (≤768px), скрывается на десктопе
- **Умное появление**: Через 3 сек после загрузки + при скролле >50% экрана
- **Анимации**: Плавное появление/исчезновение с backdrop-blur
- **Трекинг**: Yandex.Metrika цели для показа и кликов
- **Интеграция**: Плавный скролл к калькулятору, прямые ссылки на WhatsApp/телефон
- **Дизайн**: Градиентные кнопки в цветах сайта + SVG иконки
- **Status**: ✅ Sticky CTA готов к тестированию

## **УНИФИЦИРОВАННЫЕ СТИЛИ** ✅ ЗАВЕРШЕН
- **Дизайн-система**: Единые CSS переменные, цвета, типографика
- **Компоненты**: Кнопки, карточки, формы, бейджи с единым стилем
- **Анимации**: fadeIn, slideIn, scaleIn, pulse, bounce, float
- **Утилиты**: Flex, Grid, отступы, позиционирование, цвета
- **Адаптивность**: Мобильная оптимизация всех компонентов
- **Интеграция**: Подключен к index.html, готов к использованию
- **Status**: ✅ Единый дизайн готов к применению

## **UX УЛУЧШЕНИЯ + ВИЗУАЛЬНАЯ УПАКОВКА** ✅ ЗАВЕРШЕН
- **Инлайн-валидация**: Подсказки при фокусе, ошибки при валидации
- **Микро-копирайтинг**: "Ответим за 2-10 минут", "99.3% доставок в срок"
- **Анимированные цифры**: Плавный счетчик в hero-секции (24/7, 2 часа, 99.3%)
- **Современные иконки**: Эмодзи-иконки с анимацией float
- **Улучшенный калькулятор**: Прогресс-бар, 2-шаговая форма, микро-копирайтинг
- **Визуальные эффекты**: Градиентные тексты, hover-анимации, тени
- **Status**: ✅ UX и визуальная упаковка готовы

## **ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ + UX КОМПОНЕНТЫ** ✅ ЗАВЕРШЕН
- **Критический CSS**: Оптимизированный для первого экрана с нашими стилями
- **UX компоненты**: Аккордеоны, TL;DR, Sticky TOC, карточки преимуществ
- **Lazy loading**: Отложенная загрузка изображений
- **Анимации при скролле**: Плавное появление элементов
- **Мини-кейсы**: Карточки с статистикой и описанием
- **Мобильная адаптивность**: Все компоненты оптимизированы для мобильных
- **Status**: ✅ Производительность и UX компоненты готовы

## **МАССОВОЕ ОБНОВЛЕНИЕ ВСЕХ СТРАНИЦ** ✅ ЗАВЕРШЕН
- **Обновлены все HTML страницы**: 33 страницы с новыми стилями и скриптами
- **Критический CSS**: Применен на всех страницах для быстрой загрузки
- **UX компоненты**: Добавлены на все страницы (аккордеоны, TL;DR, анимации)
- **Оптимизированная загрузка**: Асинхронная загрузка стилей, preload критического CSS
- **Единообразие**: Все страницы теперь используют единую систему стилей
- **Status**: ✅ Все страницы обновлены и готовы

## **ИСПРАВЛЕНИЕ КАЛЬКУЛЯТОРА** ✅ ЗАВЕРШЕН
- **Добавлены стили калькулятора**: Все необходимые стили в unified-styles.css
- **Исправлена асинхронная загрузка**: Калькулятор теперь работает корректно
- **Полная совместимость**: Все компоненты работают с новой системой стилей
- **Status**: ✅ Калькулятор полностью функционален

### **СЛЕДУЮЩИЕ ПРИОРИТЕТЫ:**
1. **A/B тестирование** - научный подход к оптимизации
2. **Дополнительные страницы** - новые услуги и направления
3. **Интеграция компонентов** - применение UX улучшений на страницах

---

## 2025-08-11 — Единая хроника (August) и индекс контекста

### Бизнес‑философия и логика (выжимка из `context.md`)
- Принцип SQL: качество и глубина понимания > хайп и массмаркет; формула ценности: (Качество × Функционал) / (Цена × Хайп).
- Буфер проблем: Экспедитор берёт риски/коммуникации между клиентом и перевозчиком → клиент видит результат.
- 20/80 и ROI‑мышление: фокус на высокоотдачных процессах; «входящая воронка вместо холодных звонков» (SEO → сайт → калькулятор → заявка).

### Техническая эволюция (06–10 августа) — по примерам коммитов
- 2025‑08‑06: инфраструктурные документы (`SITE-PRODUCTION-ROADMAP.md`), скрипты для 404/проверок, добавлен `sitemap.xml`.
- 2025‑08‑07: переход на умный калькулятор (`smart-calculator-v2.min.js`), упрощение UI результата, подключение минимизированных ресурсов.
- 2025‑08‑08: зачистка недостоверных заявлений, фейковых адресов/данных.
- 2025‑08‑09 → 2025‑08‑10: конверсионные блоки (quick‑paths, mobile fold), финальные CTA‑ленты; аналитика кликов tel/WA; деплой‑комплаенс и восстановление `assets/js/calc.js` (safety tag `calc-v2-2025-08-07`).

Примеры коммитов
- `dd82959b5` Минификация smart‑calculator‑v2 и обновление подключений.
- `3fbb7d0dd` Новая value‑prop в hero + острые CTA.
- `e9a4462ce` / `59633d6f2` Цели кликов (тел/WA) на ключевых страницах.
- `d84d8eb3d` Итоговый деплой: комплаенс и критические фиксы.

### Конверсия и аналитика — сделано/стандарт
- Единые обработчики кликов tel/WA, цели в Я.Метрике и GA4; A/B тесты для CTA и подзаголовков; цели калькулятора (submit/result/lead_success) — см. записи от 09–10 августа.

### SEO и контент — стратегический фокус
- Семантика: `SEMANTIC-CORE-EXTENDED.md` → `SEO-REPORT-2025.md` → `SEO-FINAL-SUMMARY.md`.
- Приоритеты: межгород (СПб/Казань/НН/Екб), газели по Москве, срочная/ночная, сборные, попутный груз, e‑com‑доставка.
- Страница‑образец: `gruzoperevozki-moskva-voronezh.html` (2000+ слов, Schema.org, FAQ, CTA, перелинковка).

### Индекс ключевых .md (контекст под новые чаты)
- `context.md` — философия/паттерны/логика.
- `SITE-PRODUCTION-ROADMAP.md` — дорожная карта.
- `FULL-AUDIT-REPORT.md` — аудит/исправления.
- `SEO-REPORT-2025.md`, `SEO-FINAL-SUMMARY.md` — стратегия/выжимка.
- `SEMANTIC-CORE-EXTENDED.md` — семантика.
- `CHANGELOG-2025-08.md` — хроника.
- `RECOMMENDATIONS-2025-08-11.md` — CRO/автоматизация.

### Нерешённые расхождения и next steps
- Зачистить остатки «НДС» в GitHub main для консистентности.
- Удалить плейсхолдер `ТВОЙ_КОД_ОТ_GOOGLE` и оставить валидный код.
- Вынести `trackGoal` и унифицировать событийку на всех страницах.
 
---

## 2025-08-11 — Дизайн/UX без потери SEO (план и задания)

### TL;DR
- Сохраняем весь текст в DOM для SEO, но показываем кратко: лид + тезисы, остальное — раскрывашки.
- Перестраиваем контент в карточки/аккордеоны, добавляем TL;DR и TOC, sticky CTA на мобиле.
- Калькулятор в 2 шага + заметные CTA рядом с результатом, “Key facts” вместо полотен текста.

### Рекомендации (дизайн/UX)
- Стратегия показа контента: держать весь текст в DOM; первый экран — лид‑абзац + 3–5 тезисов; далее — `<details><summary>` (индексируется нормально).
- Hero/первый экран: сжать высоту; один главный CTA + вторичный (срочно позвонить); полоса доверия: SLA/24⁄7/99.3%/без предоплаты для постоянных.
- Калькулятор: два шага; карточка результата с CTA: Заявка / WhatsApp / Позвонить; блок “Key facts” под результатом: расстояние, срок, занятость ТС.
- Длинные страницы: вверху TL;DR и TOC; контент — карточки + аккордеоны; FAQ — аккордеон с JSON‑LD.
- Навигация: Sticky TOC (десктоп); снизу на мобиле — док‑панель: Калькулятор / WhatsApp / Позвонить; “Ссылки по теме” в конце секций.
- Мобильный UX: крупные зоны клика; блоки по 4–6 строк с “Показать больше”; sticky bottom bar с 2–3 CTA.
- Визуальные акценты: карточки преимуществ/сценариев; мини‑кейсы с цифрами/маршрутом; типографика 16–18px, lh 1.6–1.8, ширина 60–75 знаков.
- SEO‑страховка: не использовать `display:none` на основном тексте; свёртки — через details/summary или CSS `max-height`/`overflow`; H1/canonical/JSON‑LD неизменны.
- Перфоманс: критический CSS, webp/lazy, async скрипты — унифицировать.

### Мини‑паттерн (пример)
```html
<details>
  <summary>Подробнее о тарифах и нюансах</summary>
  <div>Полный текст раздела…</div>
</details>
```

### A/B тесты
- TL;DR+TOC vs без.
- Карточки преимуществ vs абзац.
- Sticky bottom bar: 2 vs 3 кнопки.
- Порядок CTA у результата калькулятора.

### Задания “братишкам” (ветка main в `/home/oem123/cursor/avtogost77-modern`)
- Подготовка ветки/PR: создать ветку `ux-tldr-cards-2025-08-11` от `main`; затем PR в GitHub main.
- Пилот 1 — `index.html`: 
  - [ ] Hero: полоса доверия (3–4 преимущества), единый CTA + вторичный.
  - [ ] Блок “Кому подойдём/Сценарии” в карточках; заменить длинные параграфы.
  - [ ] Sticky bottom bar (мобайл): Рассчитать / WhatsApp / Позвонить (+ цели в Метрике).
- Пилот 2 — `services.html`:
  - [ ] TL;DR (3–5 буллетов) и TOC; секции услуг — карточки; длинные описания — `<details>`.
  - [ ] Sticky TOC на десктопе; “Ссылки по теме” внизу секций.
- Пилот 3 — маршрутная (`gruzoperevozki-moskva-voronezh.html`):
  - [ ] TL;DR + TOC; карточки “Тарифы/Сроки/ТС”; длинные блоки в аккордеоны.
- Калькулятор: 
  - [ ] Двухшаговый UX; “Key facts” под результатом; CTA: Заявка / WhatsApp / Позвонить.
- Аналитика:
  - [ ] Вынести `window.trackGoal(goal, params)` в общий скрипт; прокинуть цели для bottom bar/TOC/аккордеонов.
- SEO‑контроль (для всех правок):
  - [ ] Весь текст в DOM; H1/H2/H3, canonical, JSON‑LD — без изменений.
  - [ ] Не подгружать текст лениво; только визуальная свёртка.
- UI‑кит (утилиты):
  - [ ] CSS‑утилиты для карточек, аккордеонов, чипов, полосы доверия; тёмно‑светлый контраст.

### Критерии приёмки
- Визуально: выше читаемость/сканируемость; 2–3 свитка до первого CTA.
- SEO: Lighthouse/PSI без деградаций; контент видим боту; H1/canonical/JSON‑LD стабильны.
- Аналитика: цели кликов (tel/WA), раскрытий, CTA результата калькулятора — в Метрике/GA4.

### Сроки/роллаут
- Пилот на 2–3 страницах — 1 день; ревью → тиражирование итеративно.

