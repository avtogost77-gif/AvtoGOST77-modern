const fs = require('fs');
const path = require('path');

// Enhanced Schema.org templates for different page types
const SCHEMA_TEMPLATES = {
  // Organization schema - base for all pages
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "АвтоГОСТ",
    "alternateName": ["AvtoGOST77", "АвтоГОСТ77", "АвтоГОСТ 77"],
    "url": "https://avtogost77.ru",
    "logo": {
      "@type": "ImageObject",
      "url": "https://avtogost77.ru/assets/img/logo.svg",
      "width": 200,
      "height": 200
    },
    "image": [
      "https://avtogost77.ru/assets/img/hero-logistics.webp",
      "https://avtogost77.ru/assets/img/truck-delivery.jpg"
    ],
    "description": "Профессиональные грузоперевозки по России. Надежная доставка грузов с 2015 года. Работаем 24/7.",
    "email": "info@avtogost77.ru",
    "telephone": "+7 (495) 268-06-81",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Ленина, д. 10",
      "addressLocality": "Москва",
      "addressRegion": "Москва",
      "postalCode": "101000",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 55.755826,
      "longitude": 37.617300
    },
    "sameAs": [
      "https://t.me/avtogost77",
      "https://wa.me/74952680681",
      "https://vk.com/avtogost77",
      "https://ok.ru/avtogost77"
    ],
    "foundingDate": "2015-01-01",
    "foundingLocation": {
      "@type": "Place",
      "name": "Москва"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 50,
      "maxValue": 100
    },
    "slogan": "Доставляем быстро, надежно, выгодно",
    "areaServed": {
      "@type": "Country",
      "name": "Россия",
      "identifier": "RU"
    },
    "award": [
      "Лучшая транспортная компания 2023",
      "Надежный партнер года 2022"
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Ассоциация грузоперевозчиков России"
      }
    ],
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
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Перевозка сборных грузов",
            "description": "Доставка малогабаритных грузов"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    }
  },

  // WebSite schema for main page
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "АвтоГОСТ - Грузоперевозки по России",
    "alternateName": "AvtoGOST77",
    "url": "https://avtogost77.ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://avtogost77.ru/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },

  // Service schema template
  service: (serviceName, description, minPrice = null) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "url": "https://avtogost77.ru"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://avtogost77.ru",
      "servicePhone": "+7 (495) 268-06-81",
      "availableLanguage": {
        "@type": "Language",
        "name": "Russian",
        "alternateName": "ru"
      }
    },
    ...(minPrice && {
      "offers": {
        "@type": "Offer",
        "priceRange": `от ${minPrice} ₽`,
        "priceCurrency": "RUB"
      }
    })
  }),

  // BlogPosting schema template
  blogPosting: (title, description, datePublished, dateModified, url) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "alternativeHeadline": title,
    "description": description,
    "image": [
      "https://avtogost77.ru/assets/img/blog-default.jpg",
      "https://avtogost77.ru/assets/img/hero-logistics.webp"
    ],
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
        "url": "https://avtogost77.ru/assets/img/logo.svg",
        "width": 200,
        "height": 200
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": "Логистика и грузоперевозки",
    "keywords": ["грузоперевозки", "логистика", "доставка грузов", "транспортная компания"],
    "wordCount": 2500,
    "timeRequired": "PT12M",
    "inLanguage": {
      "@type": "Language",
      "name": "Russian",
      "alternateName": "ru"
    }
  }),

  // Product schema for calculators
  product: (name, description, url) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "АвтоГОСТ"
    },
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": "100+",
      "lowPrice": "1000",
      "highPrice": "1000000",
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": url,
      "seller": {
        "@type": "Organization",
        "name": "АвтоГОСТ"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847"
    }
  }),

  // BreadcrumbList schema
  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // LocalBusiness schema for route pages
  localBusiness: (city, region) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `АвтоГОСТ - Грузоперевозки ${city}`,
    "description": `Надежные грузоперевозки в городе ${city}, ${region}. Доставка грузов по России.`,
    "url": `https://avtogost77.ru`,
    "telephone": "+7 (495) 268-06-81",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": region,
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 55.755826,
      "longitude": 37.617300
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "₽₽"
  })
};

// Function to detect page type based on filename and content
function detectPageType(filename, content) {
  if (filename === 'index.html') return 'homepage';
  if (filename.includes('blog-')) return 'blog';
  if (filename.includes('routes/')) return 'route';
  if (filename.includes('calculators/')) return 'calculator';
  if (filename.includes('industries/')) return 'industry';
  if (filename.includes('-delivery')) return 'service';
  if (filename === 'services.html') return 'services';
  if (filename === 'about.html') return 'about';
  if (filename === 'contact.html') return 'contact';
  if (filename === 'faq.html') return 'faq';
  return 'generic';
}

// Function to generate appropriate schema based on page type
function generateSchema(pageType, pageData) {
  const schemas = [];
  
  // Add organization schema to all pages
  schemas.push(SCHEMA_TEMPLATES.organization);
  
  switch (pageType) {
    case 'homepage':
      schemas.push(SCHEMA_TEMPLATES.website);
      break;
      
    case 'blog':
      schemas.push(SCHEMA_TEMPLATES.blogPosting(
        pageData.title,
        pageData.description,
        pageData.datePublished || '2025-01-01',
        pageData.dateModified || new Date().toISOString().split('T')[0],
        pageData.url
      ));
      // Add breadcrumb
      schemas.push(SCHEMA_TEMPLATES.breadcrumb([
        { name: 'Главная', url: 'https://avtogost77.ru' },
        { name: 'Блог', url: 'https://avtogost77.ru/blog' },
        { name: pageData.title, url: pageData.url }
      ]));
      break;
      
    case 'route':
      const cityMatch = pageData.filename.match(/routes\/([^\/]+)\/[^-]+-(.+)\.html/);
      if (cityMatch) {
        const fromCity = cityMatch[1];
        const toCity = cityMatch[2].replace(/-/g, ' ');
        schemas.push(SCHEMA_TEMPLATES.localBusiness(toCity, 'Россия'));
        schemas.push(SCHEMA_TEMPLATES.service(
          `Грузоперевозки ${fromCity} - ${toCity}`,
          pageData.description,
          15000
        ));
      }
      break;
      
    case 'calculator':
      schemas.push(SCHEMA_TEMPLATES.product(
        pageData.title,
        pageData.description,
        pageData.url
      ));
      break;
      
    case 'service':
      schemas.push(SCHEMA_TEMPLATES.service(
        pageData.title,
        pageData.description,
        pageData.minPrice
      ));
      break;
      
    case 'faq':
      // Extract FAQ items from content
      const faqMatch = pageData.content.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
      if (faqMatch && faqMatch[1].includes('FAQPage')) {
        // Keep existing FAQ schema if present
        try {
          const existingFAQ = JSON.parse(faqMatch[1]);
          if (existingFAQ['@type'] === 'FAQPage' || existingFAQ['@graph']?.some(item => item['@type'] === 'FAQPage')) {
            return faqMatch[0]; // Return existing FAQ schema
          }
        } catch (e) {}
      }
      break;
  }
  
  // Combine multiple schemas using @graph
  if (schemas.length > 1) {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemas
    }, null, 2);
  } else {
    return JSON.stringify(schemas[0], null, 2);
  }
}

// Function to extract page data from HTML
function extractPageData(content, filename, filepath) {
  const data = {
    filename,
    filepath,
    url: `https://avtogost77.ru/${filepath.replace(/\\/g, '/').replace('.html', '')}`,
    content
  };
  
  // Extract title
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  data.title = titleMatch ? titleMatch[1] : 'АвтоГОСТ - Грузоперевозки';
  
  // Extract description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  data.description = descMatch ? descMatch[1] : 'Профессиональные грузоперевозки по России';
  
  // Extract dates for blog posts
  if (filename.includes('blog-')) {
    const dateMatch = content.match(/<span[^>]*>.*?(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})/);
    if (dateMatch) {
      const months = {
        'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
        'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
        'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
      };
      const day = dateMatch[1].padStart(2, '0');
      const month = months[dateMatch[2]];
      const year = dateMatch[3];
      data.datePublished = `${year}-${month}-${day}`;
    }
  }
  
  return data;
}

// Function to update Schema.org markup in HTML file
function updateSchemaMarkup(filepath) {
  console.log(`Processing: ${filepath}`);
  
  let content = fs.readFileSync(filepath, 'utf8');
  const filename = path.basename(filepath);
  const relPath = path.relative(process.cwd(), filepath);
  
  // Extract page data
  const pageData = extractPageData(content, filename, relPath);
  
  // Detect page type
  const pageType = detectPageType(relPath, content);
  
  // Generate appropriate schema
  const newSchema = generateSchema(pageType, pageData);
  
  // Check if there's existing Schema.org markup
  const schemaRegex = /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g;
  const existingSchemas = content.match(schemaRegex);
  
  if (existingSchemas && existingSchemas.length > 0) {
    // Replace the first Schema.org script with enhanced version
    content = content.replace(existingSchemas[0], 
      `<script type="application/ld+json">\n${newSchema}\n</script>`);
    console.log(`  ✓ Updated existing Schema.org markup`);
  } else {
    // Add new Schema.org markup before </head>
    const headEndIndex = content.indexOf('</head>');
    if (headEndIndex !== -1) {
      const schemaScript = `\n<!-- Enhanced Schema.org markup -->\n<script type="application/ld+json">\n${newSchema}\n</script>\n`;
      content = content.slice(0, headEndIndex) + schemaScript + content.slice(headEndIndex);
      console.log(`  ✓ Added new Schema.org markup`);
    }
  }
  
  // Write back to file
  fs.writeFileSync(filepath, content);
}

// Function to scan and process all HTML files
function processAllPages() {
  const filesToProcess = [];
  
  // Scan root directory
  const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html');
  rootFiles.forEach(file => filesToProcess.push(path.join('.', file)));
  
  // Scan subdirectories
  const subdirs = ['routes', 'calculators', 'industries', 'blog'];
  subdirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const scanDir = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          const filepath = path.join(dirPath, file);
          if (fs.statSync(filepath).isDirectory()) {
            scanDir(filepath);
          } else if (file.endsWith('.html')) {
            filesToProcess.push(filepath);
          }
        });
      };
      scanDir(dir);
    }
  });
  
  console.log(`Found ${filesToProcess.length} HTML files to process\n`);
  
  // Process each file
  filesToProcess.forEach(filepath => {
    try {
      updateSchemaMarkup(filepath);
    } catch (error) {
      console.error(`  ✗ Error processing ${filepath}: ${error.message}`);
    }
  });
  
  console.log(`\n✅ Schema.org markup enhancement completed!`);
}

// Run the script
processAllPages();