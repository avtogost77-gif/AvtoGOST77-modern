const fs = require('fs');
const path = require('path');

// База "сколько стоит" запросов с высоким search volume
const CALCULATOR_PAGES = {
  "skolko-stoit-perevezti-mashinu": {
    title: "Сколько стоит перевезти машину",
    h1: "Калькулятор стоимости перевозки автомобиля",
    description: "Рассчитайте точную стоимость перевозки автомобиля на автовозе. Калькулятор учитывает расстояние, тип авто, сроки доставки.",
    keywords: "сколько стоит перевезти машину, стоимость перевозки автомобиля, автовоз цена, доставка машины калькулятор",
    searchVolume: "высокий",
    
    // Специфика калькулятора
    calculatorType: "automotive",
    defaultParams: {
      cargoType: "Легковой автомобиль",
      weight: "1500",
      volume: "12",
      fragile: false,
      urgent: false
    },
    
    // Контент для страницы
    intro: "Перевозка автомобиля — ответственная задача, требующая профессионального подхода. Наш калькулятор поможет вам рассчитать точную стоимость доставки с учетом всех факторов.",
    
    factors: [
      "Расстояние между городами",
      "Тип и класс автомобиля", 
      "Способ перевозки (открытый/закрытый автовоз)",
      "Срочность доставки",
      "Дополнительные услуги (страхование, мойка)"
    ],
    
    tips: [
      "Закрытый автовоз дороже на 30-40%, но безопаснее для дорогих авто",
      "Эвакуатор подойдет для битых машин или коротких расстояний",
      "Автовоз вмещает до 8-10 легковых автомобилей",
      "Доставка занимает 1-3 дня в зависимости от расстояния"
    ],
    
    priceRanges: [
      { distance: "До 300 км", price: "8 000 - 15 000 ₽" },
      { distance: "300-800 км", price: "15 000 - 30 000 ₽" },
      { distance: "800+ км", price: "30 000 - 50 000 ₽" }
    ]
  },

  "skolko-stoit-perevozka-mebeli": {
    title: "Сколько стоит перевозка мебели", 
    h1: "Калькулятор стоимости перевозки мебели",
    description: "Узнайте точную стоимость перевозки мебели. Калькулятор учитывает объем, расстояние, этажность, сборку/разборку.",
    keywords: "сколько стоит перевозка мебели, стоимость грузчиков, перевозка мебели цена, грузовое такси калькулятор",
    searchVolume: "высокий",
    
    calculatorType: "furniture",
    defaultParams: {
      cargoType: "Мебель",
      weight: "500",
      volume: "15",
      fragile: true,
      urgent: false
    },
    
    intro: "Переезд или доставка новой мебели требует аккуратности и профессионализма. Рассчитайте стоимость с учетом всех особенностей вашего груза.",
    
    factors: [
      "Объем и вес мебели",
      "Этажность (наличие лифта)",
      "Необходимость разборки/сборки",
      "Упаковка хрупких предметов",
      "Расстояние доставки"
    ],
    
    tips: [
      "Разборка мебели снижает объем и стоимость на 20-30%",
      "Упаковка защитит от повреждений при транспортировке", 
      "Грузчики поднимут мебель на любой этаж",
      "Газель подойдет для квартирного переезда"
    ],
    
    priceRanges: [
      { distance: "По городу", price: "3 000 - 8 000 ₽" },
      { distance: "Область", price: "8 000 - 15 000 ₽" },
      { distance: "Межгород", price: "15 000 - 35 000 ₽" }
    ]
  },

  "skolko-stoit-dostavka-stroymaterialov": {
    title: "Сколько стоит доставка стройматериалов",
    h1: "Калькулятор стоимости доставки стройматериалов", 
    description: "Рассчитайте стоимость доставки кирпича, бетона, арматуры и других стройматериалов. Учет веса, объема, сложности разгрузки.",
    keywords: "сколько стоит доставка стройматериалов, стоимость доставки кирпича, цена доставки бетона, доставка на стройку",
    searchVolume: "средний",
    
    calculatorType: "construction",
    defaultParams: {
      cargoType: "Строительные материалы",
      weight: "10000",
      volume: "20",
      fragile: false,
      urgent: false
    },
    
    intro: "Доставка стройматериалов на объект — критически важный этап строительства. Правильный расчет логистики поможет избежать простоев и переплат.",
    
    factors: [
      "Тип стройматериалов (сыпучие, штучные, жидкие)",
      "Общий вес и объем партии",
      "Доступность стройплощадки для большегрузов",
      "Необходимость крана-манипулятора",
      "Условия разгрузки и складирования"
    ],
    
    tips: [
      "Самосвал подойдет для песка, щебня, бетона",
      "Кран-манипулятор поможет разгрузить тяжелые блоки",
      "Закрытый кузов защитит от дождя и ветра",
      "Доставка рано утром избежит пробок"
    ],
    
    priceRanges: [
      { distance: "До 50 км", price: "5 000 - 12 000 ₽" },
      { distance: "50-200 км", price: "12 000 - 25 000 ₽" },
      { distance: "200+ км", price: "25 000 - 50 000 ₽" }
    ]
  },

  "skolko-stoit-gruzovoe-taksi": {
    title: "Сколько стоит грузовое такси",
    h1: "Калькулятор стоимости грузового такси",
    description: "Узнайте точную стоимость грузового такси. Почасовая оплата, расчет по километражу, стоимость грузчиков.",
    keywords: "сколько стоит грузовое такси, стоимость газели с грузчиками, грузовое такси цена за час, заказать газель",
    searchVolume: "очень высокий",
    
    calculatorType: "taxi",
    defaultParams: {
      cargoType: "Бытовые вещи",
      weight: "300",
      volume: "8",
      fragile: false,
      urgent: false
    },
    
    intro: "Грузовое такси — быстрое решение для небольших перевозок по городу. Рассчитайте стоимость с учетом времени работы и дополнительных услуг.",
    
    factors: [
      "Тип транспорта (Газель, 3-тонник, 5-тонник)",
      "Время работы (почасовая оплата)",
      "Количество грузчиков",
      "Километраж по городу",
      "Дополнительные услуги (упаковка, подъем)"
    ],
    
    tips: [
      "Минимальный заказ обычно 2-3 часа",
      "Грузчики оплачиваются отдельно (500-800 ₽/час за человека)",
      "Подъем на этаж без лифта +50% к стоимости",
      "Ночные и праздничные дни +30% к тарифу"
    ],
    
    priceRanges: [
      { distance: "2 часа с Газелью", price: "2 500 - 4 000 ₽" },
      { distance: "4 часа + грузчики", price: "6 000 - 9 000 ₽" },
      { distance: "Полный день", price: "8 000 - 15 000 ₽" }
    ]
  },

  "skolko-stoit-perevozka-pianino": {
    title: "Сколько стоит перевозка пианино",
    h1: "Калькулятор стоимости перевозки пианино и рояля",
    description: "Профессиональная перевозка пианино и музыкальных инструментов. Специальное оборудование, опытные грузчики.",
    keywords: "сколько стоит перевозка пианино, стоимость перевозки рояля, перевозка музыкальных инструментов цена",
    searchVolume: "средний",
    
    calculatorType: "special",
    defaultParams: {
      cargoType: "Пианино",
      weight: "300",
      volume: "4",
      fragile: true,
      urgent: false
    },
    
    intro: "Перевозка пианино требует особой аккуратности и профессионального оборудования. Наши специалисты безопасно доставят ваш инструмент.",
    
    factors: [
      "Тип инструмента (пианино, рояль, орган)",
      "Этажность и наличие лифта",
      "Ширина дверных проемов",
      "Необходимость упаковки",
      "Расстояние перевозки"
    ],
    
    tips: [
      "Пианино весит 200-300 кг, рояль — до 600 кг",
      "Потребуется бригада из 4-6 грузчиков",
      "Специальные ремни и такелаж обязательны",
      "Настройка после перевозки входит в услугу"
    ],
    
    priceRanges: [
      { distance: "По городу", price: "8 000 - 15 000 ₽" },
      { distance: "Область", price: "15 000 - 25 000 ₽" },
      { distance: "Межгород", price: "25 000 - 45 000 ₽" }
    ]
  },

  "skolko-stoit-kvartirnyj-pereezd": {
    title: "Сколько стоит квартирный переезд",
    h1: "Калькулятор стоимости квартирного переезда",
    description: "Рассчитайте полную стоимость переезда: транспорт, грузчики, упаковка. Переезд 1,2,3-комнатной квартиры под ключ.",
    keywords: "сколько стоит переезд квартиры, стоимость переезда под ключ, цена переезда с грузчиками, переезд калькулятор",
    searchVolume: "очень высокий",
    
    calculatorType: "moving",
    defaultParams: {
      cargoType: "Квартирные вещи",
      weight: "1000",
      volume: "25",
      fragile: true,
      urgent: false
    },
    
    intro: "Квартирный переезд — это комплексная услуга. Наш калькулятор поможет рассчитать полную стоимость с учетом всех этапов.",
    
    factors: [
      "Площадь квартиры (количество комнат)",
      "Этажность старого и нового жилья",
      "Объем и характер вещей",
      "Необходимость упаковки",
      "Расстояние между адресами"
    ],
    
    tips: [
      "1-комнатная: Газель + 2 грузчика",
      "2-3 комнатная: 3-тонник + 3-4 грузчика", 
      "Упаковка хрупких вещей сохранит их в целости",
      "Разборка мебели ускорит процесс"
    ],
    
    priceRanges: [
      { distance: "1-комнатная", price: "8 000 - 15 000 ₽" },
      { distance: "2-комнатная", price: "15 000 - 25 000 ₽" },
      { distance: "3+ комнаты", price: "25 000 - 40 000 ₽" }
    ]
  }
};

// Шаблоны для разных типов калькуляторов  
const CALCULATOR_TEMPLATES = {
  hero: (page) => `
    <section class="hero calculator-hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="breadcrumb">
              <a href="../index.html">Главная</a>
              <span>→</span>
              <a href="index.html">Калькуляторы</a>
              <span>→</span>
              <span>${page.title}</span>
            </div>
            <h1>${page.h1}</h1>
            <p class="hero-subtitle">${page.intro}</p>
            <div class="hero-features">
              <div class="feature-badge">
                <span class="badge-icon">⚡</span>
                <span>Расчет за 30 секунд</span>
              </div>
              <div class="feature-badge">
                <span class="badge-icon">💰</span>
                <span>Точная стоимость</span>
              </div>
              <div class="feature-badge">
                <span class="badge-icon">📱</span>
                <span>Онлайн бронирование</span>
              </div>
            </div>
          </div>
          <div class="hero-calculator">
            <!-- Калькулятор будет здесь -->
            <div class="calculator-preview">
              <h3>Быстрый расчет</h3>
              <p>Заполните параметры груза ниже ↓</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  calculator: (page) => `
    <section class="main-calculator" id="calculator">
      <div class="container">
        <h2>Рассчитать стоимость ${page.title.toLowerCase()}</h2>
        
        <!-- Основной калькулятор -->
        <div id="smart-calculator" class="calculator-enhanced">
          <div class="calculator-loading">
            <div class="loading-spinner"></div>
            <p>Загрузка калькулятора...</p>
          </div>
        </div>
        
        <!-- Факторы влияющие на стоимость -->
        <div class="price-factors">
          <h3>Факторы, влияющие на стоимость</h3>
          <div class="factors-grid">
            ${page.factors.map(factor => `
              <div class="factor-item">
                <span class="factor-icon">📋</span>
                <span>${factor}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `,

  priceRanges: (page) => `
    <section class="price-ranges">
      <div class="container">
        <h2>Примерные цены</h2>
        <p>Ориентировочная стоимость для популярных вариантов:</p>
        <div class="ranges-grid">
          ${page.priceRanges.map(range => `
            <div class="range-item">
              <h3>${range.distance}</h3>
              <div class="price">${range.price}</div>
              <p>Указана базовая стоимость без дополнительных услуг</p>
            </div>
          `).join('')}
        </div>
        <div class="price-note">
          <p><strong>Внимание:</strong> Финальная стоимость зависит от многих факторов. Используйте калькулятор выше для точного расчета.</p>
        </div>
      </div>
    </section>
  `,

  tips: (page) => `
    <section class="useful-tips">
      <div class="container">
        <h2>Полезные советы</h2>
        <div class="tips-grid">
          ${page.tips.map((tip, index) => `
            <div class="tip-item">
              <div class="tip-number">${index + 1}</div>
              <div class="tip-content">
                <h4>Совет эксперта</h4>
                <p>${tip}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `,

  faq: (page) => `
    <section class="calculator-faq">
      <div class="container">
        <h2>Часто задаваемые вопросы</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h4>Как точно рассчитать стоимость?</h4>
            <p>Используйте наш калькулятор выше — он учитывает все параметры: расстояние, вес, объем, тип груза и дополнительные услуги.</p>
          </div>
          <div class="faq-item">
            <h4>Входят ли грузчики в стоимость?</h4>
            <p>Услуги грузчиков рассчитываются отдельно. В калькуляторе можно выбрать необходимое количество человек.</p>
          </div>
          <div class="faq-item">
            <h4>Можно ли заказать срочную доставку?</h4>
            <p>Да, у нас есть услуга экспресс-доставки. Срочность увеличивает стоимость на 30-50%.</p>
          </div>
          <div class="faq-item">
            <h4>Как оплачивать услуги?</h4>
            <p>Принимаем наличные, банковские карты, безналичный расчет для юридических лиц.</p>
          </div>
        </div>
      </div>
    </section>
  `,

  cta: (page) => `
    <section class="calculator-cta">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы заказать ${page.title.toLowerCase()}?</h2>
          <p>Получите персональную консультацию и зафиксируйте цену</p>
          <div class="cta-actions">
            <a href="tel:+79162720932" class="btn btn-primary btn-lg">
              <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
              </svg>
              Позвонить сейчас
            </a>
            <a href="https://wa.me/79162720932" class="btn btn-outline btn-lg" target="_blank">
              <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Написать в WhatsApp
            </a>
          </div>
          <div class="cta-guarantees">
            <div class="guarantee-item">
              <span class="guarantee-icon">🛡️</span>
              <span>Гарантия сохранности</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">⏰</span>
              <span>Точно в срок</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">📋</span>
              <span>Договор и документы</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};

// Функция создания директории
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Генерация контента калькуляторной страницы
function generateCalculatorContent(pageCode, page) {
  return `
    ${CALCULATOR_TEMPLATES.hero(page)}
    ${CALCULATOR_TEMPLATES.calculator(page)}
    ${CALCULATOR_TEMPLATES.priceRanges(page)}
    ${CALCULATOR_TEMPLATES.tips(page)}
    ${CALCULATOR_TEMPLATES.faq(page)}
    ${CALCULATOR_TEMPLATES.cta(page)}
  `;
}

// Генерация полной HTML страницы калькулятора
function generateCalculatorHTML(pageCode, page, content) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${page.title} | Калькулятор АвтоГОСТ</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.keywords}, автогост калькулятор, онлайн расчет стоимости">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://avtogost77.ru/calculators/${pageCode}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${page.title} | Калькулятор АвтоГОСТ">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="https://avtogost77.ru/calculators/${pageCode}.html">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://avtogost77.ru/assets/img/calculator-og.jpg">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:site_name" content="АвтоГОСТ">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title} | Калькулятор АвтоГОСТ">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="https://avtogost77.ru/assets/img/calculator-og.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="icon" type="image/png" href="../favicon.png">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../assets/css/styles-optimized.css">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${page.title}",
      "description": "${page.description}",
      "url": "https://avtogost77.ru/calculators/${pageCode}.html",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web browser",
      "provider": {
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "telephone": "+7-916-272-09-32",
        "url": "https://avtogost77.ru"
      },
      "offers": {
        "@type": "Offer",
        "description": "Калькулятор стоимости грузоперевозок",
        "priceRange": "₽₽"
      }
    }
    </script>
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="../assets/css/styles-optimized.css" as="style">
    <link rel="preload" href="../assets/js/main.js" as="script">
    <link rel="preload" href="../assets/js/smart-calculator-v2.js" as="script">
    
    <!-- DNS Prefetch -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
</head>
<body>
    <!-- Навигация -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <!-- Логотип -->
                <div class="logo">
                    <a href="../index.html" class="logo-link">
                        🚛 <span class="logo-text">АвтоГОСТ</span>
                    </a>
                </div>
                
                <!-- Навигация -->
                <nav class="nav">
                    <a href="../about.html" class="nav-link">О нас</a>
                    <a href="../services.html" class="nav-link">Услуги</a>
                    <a href="../index.html#calculator" class="nav-link">Калькулятор</a>
                    <a href="../contact.html" class="nav-link">Контакты</a>
                    <a href="../help.html" class="nav-link">Помощь</a>
                </nav>
                
                <!-- Контакт кнопка -->
                <div class="header-cta">
                    <a href="tel:+79162720932" class="btn btn-primary">
                        <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                        </svg>
                        Позвонить
                    </a>
                </div>
                
                <!-- Мобильное меню -->
                <button class="mobile-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Основной контент -->
    ${content}

    <!-- Плавающие кнопки -->
    <div class="floating-actions">
        <a href="tel:+79162720932" class="floating-btn floating-phone" aria-label="Позвонить">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </svg>
        </a>
        
        <a href="https://wa.me/79162720932" class="floating-btn floating-whatsapp" aria-label="WhatsApp" target="_blank">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
        </a>
        
        <a href="https://t.me/avtogost77" class="floating-btn floating-telegram" aria-label="Telegram" target="_blank">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
        </a>
    </div>

    <!-- Scripts -->
    <script src="../assets/js/main.js"></script>
    <script src="../assets/js/smart-calculator-v2.js"></script>
    
    <!-- Инициализация калькулятора -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Предустановленные параметры для этого типа калькулятора
            const defaultParams = ${JSON.stringify(page.defaultParams)};
            
            // Инициализация калькулятора с предустановками
            if (typeof initSmartCalculator === 'function') {
                initSmartCalculator(defaultParams);
            }
            
            // Аналитика для калькуляторных страниц
            if (typeof ym !== 'undefined') {
                ym(98599741, 'hit', '/calculators/${pageCode}', {
                    title: '${page.title}',
                    calculator_type: '${page.calculatorType}',
                    search_volume: '${page.searchVolume}'
                });
            }
            
            // Отслеживание использования калькулятора
            document.addEventListener('calculator:result', function(e) {
                if (typeof ym !== 'undefined') {
                    ym(98599741, 'reachGoal', 'calculator_used', {
                        page: '${pageCode}',
                        price: e.detail.price,
                        route: e.detail.route
                    });
                }
            });
        });
    </script>
</body>
</html>`;
}

// Основная функция генерации калькуляторных страниц
async function generateCalculators() {
  const pagesCount = parseInt(process.env.PAGES_COUNT) || 6; // Все калькуляторы
  console.log(`🧮 Генерируем ${pagesCount} калькуляторных SEO страниц...`);
  
  let generatedCount = 0;
  ensureDir('calculators');
  
  // Создаем индексную страницу калькуляторов
  const calculatorsIndexContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Калькуляторы стоимости грузоперевозок | АвтоГОСТ</title>
    <meta name="description" content="Онлайн калькуляторы для расчета стоимости различных видов грузоперевозок. Быстро, точно, бесплатно.">
    <link rel="stylesheet" href="../assets/css/styles-optimized.css">
    <link rel="canonical" href="https://avtogost77.ru/calculators/">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="../index.html" class="logo-link">
                        🚛 <span class="logo-text">АвтоГОСТ</span>
                    </a>
                </div>
                <nav class="nav">
                    <a href="../about.html" class="nav-link">О нас</a>
                    <a href="../services.html" class="nav-link">Услуги</a>
                    <a href="../index.html#calculator" class="nav-link">Калькулятор</a>
                    <a href="../contact.html" class="nav-link">Контакты</a>
                </nav>
            </div>
        </div>
    </header>
    
    <div style="padding: 4rem 0;">
        <div class="container">
            <h1>Калькуляторы стоимости грузоперевозок</h1>
            <p>Рассчитайте точную стоимость доставки для различных типов грузов:</p>
            <div class="calculators-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin: 2rem 0;">
                ${Object.entries(CALCULATOR_PAGES).map(([pageCode, page]) => `
                    <div class="calculator-card" style="padding: 2rem; border: 1px solid var(--neutral-200); border-radius: 12px; background: white;">
                        <h3><a href="${pageCode}.html" style="color: var(--primary-600); text-decoration: none;">${page.title}</a></h3>
                        <p style="margin: 1rem 0; color: var(--neutral-600);">${page.description}</p>
                        <div class="search-volume" style="font-size: 0.875rem; color: var(--primary-500);">
                            <strong>Популярность:</strong> ${page.searchVolume} поисковый спрос
                        </div>
                        <div style="margin-top: 1rem;">
                            <a href="${pageCode}.html" class="btn btn-primary btn-sm">Рассчитать стоимость</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync('calculators/index.html', calculatorsIndexContent);
  console.log('✅ Создана индексная страница: calculators/index.html');
  
  // Генерируем страницы для каждого калькулятора
  for (const [pageCode, page] of Object.entries(CALCULATOR_PAGES)) {
    if (generatedCount >= pagesCount) break;
    
    const content = generateCalculatorContent(pageCode, page);
    const html = generateCalculatorHTML(pageCode, page, content);
    
    const filename = `calculators/${pageCode}.html`;
    fs.writeFileSync(filename, html);
    
    generatedCount++;
    console.log(`✅ Создана калькуляторная страница: ${filename} (${page.searchVolume} спрос)`);
  }
  
  console.log(`🎉 Сгенерировано ${generatedCount} калькуляторных SEO страниц!`);
  return generatedCount;
}

// Запуск генерации
if (require.main === module) {
  generateCalculators().catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
}

module.exports = { generateCalculators, CALCULATOR_PAGES };