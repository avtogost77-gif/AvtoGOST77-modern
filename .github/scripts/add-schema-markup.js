const fs = require('fs');
const path = require('path');

// Базовая организация для всех страниц
const BASE_ORGANIZATION = {
  "@type": "Organization",
  "@id": "https://avtogost77.ru/#organization",
  "name": "АвтоГОСТ",
  "alternateName": ["AvtoGOST77", "АвтоГОСТ77", "АвтоГОСТ 77"],
  "url": "https://avtogost77.ru",
  "logo": {
    "@type": "ImageObject",
    "url": "https://avtogost77.ru/assets/img/logo.svg",
    "width": 200,
    "height": 200
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-999-216-20-07",
    "contactType": "customer service",
    "areaServed": "RU",
    "availableLanguage": "Russian"
  },
  "sameAs": [
    "https://t.me/avtogost77",
    "https://wa.me/79992162007"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressRegion": "Московская область",
    "addressCountry": "RU"
  }
};

// Генерация расширенной Schema.org разметки для разных типов страниц
function generateSchemaMarkup(pageType, pageData) {
  const schemas = [];
  
  // Базовая организация для всех страниц
  schemas.push(BASE_ORGANIZATION);
  
  // WebSite schema для главной
  if (pageType === 'home') {
    schemas.push({
      "@type": "WebSite",
      "@id": "https://avtogost77.ru/#website",
      "url": "https://avtogost77.ru",
      "name": "АвтоГОСТ - Грузоперевозки по России",
      "description": "Надежные грузоперевозки по всей России. Доставка от 1 кг до 20 тонн.",
      "publisher": { "@id": "https://avtogost77.ru/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://avtogost77.ru/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });
  }
  
  // Service schema для страниц услуг
  if (pageType === 'service' || pageType === 'route') {
    schemas.push({
      "@type": "Service",
      "@id": `https://avtogost77.ru/${pageData.url}#service`,
      "name": pageData.title,
      "description": pageData.description,
      "provider": { "@id": "https://avtogost77.ru/#organization" },
      "serviceType": "Грузоперевозки",
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
              "name": pageData.title,
              "description": pageData.description
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "RUB",
              "price": pageData.price || "от 15000"
            }
          }
        ]
      }
    });
  }
  
  // Article schema для блога
  if (pageType === 'blog') {
    schemas.push({
      "@type": "Article",
      "@id": `https://avtogost77.ru/${pageData.url}#article`,
      "headline": pageData.title,
      "description": pageData.description,
      "image": pageData.image || "https://avtogost77.ru/assets/img/blog-default.jpg",
      "datePublished": pageData.datePublished || "2024-12-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "author": { "@id": "https://avtogost77.ru/#organization" },
      "publisher": { "@id": "https://avtogost77.ru/#organization" },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://avtogost77.ru/${pageData.url}`
      }
    });
  }
  
  // FAQPage schema для страниц с FAQ
  if (pageData.hasFAQ) {
    const faqItems = pageData.faqItems || [
      {
        question: "Как быстро вы можете организовать доставку?",
        answer: "Мы можем подать транспорт в течение 2-4 часов после заявки."
      },
      {
        question: "Какие типы грузов вы перевозите?",
        answer: "Мы перевозим любые типы грузов от 1 кг до 20 тонн, включая негабаритные и опасные грузы."
      }
    ];
    
    schemas.push({
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }
  
  // BreadcrumbList для навигации
  if (pageData.breadcrumbs) {
    schemas.push({
      "@type": "BreadcrumbList",
      "itemListElement": pageData.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    });
  }
  
  // LocalBusiness для местных маршрутов
  if (pageType === 'route' && pageData.localArea) {
    schemas.push({
      "@type": "LocalBusiness",
      "name": `АвтоГОСТ - ${pageData.localArea}`,
      "description": `Грузоперевозки в ${pageData.localArea}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": pageData.localArea,
        "addressCountry": "RU"
      },
      "priceRange": "₽₽",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    });
  }
  
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

// Извлечение данных из HTML
function extractPageData(htmlContent, filePath) {
  const pageData = {
    url: path.basename(filePath),
    hasFAQ: false,
    breadcrumbs: null
  };
  
  // Извлекаем title
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    pageData.title = titleMatch[1].replace(' | АвтоГОСТ', '');
  }
  
  // Извлекаем description
  const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="(.*?)"/i);
  if (descMatch) {
    pageData.description = descMatch[1];
  }
  
  // Проверяем наличие FAQ
  pageData.hasFAQ = htmlContent.includes('class="faq-section"') || 
                    htmlContent.includes('Часто задаваемые вопросы');
  
  // Определяем тип страницы
  let pageType = 'service';
  if (filePath.includes('index.html')) pageType = 'home';
  else if (filePath.includes('blog-')) pageType = 'blog';
  else if (filePath.includes('routes/')) pageType = 'route';
  else if (filePath.includes('calculators/')) pageType = 'calculator';
  else if (filePath.includes('industries/')) pageType = 'industry';
  
  // Для маршрутов извлекаем города
  if (pageType === 'route') {
    const cityMatch = filePath.match(/routes\/([^\/]+)\/.*?-([^\.]+)\.html/);
    if (cityMatch) {
      pageData.fromCity = cityMatch[1];
      pageData.toCity = cityMatch[2];
      pageData.localArea = cityMatch[2];
    }
    
    // Извлекаем цену
    const priceMatch = htmlContent.match(/от\s*([\d,]+)\s*₽/);
    if (priceMatch) {
      pageData.price = priceMatch[1].replace(',', '');
    }
  }
  
  // Генерируем breadcrumbs
  if (pageType !== 'home') {
    pageData.breadcrumbs = [
      { name: "Главная", url: "https://avtogost77.ru" }
    ];
    
    if (pageType === 'route') {
      pageData.breadcrumbs.push({ name: "Маршруты", url: "https://avtogost77.ru/routes" });
      if (pageData.title) {
        pageData.breadcrumbs.push({ name: pageData.title, url: `https://avtogost77.ru/${pageData.url}` });
      }
    } else if (pageType === 'blog') {
      pageData.breadcrumbs.push({ name: "Блог", url: "https://avtogost77.ru/blog" });
      pageData.breadcrumbs.push({ name: pageData.title, url: `https://avtogost77.ru/${pageData.url}` });
    } else if (pageType === 'calculator') {
      pageData.breadcrumbs.push({ name: "Калькуляторы", url: "https://avtogost77.ru/calculators" });
      pageData.breadcrumbs.push({ name: pageData.title, url: `https://avtogost77.ru/${pageData.url}` });
    }
  }
  
  return { pageType, pageData };
}

// Добавление или обновление Schema.org разметки
function addSchemaToPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Извлекаем данные страницы
    const { pageType, pageData } = extractPageData(content, filePath);
    
    // Генерируем новую разметку
    const newSchema = generateSchemaMarkup(pageType, pageData);
    const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(newSchema, null, 2)}\n</script>`;
    
    // Удаляем старую Schema.org разметку
    content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
    
    // Добавляем новую разметку перед </head>
    content = content.replace('</head>', `\n${schemaScript}\n</head>`);
    
    // Сохраняем файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Добавлена Schema.org разметка: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
    return false;
  }
}

// Обработка всех HTML файлов
async function processAllPages() {
  console.log('🔍 Начинаем добавление расширенной Schema.org разметки...\n');
  
  const directories = [
    'routes/moskva',
    'routes/spb', 
    'routes/kazan',
    'routes/samara',
    'routes/nizhniy-novgorod',
    'routes/voronezh',
    'calculators',
    'industries',
    '.'
  ];
  
  let totalProcessed = 0;
  let totalSuccess = 0;
  
  for (const dir of directories) {
    const fullPath = path.join(__dirname, '../../', dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Директория не найдена: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(fullPath);
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    for (const file of htmlFiles) {
      const filePath = path.join(fullPath, file);
      totalProcessed++;
      
      if (addSchemaToPage(filePath)) {
        totalSuccess++;
      }
    }
  }
  
  // Обработка блог-страниц в корне
  const rootFiles = fs.readdirSync(path.join(__dirname, '../../'));
  const blogFiles = rootFiles.filter(f => f.startsWith('blog-') && f.endsWith('.html'));
  
  for (const file of blogFiles) {
    const filePath = path.join(__dirname, '../../', file);
    totalProcessed++;
    
    if (addSchemaToPage(filePath)) {
      totalSuccess++;
    }
  }
  
  // Обработка основных страниц
  const mainPages = ['index.html', 'services.html', 'about.html', 'contact.html', 
                     'urgent-delivery.html', 'ip-small-business-delivery.html', 
                     'self-employed-delivery.html'];
  
  for (const page of mainPages) {
    const filePath = path.join(__dirname, '../../', page);
    if (fs.existsSync(filePath)) {
      totalProcessed++;
      if (addSchemaToPage(filePath)) {
        totalSuccess++;
      }
    }
  }
  
  console.log('\n📊 Итоги:');
  console.log(`✅ Успешно обработано: ${totalSuccess} страниц`);
  console.log(`📄 Всего обработано: ${totalProcessed} страниц`);
  
  if (totalSuccess < totalProcessed) {
    console.log(`⚠️  Ошибки: ${totalProcessed - totalSuccess} страниц`);
  }
}

// Запуск
processAllPages().catch(console.error);