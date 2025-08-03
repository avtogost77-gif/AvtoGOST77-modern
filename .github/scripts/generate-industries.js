const fs = require('fs');
const path = require('path');

// База отраслей с НЧ ключевыми словами
const INDUSTRIES = {
  "stroitelstvo": {
    name: "Строительство",
    title: "Грузоперевозки для строительства",
    description: "Доставка стройматериалов, перевозка строительного оборудования, логистика для строительных компаний",
    keywords: "грузоперевозки строительных материалов, доставка стройматериалов, перевозка бетона, доставка кирпича, перевозка арматуры",
    
    // Типичные грузы
    cargoTypes: [
      "Кирпич и блоки",
      "Цемент и бетонные смеси", 
      "Арматура и металлоконструкции",
      "Сыпучие материалы (песок, щебень)",
      "Строительное оборудование",
      "Панели и плиты",
      "Изоляционные материалы",
      "Сантехника и электрика"
    ],
    
    // Особенности перевозки
    features: [
      "Доставка точно в срок на стройплощадку",
      "Разгрузка краном-манипулятором", 
      "Перевозка негабаритных конструкций",
      "Работа с пропусками на объекты",
      "Складская логистика стройматериалов"
    ],
    
    // Бизнес-боли
    painPoints: [
      "Простои стройки из-за задержек материалов",
      "Повреждение хрупких материалов в пути",
      "Сложности с доставкой на высотные объекты",
      "Координация поставок от разных поставщиков"
    ],
    
    // Решения АвтоГОСТ
    solutions: [
      "Точное планирование поставок по графику стройки",
      "Специализированный транспорт для каждого типа груза",
      "Опытные водители, знающие специфику стройплощадок",
      "Единый координатор всех поставок"
    ]
  },

  "promyshlennost": {
    name: "Промышленность",
    title: "Грузоперевозки для промышленных предприятий",
    description: "Доставка сырья, перевозка готовой продукции, промышленная логистика, аутсорсинг транспортных услуг",
    keywords: "промышленные грузоперевозки, доставка сырья, перевозка продукции, логистика производства, аутсорсинг транспорта",
    
    cargoTypes: [
      "Металлопрокат и заготовки",
      "Химическое сырье и реагенты",
      "Готовая промышленная продукция",
      "Станки и оборудование",
      "Упаковочные материалы",
      "Комплектующие и запчасти"
    ],
    
    features: [
      "Работа по долгосрочным контрактам",
      "Интеграция с ERP системами предприятий",
      "Складские услуги и кросс-докинг",
      "Специализированный транспорт для опасных грузов",
      "Таможенное сопровождение экспорта/импорта"
    ],
    
    painPoints: [
      "Простои производства из-за задержек сырья",
      "Высокие логистические затраты",
      "Сложности с перевозкой опасных грузов",
      "Нехватка собственного автопарка"
    ],
    
    solutions: [
      "Полный аутсорсинг логистики предприятия",
      "Just-in-time поставки без простоев",
      "Сертифицированные водители для опасных грузов",
      "Оптимизация маршрутов и снижение затрат на 25%"
    ]
  },

  "retail": {
    name: "Розничная торговля",
    title: "Грузоперевозки для ритейла и торговых сетей",
    description: "Доставка товаров в магазины, пополнение торговых точек, логистика для интернет-магазинов",
    keywords: "доставка в магазины, пополнение торговых точек, логистика ритейла, доставка для интернет магазинов",
    
    cargoTypes: [
      "Продукты питания и напитки",
      "Одежда и обувь",
      "Бытовая техника и электроника",
      "Товары народного потребления",
      "Интернет-заказы и посылки"
    ],
    
    features: [
      "Доставка по расписанию работы магазинов",
      "Температурные режимы для продуктов",
      "Сборка заказов на складе",
      "Доставка на полки (до места продажи)",
      "Возврат непроданных товаров"
    ],
    
    painPoints: [
      "Дефицит товаров на полках",
      "Порча скоропортящихся продуктов",
      "Высокие затраты на последнюю милю",
      "Сложности с возвратами"
    ],
    
    solutions: [
      "Автоматическое пополнение по данным продаж",
      "Рефрижераторный транспорт для продуктов",
      "Собственная курьерская служба",
      "Единая система учета и возвратов"
    ]
  },

  "agricultural": {
    name: "Сельское хозяйство",
    title: "Грузоперевозки для агропромышленного комплекса",
    description: "Доставка сельхозпродукции, перевозка зерна, удобрений, техники, логистика для фермерских хозяйств",
    keywords: "перевозка зерна, доставка удобрений, сельхоз грузоперевозки, логистика АПК, доставка сельхозтехники",
    
    cargoTypes: [
      "Зерновые культуры",
      "Удобрения и агрохимикаты",
      "Сельскохозяйственная техника",
      "Молочная и мясная продукция",
      "Корма для животных",
      "Овощи и фрукты"
    ],
    
    features: [
      "Специализированные зерновозы",
      "Рефрижераторы для молочных продуктов",
      "Трелевочные прицепы для техники",
      "Работа в любых погодных условиях",
      "Знание особенностей сельских дорог"
    ],
    
    painPoints: [
      "Сезонность и пиковые нагрузки",
      "Плохие дороги к фермерским хозяйствам",
      "Быстрая порча сельхозпродукции",
      "Ограниченные сроки уборочных работ"
    ],
    
    solutions: [
      "Масштабирование автопарка в сезон",
      "Специализированный транспорт для село",
      "Температурные режимы для каждого продукта",
      "Круглосуточная работа в период уборки"
    ]
  },

  "ecommerce": {
    name: "Интернет-торговля",
    title: "Грузоперевозки для интернет-магазинов и маркетплейсов",
    description: "Доставка интернет-заказов, фулфилмент для маркетплейсов, курьерская логистика",
    keywords: "доставка интернет заказов, фулфилмент маркетплейс, курьерская доставка, логистика ecommerce",
    
    cargoTypes: [
      "Посылки и бандероли",
      "Товары с маркетплейсов (Wildberries, Ozon)",
      "Возвратные товары",
      "Крупногабаритные интернет-покупки",
      "Подарки и сувениры"
    ],
    
    features: [
      "Доставка на склады маркетплейсов",
      "Курьерская доставка до двери",
      "Обработка возвратов и обменов",
      "Трекинг посылок в реальном времени",
      "Работа с СМС и email уведомлениями"
    ],
    
    painPoints: [
      "Высокая конкуренция по скорости доставки",
      "Большой процент возвратов товаров",
      "Сложности с доставкой в отдаленные районы",
      "Пиковые нагрузки в праздники"
    ],
    
    solutions: [
      "Доставка на следующий день по Москве",
      "Автоматизированная обработка возвратов",
      "Пункты выдачи в малых городах",
      "Масштабирование на время распродаж"
    ]
  },

  "automotive": {
    name: "Автомобильная отрасль",
    title: "Грузоперевозки для автопрома и автосервисов",
    description: "Доставка автомобилей, перевозка запчастей, логистика для автодилеров и сервисных центров",
    keywords: "перевозка автомобилей, доставка запчастей, автовоз услуги, логистика автодилеров",
    
    cargoTypes: [
      "Легковые и грузовые автомобили",
      "Автозапчасти и комплектующие",
      "Шины и диски",
      "Аккумуляторы и масла",
      "Автоаксессуары"
    ],
    
    features: [
      "Автовозы и эвакуаторы",
      "Закрытые фургоны для дорогих авто",
      "Специальные крепления для безопасности",
      "Страхование на полную стоимость",
      "Мойка авто перед доставкой"
    ],
    
    painPoints: [
      "Риск повреждения дорогостоящих автомобилей",
      "Сложности с доставкой крупногабаритных деталей",
      "Воровство дорогих запчастей",
      "Простои автосервисов без запчастей"
    ],
    
    solutions: [
      "Профессиональная подготовка водителей-автовозчиков",
      "GPS мониторинг и охрана в пути",
      "Экспресс-доставка критичных запчастей",
      "Полное страхование и гарантии"
    ]
  }
};

// Шаблоны контента для разных секций
const CONTENT_TEMPLATES = {
  hero: (industry) => `
    <section class="hero industry-hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1>${industry.title}</h1>
            <p class="hero-subtitle">${industry.description}</p>
            <div class="hero-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">⚡</span>
                <span>Доставка точно в срок</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🚛</span>
                <span>Специализированный транспорт</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <span>Онлайн контроль груза</span>
              </div>
            </div>
            <div class="hero-actions">
              <a href="#calculator" class="btn btn-primary btn-lg">
                <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z"/>
                </svg>
                Рассчитать стоимость
              </a>
              <a href="tel:+79162720932" class="btn btn-outline btn-lg">
                <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                </svg>
                +7 (916) 272-09-32
              </a>
            </div>
          </div>
          <div class="hero-image">
            <img src="../assets/img/industry-${industry.code || 'default'}.jpg" 
                 alt="${industry.title}" 
                 loading="lazy"
                 onerror="this.src='../assets/img/hero-logistics.jpg'">
          </div>
        </div>
      </div>
    </section>
  `,

  cargoTypes: (industry) => `
    <section class="cargo-types">
      <div class="container">
        <h2>Типы грузов для отрасли "${industry.name}"</h2>
        <div class="cargo-grid">
          ${industry.cargoTypes.map(cargo => `
            <div class="cargo-item">
              <div class="cargo-icon">📦</div>
              <h3>${cargo}</h3>
              <p>Профессиональная доставка с учетом всех особенностей груза</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `,

  problems: (industry) => `
    <section class="problems-solutions">
      <div class="container">
        <div class="content-split">
          <div class="problems">
            <h2>Типичные проблемы в отрасли</h2>
            <div class="problem-list">
              ${industry.painPoints.map(problem => `
                <div class="problem-item">
                  <span class="problem-icon">❌</span>
                  <p>${problem}</p>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="solutions">
            <h2>Наши решения</h2>
            <div class="solution-list">
              ${industry.solutions.map(solution => `
                <div class="solution-item">
                  <span class="solution-icon">✅</span>
                  <p>${solution}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  features: (industry) => `
    <section class="industry-features">
      <div class="container">
        <h2>Особенности работы с отраслью "${industry.name}"</h2>
        <div class="features-grid">
          ${industry.features.map((feature, index) => `
            <div class="feature-item">
              <div class="feature-number">${index + 1}</div>
              <h3>Профессиональный подход</h3>
              <p>${feature}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `,

  calculator: () => `
    <section class="calculator-section" id="calculator">
      <div class="container">
        <h2>Рассчитайте стоимость доставки</h2>
        <p>Укажите параметры груза и получите точную стоимость за 30 секунд</p>
        
        <!-- Калькулятор будет подключен через JavaScript -->
        <div id="smart-calculator">
          <div class="calculator-loading">
            <div class="loading-spinner"></div>
            <p>Загрузка калькулятора...</p>
          </div>
        </div>
      </div>
    </section>
  `,

  cta: (industry) => `
    <section class="industry-cta">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы оптимизировать логистику для "${industry.name}"?</h2>
          <p>Пока Вы развиваете бизнес — мы обеспечиваем логистику</p>
          <div class="cta-benefits">
            <div class="cta-benefit">
              <span class="cta-icon">🎯</span>
              <span>Снижение логистических затрат до 25%</span>
            </div>
            <div class="cta-benefit">
              <span class="cta-icon">⏰</span>
              <span>Освобождение времени на развитие бизнеса</span>
            </div>
            <div class="cta-benefit">
              <span class="cta-icon">📈</span>
              <span>Масштабирование без инвестиций в автопарк</span>
            </div>
          </div>
          <div class="cta-actions">
            <a href="tel:+79162720932" class="btn btn-primary btn-lg">
              Получить консультацию
            </a>
            <a href="#calculator" class="btn btn-outline btn-lg">
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>
    </section>
  `
};

// Функция для создания директории
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Генерация контента для отраслевой страницы
function generateIndustryContent(industryCode, industry) {
  return `
    ${CONTENT_TEMPLATES.hero(industry)}
    ${CONTENT_TEMPLATES.cargoTypes(industry)}
    ${CONTENT_TEMPLATES.problems(industry)}
    ${CONTENT_TEMPLATES.features(industry)}
    ${CONTENT_TEMPLATES.calculator()}
    ${CONTENT_TEMPLATES.cta(industry)}
  `;
}

// Генерация полной HTML страницы
function generateIndustryHTML(industryCode, industry, content) {
  const currentYear = new Date().getFullYear();
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${industry.title} | АвтоГОСТ - Профессиональная логистика</title>
    <meta name="description" content="${industry.description}. Опыт работы с отраслью ${industry.name}. Специализированный транспорт, точные сроки, прозрачные цены.">
    <meta name="keywords" content="${industry.keywords}, автогост, грузоперевозки ${industry.name.toLowerCase()}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.avtogost77.ru/industries/${industryCode}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${industry.title} | АвтоГОСТ">
    <meta property="og:description" content="${industry.description}">
    <meta property="og:url" content="https://www.avtogost77.ru/industries/${industryCode}.html">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://www.avtogost77.ru/assets/img/industry-${industryCode}.jpg">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:site_name" content="АвтоГОСТ">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${industry.title} | АвтоГОСТ">
    <meta name="twitter:description" content="${industry.description}">
    <meta name="twitter:image" content="https://www.avtogost77.ru/assets/img/industry-${industryCode}.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="icon" type="image/png" href="../favicon.png">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../assets/css/styles-optimized.css">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${industry.title}",
      "description": "${industry.description}",
      "provider": {
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "telephone": "+7-916-272-09-32",
        "url": "https://www.avtogost77.ru"
      },
      "serviceArea": {
        "@type": "Place",
        "name": "Россия"
      },
      "url": "https://www.avtogost77.ru/industries/${industryCode}.html"
    }
    </script>
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="../assets/css/styles-optimized.css" as="style">
    <link rel="preload" href="../assets/js/main.js" as="script">
    
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
    
    <!-- Подключение калькулятора -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация калькулятора для отраслевой страницы
            if (typeof initSmartCalculator === 'function') {
                initSmartCalculator();
            }
            
            // Отраслевая аналитика
            if (typeof ym !== 'undefined') {
                ym(98599741, 'hit', '/industries/${industryCode}', {
                    title: '${industry.title}',
                    industry: '${industry.name}'
                });
            }
        });
    </script>
</body>
</html>`;
}

// Основная функция генерации отраслевых страниц
async function generateIndustries() {
  const pagesCount = parseInt(process.env.PAGES_COUNT) || 6; // Все отрасли
  console.log(`🏭 Генерируем ${pagesCount} отраслевых SEO страниц...`);
  
  let generatedCount = 0;
  ensureDir('industries');
  
  // Создаем индексную страницу для всех отраслей
  const industriesIndexContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Грузоперевозки по отраслям | АвтоГОСТ - Профессиональная логистика</title>
    <meta name="description" content="Специализированные грузоперевозки для различных отраслей. Строительство, промышленность, ритейл, АПК, e-commerce, автопром.">
    <link rel="stylesheet" href="../assets/css/styles-optimized.css">
    <link rel="canonical" href="https://www.avtogost77.ru/industries/">
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
            <h1>Грузоперевозки по отраслям</h1>
            <p>Специализированная логистика для каждой отрасли с учетом всех особенностей и требований:</p>
            <div class="industries-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0;">
                ${Object.entries(INDUSTRIES).map(([industryCode, industry]) => `
                    <div class="industry-card" style="padding: 2rem; border: 1px solid var(--neutral-200); border-radius: 12px; background: white;">
                        <h3><a href="${industryCode}.html" style="color: var(--primary-600); text-decoration: none;">${industry.title}</a></h3>
                        <p style="margin: 1rem 0; color: var(--neutral-600);">${industry.description}</p>
                        <div class="cargo-types" style="font-size: 0.875rem; color: var(--neutral-500);">
                            <strong>Типы грузов:</strong> ${industry.cargoTypes.slice(0, 3).join(', ')}...
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync('industries/index.html', industriesIndexContent);
  console.log('✅ Создана индексная страница: industries/index.html');
  
  // Генерируем страницы для каждой отрасли
  for (const [industryCode, industry] of Object.entries(INDUSTRIES)) {
    if (generatedCount >= pagesCount) break;
    
    const content = generateIndustryContent(industryCode, industry);
    const html = generateIndustryHTML(industryCode, industry, content);
    
    const filename = `industries/${industryCode}.html`;
    fs.writeFileSync(filename, html);
    
    generatedCount++;
    console.log(`✅ Создана отраслевая страница: ${filename} (${industry.name})`);
  }
  
  console.log(`🎉 Сгенерировано ${generatedCount} отраслевых SEO страниц!`);
  return generatedCount;
}

// Запуск генерации
if (require.main === module) {
  generateIndustries().catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
}

module.exports = { generateIndustries, INDUSTRIES };