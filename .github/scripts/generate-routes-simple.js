const fs = require('fs');
const path = require('path');

// Подключаем систему реальных расстояний
const { getRealDistance } = require('../../assets/js/real-distances.js');
const { DistanceAPI } = require('../../assets/js/distance-api.js');

// База городов России (ТОП-10 для быстрого старта)
const CITIES = {
  "moskva": {
    name: "Москвы", nameTo: "Москву", 
    region: "Московская область",
    coords: [55.7558, 37.6176],
    population: 12500000,
    isHub: true,
    priority: ["spb", "kazan", "voronezh", "samara", "nizhniy-novgorod", "ekaterinburg"]
  },
  "spb": {
    name: "Санкт-Петербурга", nameTo: "Санкт-Петербург",
    region: "Ленинградская область", 
    coords: [59.9311, 30.3609],
    population: 5400000,
    isHub: true,
    priority: ["moskva", "kaliningrad", "murmansk"]
  },
  "kazan": {
    name: "Казани", nameTo: "Казань",
    region: "Республика Татарстан",
    coords: [55.8304, 49.0661], 
    population: 1300000,
    priority: ["moskva", "nizhniy-novgorod", "ufa", "samara"]
  },
  "voronezh": {
    name: "Воронежа", nameTo: "Воронеж",
    region: "Воронежская область",
    coords: [51.6754, 39.2088],
    population: 1060000,
    priority: ["moskva", "rostov", "kursk"]
  },
  "samara": {
    name: "Самары", nameTo: "Самару", 
    region: "Самарская область",
    coords: [53.2001, 50.1500],
    population: 1150000,
    priority: ["moskva", "kazan", "ufa"]
  },
  "nizhniy-novgorod": {
    name: "Нижнего Новгорода", nameTo: "Нижний Новгород",
    region: "Нижегородская область", 
    coords: [56.3287, 44.0020],
    population: 1250000,
    priority: ["moskva", "kazan", "yaroslavl"]
  },
  "ekaterinburg": {
    name: "Екатеринбурга", nameTo: "Екатеринбург",
    region: "Свердловская область",
    coords: [56.8431, 60.6454],
    population: 1500000,
    priority: ["moskva", "chelyabinsk", "perm"]
  }
};

// Ключевые концепции АвтоГОСТ
const BRAND_CONCEPTS = {
  mission: "Дать предпринимателям возможность сосредоточиться на бизнесе, доверив логистику профессионалам",
  slogan: "АвтоГОСТ - Инфраструктура Вашего бизнеса",
  whileYou: "Пока Вы развиваете бизнес - мы обеспечиваем логистику",
  outsourcing: "B2B Аутсорсинг - Полный цикл: от сырья до потребителя"
};

// Создание директории (упрощенная версия)
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Расчет расстояния между городами
function calculateDistance(coords1, coords2) {
  const R = 6371; // Радиус Земли в км
  const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
  const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Генерация уникального контента для маршрута
function generateRouteContent(fromCity, toCity, distance, price) {
  const from = CITIES[fromCity];
  const to = CITIES[toCity];
  
  const deliveryTime = distance < 300 ? "6-12 часов" : 
                     distance < 800 ? "1-2 дня" : "2-3 дня";
  
  return `
    <section class="route-hero">
      <div class="container">
        <h1>Грузоперевозки ${from.name} — ${to.nameTo}</h1>
        <div class="route-stats">
          <div class="stat-item">
            <span class="stat-icon">📏</span>
            <span class="stat-value">${distance} км</span>
            <span class="stat-label">расстояние</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value">${deliveryTime}</span>
            <span class="stat-label">время доставки</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <span class="stat-value">от ${price}₽</span>
            <span class="stat-label">стоимость</span>
          </div>
        </div>
        <div class="route-cta">
          <a href="../../index.html#calculator" class="btn btn-primary btn-lg">
            💰 Рассчитать точную стоимость
          </a>
          <a href="tel:+79162720932" class="btn btn-outline btn-lg">
            📞 Заказать перевозку
          </a>
        </div>
      </div>
    </section>

    <!-- Уникальный контент -->
    <section class="route-content">
      <div class="container">
        <div class="content-grid">
          <div class="content-main">
            <h2>Особенности перевозки ${from.name} — ${to.nameTo}</h2>
            <p><strong>Маршрут ${from.name} — ${to.nameTo}</strong> является одним из востребованных направлений для грузоперевозок в России. Расстояние ${distance} км позволяет организовать быструю и эффективную доставку грузов различных категорий.</p>
            
            <h3>🚛 Транспорт для перевозки ${from.name} — ${to.nameTo}</h3>
            <div class="transport-grid">
              <div class="transport-card">
                <h4>🚐 Газель (до 1.5т)</h4>
                <p>Идеальна для небольших грузов, документов, посылок. Быстрая доставка ${deliveryTime}.</p>
                <div class="price">от ${Math.round(price * 0.6)}₽</div>
              </div>
              <div class="transport-card">
                <h4>🚚 3-тонник</h4>
                <p>Оптимальный выбор для средних партий товаров, мебели, оборудования.</p>
                <div class="price">от ${Math.round(price * 0.8)}₽</div>
              </div>
              <div class="transport-card">
                <h4>🚛 Фура 20т</h4>
                <p>Для крупных промышленных грузов, строительных материалов.</p>
                <div class="price">от ${price}₽</div>
              </div>
            </div>

            <h3>📦 Популярные типы грузов на маршруте</h3>
            <ul class="cargo-types">
              <li>Промышленное оборудование и запчасти</li>
              <li>Строительные и отделочные материалы</li>
              <li>Мебель и предметы интерьера</li>
              <li>Продукты питания и товары для ритейла</li>
              <li>Сборные грузы для частных лиц</li>
            </ul>

            <h3>⚡ Преимущества АвтоГОСТ на маршруте ${from.name} — ${to.nameTo}</h3>
            <div class="advantages">
              <div class="advantage-item">
                <span class="advantage-icon">🎯</span>
                <strong>Точные сроки:</strong> Доставка строго в ${deliveryTime}
              </div>
              <div class="advantage-item">
                <span class="advantage-icon">💰</span>
                <strong>Честные цены:</strong> Без скрытых доплат и комиссий
              </div>
              <div class="advantage-item">
                <span class="advantage-icon">📱</span>
                <strong>Отслеживание:</strong> Контроль груза на всем пути
              </div>
              <div class="advantage-item">
                <span class="advantage-icon">🛡️</span>
                <strong>Страхование:</strong> Полная ответственность за груз
              </div>
            </div>

            <blockquote class="brand-quote" style="border-left: 4px solid var(--primary-600); padding: 1rem; margin: 2rem 0; background: var(--neutral-50);">
              <p style="font-style: italic; font-size: 1.1rem;">"${BRAND_CONCEPTS.whileYou}"</p>
              <cite style="font-weight: 600; color: var(--primary-600);">— ${BRAND_CONCEPTS.slogan}</cite>
            </blockquote>

            <h3>💡 Почему выбирают АвтоГОСТ для маршрута ${from.name} — ${to.nameTo}?</h3>
            <p>Наша компания специализируется на <strong>грузоперевозках ${from.name} ${to.nameTo}</strong> уже более 10 лет. Мы знаем все особенности этого маршрута и гарантируем:</p>
            <ul>
              <li>🎯 <strong>Точную доставку в срок</strong> - ${deliveryTime}</li>
              <li>💰 <strong>Фиксированную стоимость</strong> - от ${price}₽</li>
              <li>📱 <strong>Онлайн отслеживание</strong> груза 24/7</li>
              <li>🛡️ <strong>Полное страхование</strong> и ответственность</li>
              <li>⚡ <strong>Быструю подачу</strong> транспорта в ${from.name}</li>
            </ul>
          </div>

          <div class="content-sidebar">
            <div class="contact-card" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-md); margin-bottom: 1.5rem;">
              <h3>📞 Заказать перевозку</h3>
              <p>Быстрый расчет и бронирование</p>
              <a href="tel:+79162720932" class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem; text-decoration: none;">+7 916 272-09-32</a>
              <a href="https://wa.me/79162720932" class="btn btn-whatsapp" style="width: 100%; text-decoration: none;" target="_blank">WhatsApp</a>
            </div>

            <div class="route-info" style="background: var(--neutral-50); padding: 1.5rem; border-radius: 12px;">
              <h3>📍 Информация о маршруте</h3>
              <div class="info-item">
                <strong>Расстояние:</strong> ${distance} км
              </div>
              <div class="info-item">
                <strong>Время в пути:</strong> ${deliveryTime}
              </div>
              <div class="info-item">
                <strong>Регионы:</strong> ${from.region} → ${to.region}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// Генерация HTML страницы
function generatePageHTML(fromCity, toCity, distance, price, content) {
  const from = CITIES[fromCity];
  const to = CITIES[toCity];
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Грузоперевозки ${from.name} ${to.nameTo} от ${price}₽ за ${distance}км | АвтоГОСТ</title>
    <meta name="description" content="⚡ Надежная доставка грузов ${from.name} — ${to.nameTo}. Расстояние ${distance}км, время доставки ${distance < 300 ? '6-12 часов' : distance < 800 ? '1-2 дня' : '2-3 дня'}. Калькулятор стоимости онлайн. Подача за 2 часа!">
    <meta name="keywords" content="грузоперевозки ${from.name} ${to.nameTo}, доставка груза ${from.name} ${to.nameTo}, стоимость перевозки ${from.name} ${to.nameTo}, логистика ${from.name} ${to.nameTo}, транспортная компания">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://avtogost77.ru/routes/${fromCity}/${fromCity}-${toCity}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Грузоперевозки ${from.name} ${to.nameTo} от ${price}₽">
    <meta property="og:description" content="Надежная доставка грузов ${from.name} — ${to.nameTo}. ${distance}км за ${distance < 300 ? '6-12 часов' : distance < 800 ? '1-2 дня' : '2-3 дня'}">
    <meta property="og:url" content="https://avtogost77.ru/routes/${fromCity}/${fromCity}-${toCity}.html">
    <meta property="og:type" content="website">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/styles-optimized.css">
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
    
    <!-- Schema.org разметка -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Грузоперевозки ${from.name} ${to.nameTo}",
      "description": "Доставка грузов ${from.name} — ${to.nameTo}, ${distance} км",
      "provider": {
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "telephone": "+7-916-272-09-32"
      },
      "areaServed": ["${from.region}", "${to.region}"],
      "offers": {
        "@type": "Offer",
        "price": "${price}",
        "priceCurrency": "RUB"
      }
    }
    </script>

    <style>
      .route-stats {
        display: flex;
        gap: 2rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      .stat-item {
        text-align: center;
        padding: 1rem;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        min-width: 120px;
      }
      .stat-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        display: block;
        color: white;
      }
      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
      .route-cta {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
      }
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
        margin-top: 2rem;
      }
      .transport-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      .transport-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: var(--shadow-sm);
        text-align: center;
      }
      .advantages {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      .advantage-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
      }
      .route-hero {
        background: var(--gradient-hero);
        color: white;
        padding: 4rem 0;
        text-align: center;
      }
      .route-content {
        padding: 4rem 0;
      }
      .breadcrumbs {
        background: var(--neutral-100);
        padding: 1rem 0;
        font-size: 0.9rem;
      }
      .breadcrumbs a {
        color: var(--primary-600);
        text-decoration: none;
      }
      @media (max-width: 768px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
        .route-stats {
          justify-content: center;
        }
        .route-cta {
          justify-content: center;
        }
      }
    </style>
</head>
<body>
    <!-- Навигация -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="../../index.html" class="logo-link">
                        🚛 <span class="logo-text">АвтоГОСТ</span>
                    </a>
                </div>
                <nav class="nav">
                    <a href="../../about.html" class="nav-link">О нас</a>
                    <a href="../../services.html" class="nav-link">Услуги</a>
                    <a href="../../index.html#calculator" class="nav-link">Калькулятор</a>
                    <a href="../../contact.html" class="nav-link">Контакты</a>
                    <a href="../../help.html" class="nav-link">Помощь</a>
                </nav>
                <div class="header-cta">
                    <a href="tel:+79162720932" class="btn btn-primary">
                        <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                        </svg>
                        Позвонить
                    </a>
                </div>
                <button class="mobile-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
        <div class="container">
            <a href="../../index.html">Главная</a> → 
            <a href="../index.html">Маршруты</a> → 
            <a href="index.html">Из ${from.name}</a> → 
            <span>В ${to.nameTo}</span>
        </div>
    </div>

    <!-- Основной контент -->
    ${content}

    <!-- Плавающие кнопки -->
    <div class="floating-actions">
        <a href="https://wa.me/79162720932" class="floating-btn floating-whatsapp pulse" target="_blank">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472,14.382c-0.297-0.149-1.758-0.867-2.03-0.967c-0.273-0.099-0.471-0.148-0.670,0.15c-0.197,0.297-0.767,0.966-0.940,1.164c-0.173,0.199-0.347,0.223-0.644,0.075c-0.297-0.15-1.255-0.463-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059c-0.173-0.297-0.018-0.458,0.130-0.606c0.134-0.133,0.298-0.347,0.446-0.521C9.889,9.367,9.939,9.196,10.038,9c0.099-0.197,0.05-0.371-0.025-0.521C9.915,8.328,9.351,6.867,9.106,6.272c-0.241-0.580-0.487-0.500-0.669-0.51C8.236,5.751,8.038,5.751,7.840,5.751c-0.198,0-0.52,0.074-0.792,0.372C6.776,6.421,6.011,7.087,6.011,8.548c0,1.461,1.063,2.873,1.211,3.070c0.149,0.198,2.095,3.2,5.076,4.487c0.709,0.306,1.262,0.489,1.694,0.625c0.712,0.227,1.36,0.195,1.871,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.289,0.173-1.413C17.918,14.665,17.769,14.531,17.472,14.382z"/>
                <path d="M12.057,2C6.524,2,2.036,6.488,2.036,12.021c0,1.763,0.457,3.51,1.325,5.037L2,22l5.049-1.324c1.48,0.808,3.146,1.232,4.857,1.232h0.004c5.533,0,10.021-4.488,10.021-10.021C21.931,6.354,17.590,2.001,12.057,2z"/>
            </svg>
        </a>
        <a href="https://t.me/avtogost77" class="floating-btn floating-telegram" target="_blank">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M11.944,0A12,12,0,0,0,0,12a12,12,0,0,0,12,12,12,12,0,0,0,12-12A12,12,0,0,0,11.944,0Zm4.962,7.224c.1-.002.321.023.465.14a.506.506,0,0,1,.171.325c.016.093.036.306.02.472-.18,1.898-.962,6.502-1.36,8.627-.168.9-.499,1.201-.820,1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184,3.247-2.977,3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793,1.14-5.061,3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663C8.68,9.193,14.137,6.945,15.2,6.492c.987-.42,4.043-1.682,4.043-1.682s1.443-.612,1.323.876Z"/>
            </svg>
        </a>
        <a href="tel:+79162720932" class="floating-btn floating-phone">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </svg>
        </a>
    </div>

    <!-- Scripts -->
    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/smart-calculator-v2.js"></script>
</body>
</html>`;
}

// Основная функция генерации
async function generateRoutes() {
  const pagesCount = 15; // Генерируем 15 страниц для демо
  console.log(`🚀 Генерируем ${pagesCount} маршрутных страниц с реальными расстояниями...`);
  
  // Инициализируем API для расчета расстояний
  const distanceAPI = new DistanceAPI();
  
  let generatedCount = 0;
  
  // Создаем структуру папок
  ensureDir('routes');
  
  for (const [fromCityCode, fromCity] of Object.entries(CITIES)) {
    if (generatedCount >= pagesCount) break;
    
    // Создаем папку для города-отправителя
    ensureDir(`routes/${fromCityCode}`);
    
    // Генерируем индексную страницу города
    const cityIndexContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Грузоперевозки из ${fromCity.name} по России | АвтоГОСТ</title>
    <meta name="description" content="Все направления грузоперевозок из ${fromCity.name}. ${fromCity.region}. Быстрая доставка, честные цены.">
    <link rel="stylesheet" href="../assets/css/styles-optimized.css">
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
            <h1>Грузоперевозки из ${fromCity.name}</h1>
            <p>Популярные направления из ${fromCity.name}:</p>
            <ul style="margin: 2rem 0;">
                ${fromCity.priority ? fromCity.priority.map(toCityCode => {
                  const toCity = CITIES[toCityCode];
                  if (toCity) {
                    return `<li style="margin: 0.5rem 0;"><a href="${fromCityCode}-${toCityCode}.html" style="color: var(--primary-600); text-decoration: none;">Грузоперевозки ${fromCity.name} — ${toCity.nameTo}</a></li>`;
                  }
                  return '';
                }).join('') : ''}
            </ul>
        </div>
    </div>
</body>
</html>`;
    
    // ЗАЩИТА: НЕ перезаписываем существующие красивые index.html
    const indexPath = `routes/${fromCityCode}/index.html`;
    if (fs.existsSync(indexPath)) {
      console.log(`⚠️ ПРОПУСК: ${indexPath} уже существует (сохраняем красивую версию)`);
    } else {
      fs.writeFileSync(indexPath, cityIndexContent);
      console.log(`✅ Создана индексная страница: ${indexPath}`);
    }
    
    // Генерируем страницы маршрутов
    if (fromCity.priority) {
      for (const toCityCode of fromCity.priority) {
        if (generatedCount >= pagesCount) break;
        
        const toCity = CITIES[toCityCode];
        if (!toCity) continue;
        
        // Расчет параметров маршрута с РЕАЛЬНЫМИ расстояниями
        let distance = await distanceAPI.getDistance(fromCityCode, toCityCode);
        
        const basePrice = distance < 300 ? 15000 : 
                         distance < 800 ? 25000 : 
                         Math.round(distance * 45); // ₽/км для дальних маршрутов
        
        // Генерация контента
        const content = generateRouteContent(fromCityCode, toCityCode, distance, basePrice);
        const html = generatePageHTML(fromCityCode, toCityCode, distance, basePrice, content);
        
        // Сохранение файла
        const filename = `routes/${fromCityCode}/${fromCityCode}-${toCityCode}.html`;
        fs.writeFileSync(filename, html);
        
        generatedCount++;
        console.log(`✅ Создана страница: ${filename}`);
      }
    }
  }
  
  // Показываем статистику использования API
  const stats = distanceAPI.getUsageStats();
  console.log('\n📊 СТАТИСТИКА ИСПОЛЬЗОВАНИЯ API:');
  console.log(`Всего запросов: ${stats.total}`);
  for (const [provider, data] of Object.entries(stats.providers)) {
    if (data.count > 0) {
      console.log(`${provider}: ${data.count} (${data.percentage}%)`);
    }
  }
  console.log(`Кэш: ${stats.cacheSize} записей`);
  
  console.log(`🎉 Сгенерировано ${generatedCount} маршрутных страниц с реальными расстояниями!`);
  return generatedCount;
}

// Запуск генерации
if (require.main === module) {
  generateRoutes().catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
}

module.exports = { generateRoutes, CITIES };