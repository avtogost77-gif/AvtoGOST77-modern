const fs = require('fs');
const path = require('path');

// Schema.org templates for different page types
const SCHEMA_TEMPLATES = {
  // Main website schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "АвтоГОСТ - Грузоперевозки по России",
    "url": "https://avtogost77.ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://avtogost77.ru/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  // Organization schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "АвтоГОСТ",
    "url": "https://avtogost77.ru",
    "logo": "https://avtogost77.ru/assets/images/logo.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-495-668-65-17",
      "contactType": "customer service",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "sameAs": [
      "https://t.me/avtogost77",
      "https://wa.me/74956686517"
    ]
  },

  // Local Business schema
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "АвтоГОСТ - Грузоперевозки",
    "image": "https://avtogost77.ru/assets/images/logo.svg",
    "@id": "https://avtogost77.ru",
    "url": "https://avtogost77.ru",
    "telephone": "+7-495-668-65-17",
    "priceRange": "₽₽",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": "Московская область",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 55.7558,
      "longitude": 37.6173
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  },

  // Service schema template
  serviceTemplate: (service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.type || "Грузоперевозки",
    "provider": {
      "@type": "Organization",
      "name": "АвтоГОСТ"
    },
    "areaServed": {
      "@type": "Place",
      "name": service.area || "Россия"
    },
    "description": service.description || "Профессиональные грузоперевозки",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "RUB",
      "price": service.price || "от 15000"
    }
  }),

  // Route/Transport Service schema
  transportServiceTemplate: (fromCity, toCity, distance, price) => ({
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": `Грузоперевозки ${fromCity} - ${toCity}`,
    "provider": {
      "@type": "Organization",
      "name": "АвтоГОСТ"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": fromCity
      },
      {
        "@type": "City", 
        "name": toCity
      }
    ],
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "RUB"
    },
    "distance": {
      "@type": "QuantitativeValue",
      "value": distance,
      "unitCode": "KMT"
    }
  }),

  // Blog/Article schema
  articleTemplate: (title, description, datePublished, dateModified) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": "АвтоГОСТ"
    },
    "publisher": {
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avtogost77.ru/assets/images/logo.svg"
      }
    }
  }),

  // FAQ schema
  faqTemplate: (questions) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  }),

  // BreadcrumbList schema
  breadcrumbTemplate: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};

// Extract information from HTML
function extractPageInfo(htmlContent, filePath) {
  const info = {
    title: '',
    description: '',
    type: 'generic',
    fromCity: '',
    toCity: '',
    distance: '',
    price: '',
    faqItems: []
  };

  // Extract title
  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    info.title = titleMatch[1].trim();
  }

  // Extract description
  const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  if (descMatch) {
    info.description = descMatch[1].trim();
  }

  // Determine page type
  if (filePath.includes('/routes/')) {
    info.type = 'route';
    // Extract route info
    const routeMatch = filePath.match(/routes\/([^\/]+)\/([^-]+)-([^\.]+)\.html/);
    if (routeMatch) {
      info.fromCity = routeMatch[2];
      info.toCity = routeMatch[3];
    }
    // Extract distance and price from content
    const distanceMatch = htmlContent.match(/(\d+)\s*км/);
    if (distanceMatch) info.distance = distanceMatch[1];
    const priceMatch = htmlContent.match(/от\s*([\d,]+)\s*₽/);
    if (priceMatch) info.price = priceMatch[1].replace(/,/g, '');
  } else if (filePath.includes('blog-')) {
    info.type = 'blog';
  } else if (filePath.includes('/calculators/')) {
    info.type = 'calculator';
  } else if (filePath.includes('/industries/')) {
    info.type = 'industry';
  } else if (filePath.includes('faq.html')) {
    info.type = 'faq';
    // Extract FAQ items
    const faqRegex = /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([^<]+)<\/p>/g;
    let match;
    while ((match = faqRegex.exec(htmlContent)) !== null) {
      info.faqItems.push({
        question: match[1].trim(),
        answer: match[2].trim()
      });
    }
  } else if (filePath.includes('index.html')) {
    info.type = 'homepage';
  }

  return info;
}

// Generate appropriate schema based on page type
function generateSchema(pageInfo, filePath) {
  const schemas = [];

  // Add website schema to homepage
  if (pageInfo.type === 'homepage') {
    schemas.push(SCHEMA_TEMPLATES.website);
    schemas.push(SCHEMA_TEMPLATES.organization);
    schemas.push(SCHEMA_TEMPLATES.localBusiness);
  }

  // Add route-specific schema
  if (pageInfo.type === 'route' && pageInfo.fromCity && pageInfo.toCity) {
    schemas.push(SCHEMA_TEMPLATES.transportServiceTemplate(
      pageInfo.fromCity,
      pageInfo.toCity,
      pageInfo.distance || '0',
      pageInfo.price || '15000'
    ));
  }

  // Add blog article schema
  if (pageInfo.type === 'blog') {
    const datePublished = '2025-01-01'; // Default date
    schemas.push(SCHEMA_TEMPLATES.articleTemplate(
      pageInfo.title,
      pageInfo.description,
      datePublished,
      new Date().toISOString().split('T')[0]
    ));
  }

  // Add FAQ schema
  if (pageInfo.type === 'faq' && pageInfo.faqItems.length > 0) {
    schemas.push(SCHEMA_TEMPLATES.faqTemplate(pageInfo.faqItems));
  }

  // Add breadcrumb schema for all pages except homepage
  if (pageInfo.type !== 'homepage') {
    const breadcrumbs = [
      { name: 'Главная', url: 'https://avtogost77.ru' }
    ];
    
    if (pageInfo.type === 'route') {
      breadcrumbs.push({ name: 'Маршруты', url: 'https://avtogost77.ru/routes' });
      breadcrumbs.push({ name: pageInfo.title, url: `https://avtogost77.ru${filePath.replace('.html', '')}` });
    } else if (pageInfo.type === 'blog') {
      breadcrumbs.push({ name: 'Блог', url: 'https://avtogost77.ru/blog' });
      breadcrumbs.push({ name: pageInfo.title, url: `https://avtogost77.ru/${path.basename(filePath, '.html')}` });
    }
    
    if (breadcrumbs.length > 1) {
      schemas.push(SCHEMA_TEMPLATES.breadcrumbTemplate(breadcrumbs));
    }
  }

  // Add service schema for service pages
  if (pageInfo.type === 'calculator' || pageInfo.type === 'industry') {
    schemas.push(SCHEMA_TEMPLATES.serviceTemplate({
      type: pageInfo.title,
      description: pageInfo.description,
      area: 'Россия'
    }));
  }

  return schemas;
}

// Add schema to HTML
function addSchemaToHtml(htmlContent, schemas) {
  if (schemas.length === 0) return htmlContent;

  // Generate schema script tags
  const schemaTags = schemas.map(schema => 
    `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
  ).join('\n');

  // Check if schema already exists
  if (htmlContent.includes('type="application/ld+json"')) {
    // Replace existing schema
    htmlContent = htmlContent.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
      ''
    );
  }

  // Add schema before closing head tag
  if (htmlContent.includes('</head>')) {
    htmlContent = htmlContent.replace('</head>', `${schemaTags}\n</head>`);
  } else {
    // If no head tag, add after <html>
    htmlContent = htmlContent.replace('<html', `<html>\n${schemaTags}\n<`);
  }

  return htmlContent;
}

// Process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pageInfo = extractPageInfo(content, filePath);
    const schemas = generateSchema(pageInfo, filePath);
    
    if (schemas.length > 0) {
      const updatedContent = addSchemaToHtml(content, schemas);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Added Schema.org markup to: ${filePath}`);
      return true;
    }
    
    console.log(`⏭️ Skipped (no applicable schema): ${filePath}`);
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', '.git', 'assets'].includes(file)) {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main function
async function main() {
  console.log('🔍 Starting Schema.org markup addition...\n');
  
  const htmlFiles = findHtmlFiles('.');
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  let successCount = 0;
  
  for (const file of htmlFiles) {
    if (processFile(file)) {
      successCount++;
    }
  }
  
  console.log(`\n✅ Successfully added Schema.org markup to ${successCount} files`);
}

// Run the script
main().catch(console.error);