const fs = require('fs');
const path = require('path');

// Базовая организация
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://avtogost77.ru/#organization",
    "name": "АвтоГОСТ",
    "alternateName": "AvtoGOST77",
    "url": "https://avtogost77.ru/",
    "logo": {
        "@type": "ImageObject",
        "url": "https://avtogost77.ru/assets/img/logo.svg",
        "width": 200,
        "height": 60
    },
    "image": "https://avtogost77.ru/assets/img/hero-logistics.webp",
    "description": "Профессиональная транспортная компания, специализирующаяся на грузоперевозках по России. Быстрая подача транспорта, точный расчет стоимости, круглосуточная работа.",
    "telephone": "+7 916 272-09-32",
    "email": "info@avtogost77.ru",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Большая Почтовая, д. 36",
        "addressLocality": "Москва",
        "addressRegion": "Москва",
        "postalCode": "105082",
        "addressCountry": "RU"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.780874,
        "longitude": 37.704310
    },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
    },
    "sameAs": [
        "https://t.me/avtogost77",
        "https://wa.me/79162720932"
    ],
    "priceRange": "₽₽",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "RUB",
    "areaServed": {
        "@type": "Country",
        "name": "Россия"
    },
    "slogan": "Доставим вовремя и безопасно",
    "foundingDate": "2010",
    "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": 50
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2341",
        "bestRating": "5",
        "worstRating": "1"
    }
};

// Сервис грузоперевозок
const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://avtogost77.ru/#service",
    "serviceType": "Грузоперевозки",
    "provider": {
        "@id": "https://avtogost77.ru/#organization"
    },
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
                    "name": "Междугородние перевозки",
                    "description": "Доставка грузов между городами России"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",  
                    "name": "Городские перевозки",
                    "description": "Доставка грузов по Москве и области"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Экспресс доставка",
                    "description": "Срочная доставка грузов за 2-24 часа"
                }
            }
        ]
    }
};

// Функция для создания Schema.org для разных типов страниц
function createSchemaForPage(pageInfo) {
    const schemas = [];
    
    // Всегда добавляем организацию
    schemas.push(organizationSchema);
    
    if (pageInfo.type === 'homepage') {
        // WebSite schema для главной
        schemas.push({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://avtogost77.ru/#website",
            "url": "https://avtogost77.ru/",
            "name": "АвтоГОСТ",
            "description": "Профессиональные грузоперевозки по России",
            "publisher": {
                "@id": "https://avtogost77.ru/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://avtogost77.ru/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            "inLanguage": "ru-RU"
        });
        
        schemas.push(serviceSchema);
        
        // BreadcrumbList для главной
        schemas.push({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://avtogost77.ru/"
            }]
        });
    }
    
    if (pageInfo.type === 'route') {
        // Specific service schema for route
        schemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `Грузоперевозки ${pageInfo.from} — ${pageInfo.to}`,
            "description": `Профессиональные грузоперевозки по маршруту ${pageInfo.from} — ${pageInfo.to}. Расстояние ${pageInfo.distance} км. ${pageInfo.description || ''}`,
            "provider": {
                "@id": "https://avtogost77.ru/#organization"
            },
            "areaServed": [
                {
                    "@type": "City",
                    "name": pageInfo.from
                },
                {
                    "@type": "City", 
                    "name": pageInfo.to
                }
            ],
            "offers": {
                "@type": "Offer",
                "price": pageInfo.price || "15000",
                "priceCurrency": "RUB",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": pageInfo.price || "15000",
                    "priceCurrency": "RUB",
                    "unitCode": "C62",
                    "unitText": "за перевозку"
                },
                "availability": "https://schema.org/InStock"
            }
        });
        
        // TravelAction для маршрута
        schemas.push({
            "@context": "https://schema.org",
            "@type": "TravelAction",
            "name": `Доставка груза ${pageInfo.from} — ${pageInfo.to}`,
            "fromLocation": {
                "@type": "City",
                "name": pageInfo.from
            },
            "toLocation": {
                "@type": "City",
                "name": pageInfo.to
            },
            "distance": {
                "@type": "Distance",
                "value": pageInfo.distance,
                "unitCode": "KMT"
            }
        });
    }
    
    if (pageInfo.type === 'blog') {
        // BlogPosting schema
        schemas.push({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": pageInfo.title,
            "description": pageInfo.description,
            "image": pageInfo.image || "https://avtogost77.ru/assets/img/blog-default.webp",
            "author": {
                "@type": "Person",
                "name": "Эксперт АвтоГОСТ",
                "url": "https://avtogost77.ru/about"
            },
            "publisher": {
                "@id": "https://avtogost77.ru/#organization"
            },
            "datePublished": pageInfo.datePublished || "2024-01-15",
            "dateModified": pageInfo.dateModified || "2025-08-05",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": pageInfo.url
            },
            "keywords": pageInfo.keywords || "логистика, грузоперевозки, доставка",
            "articleSection": "Логистика и транспорт",
            "wordCount": pageInfo.wordCount || 2500
        });
        
        // HowTo schema если есть инструкции
        if (pageInfo.hasHowTo) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": `Как ${pageInfo.howToTitle}`,
                "description": pageInfo.howToDescription,
                "totalTime": "PT30M",
                "supply": pageInfo.supplies || [],
                "step": pageInfo.steps || []
            });
        }
    }
    
    if (pageInfo.type === 'calculator') {
        // WebApplication schema для калькулятора
        schemas.push({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": pageInfo.title || "Калькулятор стоимости грузоперевозок",
            "description": pageInfo.description || "Онлайн калькулятор для расчета стоимости доставки грузов",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "RUB"
            },
            "featureList": [
                "Расчет по реальным расстояниям",
                "Учет типа груза",
                "Выбор типа транспорта",
                "Мгновенный результат"
            ]
        });
    }
    
    if (pageInfo.type === 'faq') {
        // FAQPage schema
        const faqItems = pageInfo.questions || [
            {
                question: "Как быстро вы можете подать транспорт?",
                answer: "Мы гарантируем подачу транспорта в течение 2 часов в пределах Москвы и области."
            },
            {
                question: "Какие типы грузов вы перевозите?",
                answer: "Мы перевозим любые типы грузов: стандартные, негабаритные, опасные (с соответствующими разрешениями), температурные."
            }
        ];
        
        schemas.push({
            "@context": "https://schema.org",
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
    
    // LocalBusiness для контактов
    if (pageInfo.type === 'contact') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://avtogost77.ru/#localbusiness",
            "name": "АвтоГОСТ - Офис в Москве",
            "image": "https://avtogost77.ru/assets/img/office.webp",
            "telephone": "+7 916 272-09-32",
            "priceRange": "₽₽",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "ул. Большая Почтовая, д. 36",
                "addressLocality": "Москва",
                "addressRegion": "Москва",
                "postalCode": "105082",
                "addressCountry": "RU"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 55.780874,
                "longitude": 37.704310
            },
            "url": "https://avtogost77.ru/contact",
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
            },
            "hasMap": "https://yandex.ru/maps/-/CCUBqOWoXD"
        });
    }
    
    return schemas;
}

// Функция для добавления Schema.org в HTML
function addSchemaToHTML(filepath, schemas) {
    let html = fs.readFileSync(filepath, 'utf8');
    
    // Удаляем старые Schema.org если есть
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    
    // Формируем новый Schema.org
    const schemaScript = schemas.map(schema => 
        `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
    ).join('\n    ');
    
    // Вставляем перед </head>
    html = html.replace('</head>', `    ${schemaScript}\n</head>`);
    
    fs.writeFileSync(filepath, html);
    console.log(`✅ Добавлена Schema.org разметка в ${filepath}`);
}

// Обработка всех страниц
function processAllPages() {
    // Главная страница
    addSchemaToHTML('index.html', createSchemaForPage({ type: 'homepage' }));
    
    // Страницы услуг
    const servicePages = [
        { file: 'services.html', type: 'service' },
        { file: 'urgent-delivery.html', type: 'service' },
        { file: 'ip-small-business-delivery.html', type: 'service' },
        { file: 'self-employed-delivery.html', type: 'service' }
    ];
    
    servicePages.forEach(page => {
        if (fs.existsSync(page.file)) {
            addSchemaToHTML(page.file, createSchemaForPage({ type: page.type }));
        }
    });
    
    // FAQ
    if (fs.existsSync('faq.html')) {
        addSchemaToHTML('faq.html', createSchemaForPage({ type: 'faq' }));
    }
    
    // Контакты
    if (fs.existsSync('contact.html')) {
        addSchemaToHTML('contact.html', createSchemaForPage({ type: 'contact' }));
    }
    
    // Блог статьи
    const blogPages = [
        {
            file: 'blog-1-carrier-failed.html',
            title: 'Что делать, если подвел перевозчик',
            description: 'Пошаговая инструкция действий при срыве доставки перевозчиком',
            datePublished: '2024-01-15',
            hasHowTo: true,
            howToTitle: 'решить проблему с перевозчиком',
            howToDescription: 'Инструкция по решению проблем при срыве доставки'
        },
        {
            file: 'blog-2-wildberries-delivery.html',
            title: 'Доставка для Wildberries: полное руководство',
            description: 'Как организовать доставку товаров на склады Wildberries',
            datePublished: '2024-02-01'
        },
        {
            file: 'blog-3-spot-orders.html',
            title: 'Спот-заявки в логистике: экономия до 40%',
            description: 'Как использовать спот-рынок грузоперевозок для снижения затрат',
            datePublished: '2024-02-15',
            wordCount: 3500
        },
        {
            file: 'blog-4-remote-logistics.html',
            title: 'Логистика отдаленных регионов',
            description: 'Особенности организации доставки в труднодоступные регионы России',
            datePublished: '2024-03-01'
        },
        {
            file: 'blog-5-logistics-optimization.html',
            title: '7 способов оптимизации логистики',
            description: 'Практические методы снижения логистических затрат',
            datePublished: '2024-03-15',
            hasHowTo: true,
            howToTitle: 'оптимизировать логистику компании',
            howToDescription: '7 проверенных способов снижения затрат на логистику'
        },
        {
            file: 'blog-6-marketplace-insider.html',
            title: 'Инсайды работы с маркетплейсами',
            description: 'Секреты эффективной логистики для продавцов на маркетплейсах',
            datePublished: '2024-04-01'
        }
    ];
    
    blogPages.forEach(page => {
        if (fs.existsSync(page.file)) {
            const pageInfo = {
                type: 'blog',
                url: `https://avtogost77.ru/${page.file}`,
                ...page
            };
            addSchemaToHTML(page.file, createSchemaForPage(pageInfo));
        }
    });
    
    // Маршруты
    const routesDir = 'routes';
    if (fs.existsSync(routesDir)) {
        // Рекурсивно обходим все маршруты
        function processRoutes(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    processRoutes(fullPath);
                } else if (item.endsWith('.html')) {
                    // Извлекаем информацию о маршруте из имени файла
                    const match = item.match(/([^-]+)-([^.]+)\.html/);
                    if (match) {
                        const from = match[1].replace('moskva', 'Москва');
                        const to = match[2].charAt(0).toUpperCase() + match[2].slice(1);
                        
                        // Пытаемся извлечь расстояние из файла
                        const content = fs.readFileSync(fullPath, 'utf8');
                        const distanceMatch = content.match(/(\d+)\s*км/);
                        const distance = distanceMatch ? distanceMatch[1] : '500';
                        
                        const pageInfo = {
                            type: 'route',
                            from: from,
                            to: to,
                            distance: distance,
                            url: `https://avtogost77.ru/${fullPath.replace(/\\/g, '/')}`
                        };
                        
                        addSchemaToHTML(fullPath, createSchemaForPage(pageInfo));
                    }
                }
            });
        }
        processRoutes(routesDir);
    }
    
    // Калькуляторы
    const calculatorsDir = 'calculators';
    if (fs.existsSync(calculatorsDir)) {
        const calculators = fs.readdirSync(calculatorsDir);
        calculators.forEach(calc => {
            if (calc.endsWith('.html')) {
                const fullPath = path.join(calculatorsDir, calc);
                const pageInfo = {
                    type: 'calculator',
                    title: `Калькулятор ${calc.replace('.html', '').replace('-', ' ')}`,
                    url: `https://avtogost77.ru/${fullPath}`
                };
                addSchemaToHTML(fullPath, createSchemaForPage(pageInfo));
            }
        });
    }
    
    console.log('\n✨ Schema.org разметка успешно добавлена на все страницы!');
}

// Запускаем обработку
processAllPages();