const fs = require('fs');
const path = require('path');

// Типы Schema.org разметки для разных типов страниц
const SCHEMA_TEMPLATES = {
  // Для главной страницы
  homePage: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "АвтоГОСТ",
    "alternateName": "AvtoGOST77",
    "url": "https://avtogost77.ru",
    "logo": "https://avtogost77.ru/assets/img/logo.svg",
    "description": "Профессиональные грузоперевозки по России. Надежная доставка грузов с 2015 года.",
    "email": "info@avtogost77.ru",
    "telephone": "+7 (495) 268-06-81",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": "Москва",
      "addressCountry": "RU"
    },
    "sameAs": [
      "https://t.me/avtogost77",
      "https://wa.me/74952680681"
    ],
    "foundingDate": "2015",
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги грузоперевозок",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Междугородние грузоперевозки",
            "description": "Доставка грузов между городами России"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Срочная доставка",
            "description": "Экспресс-доставка грузов за 2-24 часа"
          }
        }
      ]
    }
  },

  // Для страниц маршрутов
  route: (data) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "serviceType": "Грузоперевозки",
        "name": `Грузоперевозки ${data.fromCity} — ${data.toCity}`,
        "description": `Профессиональные грузоперевозки из ${data.fromCity} в ${data.toCity}. Расстояние ${data.distance} км.`,
        "provider": {
          "@type": "Organization",
          "name": "АвтоГОСТ",
          "url": "https://avtogost77.ru"
        },
        "areaServed": [
          {
            "@type": "City",
            "name": data.fromCity
          },
          {
            "@type": "City",
            "name": data.toCity
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `Тарифы на перевозку ${data.fromCity} — ${data.toCity}`,
          "itemListElement": {
            "@type": "Offer",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": data.price,
              "priceCurrency": "RUB",
              "unitText": "за доставку"
            }
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Сколько стоит доставка из ${data.fromCity} в ${data.toCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Стоимость доставки на расстояние ${data.distance} км начинается от ${data.price} ₽. Окончательная цена зависит от веса и габаритов груза.`
            }
          },
          {
            "@type": "Question",
            "name": `Сколько времени занимает доставка из ${data.fromCity} в ${data.toCity}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Доставка занимает от ${Math.ceil(data.distance / 500)} до ${Math.ceil(data.distance / 300)} дней в зависимости от типа груза и транспорта.`
            }
          }
        ]
      }
    ]
  }),

  // Для страниц калькуляторов
  calculator: (data) => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB"
    },
    "provider": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "url": "https://avtogost77.ru"
    }
  }),

  // Для блога
  blogPost: (data) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description,
    "image": data.image || "https://avtogost77.ru/assets/img/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "url": "https://avtogost77.ru"
    },
    "publisher": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "url": "https://avtogost77.ru",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avtogost77.ru/assets/img/logo.svg"
      }
    },
    "datePublished": data.datePublished || "2025-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    }
  }),

  // Для страниц индустрий
  industry: (data) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Специализированные грузоперевозки",
    "name": data.name,
    "description": data.description,
    "provider": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "url": "https://avtogost77.ru"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Услуги для ${data.industry}`,
      "itemListElement": data.services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        }
      }))
    }
  }),

  // Для специальных страниц услуг
  servicePage: (data) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "serviceType": data.serviceType,
        "name": data.name,
        "description": data.description,
        "provider": {
          "@type": "Organization",
          "name": "АвтоГОСТ",
          "url": "https://avtogost77.ru"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Россия"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": data.name,
          "itemListElement": data.offers || []
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faqs || []
      }
    ]
  })
};

// Функция для извлечения данных из HTML
function extractPageData(htmlContent, filename, type) {
  const data = {};
  
  // Извлекаем title
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
  data.title = titleMatch ? titleMatch[1] : '';
  
  // Извлекаем description
  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)"/);
  data.description = descMatch ? descMatch[1] : '';
  
  // Извлекаем canonical URL
  const canonicalMatch = htmlContent.match(/<link rel="canonical" href="(.*?)"/);
  data.url = canonicalMatch ? canonicalMatch[1] : `https://avtogost77.ru/${filename}`;
  
  // Специфичные данные для маршрутов
  if (type === 'route') {
    const h1Match = htmlContent.match(/<h1>(.*?)<\/h1>/);
    if (h1Match) {
      const routeMatch = h1Match[1].match(/Грузоперевозки\s+(.+?)\s+—\s+(.+)/);
      if (routeMatch) {
        data.fromCity = routeMatch[1].trim();
        data.toCity = routeMatch[2].trim();
      }
    }
    
    // Извлекаем расстояние и цену
    const distanceMatch = htmlContent.match(/(\d+)\s*км/);
    data.distance = distanceMatch ? parseInt(distanceMatch[1]) : 500;
    
    const priceMatch = htmlContent.match(/от\s*([\d,\s]+)\s*₽/);
    data.price = priceMatch ? priceMatch[1].replace(/[,\s]/g, '') : '15000';
  }
  
  // Для блога
  if (type === 'blog') {
    // Извлекаем дату из имени файла или контента
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    data.datePublished = dateMatch ? dateMatch[1] : '2025-01-01';
  }
  
  // Для индустрий
  if (type === 'industry') {
    data.industry = filename.replace('.html', '').replace(/-/g, ' ');
    data.name = `Грузоперевозки для ${data.industry}`;
    data.services = [
      { name: 'Специализированная упаковка', description: 'Упаковка с учетом специфики отрасли' },
      { name: 'Страхование грузов', description: 'Полное страхование специфичных грузов' },
      { name: 'Экспресс-доставка', description: 'Срочная доставка для критичных грузов' }
    ];
  }
  
  return data;
}

// Функция для добавления Schema.org разметки в HTML
function addSchemaMarkup(htmlContent, schemaData) {
  const schemaScript = `\n<script type="application/ld+json">\n${JSON.stringify(schemaData, null, 2)}\n</script>`;
  
  // Проверяем, есть ли уже Schema.org разметка
  if (htmlContent.includes('type="application/ld+json"')) {
    // Заменяем существующую разметку
    return htmlContent.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      schemaScript
    );
  } else {
    // Добавляем перед закрывающим </head>
    return htmlContent.replace('</head>', `${schemaScript}\n</head>`);
  }
}

// Функция для обработки одного файла
function processFile(filePath, type) {
  const filename = path.basename(filePath);
  console.log(`📝 Обрабатываю: ${filename}`);
  
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  const data = extractPageData(htmlContent, filename, type);
  
  let schemaData;
  
  // Выбираем подходящий шаблон
  switch(type) {
    case 'home':
      schemaData = SCHEMA_TEMPLATES.homePage;
      break;
    case 'route':
      schemaData = SCHEMA_TEMPLATES.route(data);
      break;
    case 'calculator':
      schemaData = SCHEMA_TEMPLATES.calculator(data);
      break;
    case 'blog':
      schemaData = SCHEMA_TEMPLATES.blogPost(data);
      break;
    case 'industry':
      schemaData = SCHEMA_TEMPLATES.industry(data);
      break;
    case 'service':
      // Для специальных страниц услуг
      const serviceData = {
        ...data,
        serviceType: 'Грузоперевозки',
        faqs: []
      };
      
      // Извлекаем FAQ если есть
      const faqMatches = htmlContent.matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g);
      for (const match of faqMatches) {
        if (match[1].includes('?')) {
          serviceData.faqs.push({
            "@type": "Question",
            "name": match[1],
            "acceptedAnswer": {
              "@type": "Answer",
              "text": match[2]
            }
          });
        }
      }
      
      schemaData = SCHEMA_TEMPLATES.servicePage(serviceData);
      break;
    default:
      // Базовая разметка WebPage
      schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": data.title,
        "description": data.description,
        "url": data.url,
        "publisher": {
          "@type": "Organization",
          "name": "АвтоГОСТ",
          "url": "https://avtogost77.ru"
        }
      };
  }
  
  // Добавляем разметку в HTML
  const updatedHtml = addSchemaMarkup(htmlContent, schemaData);
  
  // Сохраняем файл
  fs.writeFileSync(filePath, updatedHtml);
  console.log(`✅ Добавлена Schema.org разметка в ${filename}`);
}

// Главная функция
async function main() {
  console.log('🚀 Начинаю добавление Schema.org разметки...\n');
  
  const baseDir = path.join(__dirname, '..', '..');
  
  // Обрабатываем главную страницу
  processFile(path.join(baseDir, 'index.html'), 'home');
  
  // Обрабатываем маршруты
  const routeDirs = ['routes/moskva', 'routes/spb', 'routes/kazan', 'routes/samara', 
                     'routes/nizhniy-novgorod', 'routes/voronezh'];
  
  for (const dir of routeDirs) {
    const fullDir = path.join(baseDir, dir);
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir);
      for (const file of files) {
        if (file.endsWith('.html')) {
          processFile(path.join(fullDir, file), 'route');
        }
      }
    }
  }
  
  // Обрабатываем калькуляторы
  const calcDir = path.join(baseDir, 'calculators');
  if (fs.existsSync(calcDir)) {
    const files = fs.readdirSync(calcDir);
    for (const file of files) {
      if (file.endsWith('.html')) {
        processFile(path.join(calcDir, file), 'calculator');
      }
    }
  }
  
  // Обрабатываем индустрии
  const indDir = path.join(baseDir, 'industries');
  if (fs.existsSync(indDir)) {
    const files = fs.readdirSync(indDir);
    for (const file of files) {
      if (file.endsWith('.html')) {
        processFile(path.join(indDir, file), 'industry');
      }
    }
  }
  
  // Обрабатываем блог
  const blogFiles = [
    'blog-1-carrier-failed.html',
    'blog-2-wildberries-delivery.html',
    'blog-3-spot-orders.html',
    'blog-4-remote-logistics.html',
    'blog-5-logistics-optimization.html',
    'blog-6-marketplace-insider.html'
  ];
  
  for (const file of blogFiles) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      processFile(filePath, 'blog');
    }
  }
  
  // Обрабатываем специальные страницы услуг
  const servicePages = [
    'urgent-delivery.html',
    'ip-small-business-delivery.html',
    'self-employed-delivery.html'
  ];
  
  for (const file of servicePages) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      processFile(filePath, 'service');
    }
  }
  
  // Обрабатываем остальные важные страницы
  const otherPages = [
    'services.html',
    'about.html',
    'contact.html',
    'faq.html',
    'track.html'
  ];
  
  for (const file of otherPages) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      processFile(filePath, 'default');
    }
  }
  
  console.log('\n✨ Schema.org разметка успешно добавлена на все страницы!');
}

// Запускаем скрипт
main().catch(console.error);