const fs = require('fs');
const path = require('path');

// Function to read all HTML files from specific directories
function getHTMLFiles() {
    const directories = ['routes', 'calculators', 'industries', 'blog'];
    const htmlFiles = [];
    
    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            readDirectory(dir, htmlFiles);
        }
    });
    
    // Also add root level blog files
    const rootFiles = fs.readdirSync('.');
    rootFiles.forEach(file => {
        if (file.startsWith('blog-') && file.endsWith('.html')) {
            htmlFiles.push(path.join('.', file));
        }
    });
    
    return htmlFiles;
}

function readDirectory(dir, fileList) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            readDirectory(filePath, fileList);
        } else if (file.endsWith('.html') && !file.includes('index.html')) {
            fileList.push(filePath);
        }
    });
}

// Generate Schema.org markup based on page type
function generateSchemaMarkup(filePath, content) {
    const schemas = [];
    
    // Base Organization schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "url": "https://avtogost77.ru",
        "logo": "https://avtogost77.ru/favicon.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+7-495-123-45-67",
            "contactType": "customer service",
            "availableLanguage": "Russian"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RU",
            "addressLocality": "Москва"
        }
    };
    
    if (filePath.includes('routes/')) {
        // Extract route info
        const routeMatch = filePath.match(/routes\/([^\/]+)\/([^-]+)-([^\.]+)\.html/);
        if (routeMatch) {
            const fromCity = routeMatch[2];
            const toCity = routeMatch[3];
            
            // Service schema for route
            const serviceSchema = {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Грузоперевозки",
                "provider": orgSchema,
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
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": `Грузоперевозки ${fromCity} — ${toCity}`,
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Доставка грузов"
                            }
                        }
                    ]
                }
            };
            schemas.push(serviceSchema);
            
            // FAQ schema if FAQ section exists
            if (content.includes('faq-section') || content.includes('Часто задаваемые вопросы')) {
                const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": []
                };
                
                // Extract FAQs using regex
                const faqMatches = content.matchAll(/<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>/g);
                for (const match of faqMatches) {
                    if (match[1].includes('?')) {
                        faqSchema.mainEntity.push({
                            "@type": "Question",
                            "name": match[1].trim(),
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": match[2].trim()
                            }
                        });
                    }
                }
                
                if (faqSchema.mainEntity.length > 0) {
                    schemas.push(faqSchema);
                }
            }
        }
    } else if (filePath.includes('calculators/')) {
        // WebApplication schema for calculators
        const calcSchema = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Калькулятор грузоперевозок",
            "url": `https://avtogost77.ru/${filePath.replace('.html', '')}`,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "RUB"
            },
            "provider": orgSchema
        };
        schemas.push(calcSchema);
    } else if (filePath.includes('industries/')) {
        // Service schema for industries
        const industryName = path.basename(filePath, '.html');
        const industrySchema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": `Грузоперевозки для ${industryName}`,
            "provider": orgSchema,
            "areaServed": {
                "@type": "Country",
                "name": "Россия"
            }
        };
        schemas.push(industrySchema);
    } else if (filePath.includes('blog') || filePath.startsWith('blog-')) {
        // Article schema for blog posts
        const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
        
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": titleMatch ? titleMatch[1] : "Статья о логистике",
            "description": descMatch ? descMatch[1] : "Полезная информация о грузоперевозках",
            "author": {
                "@type": "Organization",
                "name": "АвтоГОСТ"
            },
            "publisher": orgSchema,
            "datePublished": new Date().toISOString().split('T')[0],
            "dateModified": new Date().toISOString().split('T')[0],
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://avtogost77.ru/${filePath.replace('.html', '')}`
            }
        };
        
        // Add HowTo schema if applicable
        if (content.includes('process-steps') || content.includes('Пошаговая инструкция')) {
            const howToSchema = {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": titleMatch ? titleMatch[1] : "Инструкция",
                "step": []
            };
            
            const stepMatches = content.matchAll(/<li[^>]*>([^<]+)<\/li>/g);
            let stepIndex = 1;
            for (const match of stepMatches) {
                if (stepIndex <= 10 && match[1].length > 20) {
                    howToSchema.step.push({
                        "@type": "HowToStep",
                        "text": match[1].trim(),
                        "position": stepIndex++
                    });
                }
            }
            
            if (howToSchema.step.length > 0) {
                schemas.push(howToSchema);
            }
        }
        
        schemas.push(articleSchema);
    }
    
    // BreadcrumbList schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://avtogost77.ru"
            }
        ]
    };
    
    if (filePath.includes('routes/')) {
        breadcrumbSchema.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Маршруты",
            "item": "https://avtogost77.ru/routes"
        });
        
        const cityMatch = filePath.match(/routes\/([^\/]+)\//);
        if (cityMatch) {
            breadcrumbSchema.itemListElement.push({
                "@type": "ListItem",
                "position": 3,
                "name": cityMatch[1],
                "item": `https://avtogost77.ru/routes/${cityMatch[1]}`
            });
        }
    } else if (filePath.includes('calculators/')) {
        breadcrumbSchema.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Калькуляторы",
            "item": "https://avtogost77.ru/calculators"
        });
    } else if (filePath.includes('industries/')) {
        breadcrumbSchema.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Отрасли",
            "item": "https://avtogost77.ru/industries"
        });
    } else if (filePath.includes('blog')) {
        breadcrumbSchema.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Блог",
            "item": "https://avtogost77.ru/blog"
        });
    }
    
    schemas.push(breadcrumbSchema);
    
    return schemas;
}

// Add schema markup to HTML file
function addSchemaToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if schema already exists
        if (content.includes('application/ld+json')) {
            console.log(`⚠️  Schema already exists in ${filePath}, skipping...`);
            return false;
        }
        
        // Generate schemas
        const schemas = generateSchemaMarkup(filePath, content);
        
        // Create script tags
        const schemaTags = schemas.map(schema => 
            `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
        ).join('\n');
        
        // Find </head> tag and insert schemas before it
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex === -1) {
            console.log(`❌ No </head> tag found in ${filePath}`);
            return false;
        }
        
        content = content.slice(0, headEndIndex) + '\n' + schemaTags + '\n' + content.slice(headEndIndex);
        
        // Write updated content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Added Schema.org markup to ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main function
async function main() {
    console.log('🚀 Starting Schema.org markup addition...\n');
    
    const htmlFiles = getHTMLFiles();
    console.log(`Found ${htmlFiles.length} HTML files to process\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const file of htmlFiles) {
        const result = addSchemaToFile(file);
        if (result === true) {
            successCount++;
        } else if (result === false) {
            skipCount++;
        } else {
            errorCount++;
        }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully updated: ${successCount} files`);
    console.log(`⚠️  Skipped (already has schema): ${skipCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    console.log('\n✨ Schema.org markup addition completed!');
}

// Run the script
main().catch(console.error);