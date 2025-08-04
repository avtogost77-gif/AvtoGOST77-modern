const fs = require('fs');
const path = require('path');

// Приоритеты страниц для sitemap
const PAGE_PRIORITIES = {
  'index.html': { priority: '1.0', changefreq: 'weekly' },
  'services.html': { priority: '0.9', changefreq: 'monthly' },
  'about.html': { priority: '0.8', changefreq: 'monthly' },
  'contact.html': { priority: '0.8', changefreq: 'monthly' },
  'help.html': { priority: '0.7', changefreq: 'monthly' },
  'routes/': { priority: '0.9', changefreq: 'weekly' }, // Маршруты высокий приоритет
  'industries/': { priority: '0.8', changefreq: 'monthly' },
  'calculators/': { priority: '0.8', changefreq: 'weekly' },
  'cost/': { priority: '0.7', changefreq: 'monthly' },
  'blog/': { priority: '0.7', changefreq: 'weekly' },
  'default': { priority: '0.6', changefreq: 'monthly' }
};

// Исключения для sitemap
const EXCLUDE_PATTERNS = [
  '**/404.html',
  '**/AG77/**',
  '**/.github/**',
  '**/node_modules/**',
  '**/assets/**'
];

// Получение приоритета страницы
function getPagePriority(filePath) {
  for (const [pattern, config] of Object.entries(PAGE_PRIORITIES)) {
    if (filePath.includes(pattern)) {
      return config;
    }
  }
  return PAGE_PRIORITIES.default;
}

// Рекурсивный поиск HTML файлов (замена glob)
function findHtmlFiles(dir) {
  let htmlFiles = [];
  
  function searchDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Пропускаем исключенные директории
          if (EXCLUDE_PATTERNS.some(pattern => 
            pattern.includes(item) || 
            pattern.includes('**/' + item + '/**'))) {
            continue;
          }
          searchDir(fullPath);
        } else if (stat.isFile() && item.endsWith('.html')) {
          // Пропускаем исключенные файлы
          if (!EXCLUDE_PATTERNS.some(pattern => 
            pattern.includes(item) || 
            fullPath.includes(pattern.replace('**/','').replace('/**','')))) {
            htmlFiles.push(fullPath.replace('./', ''));
          }
        }
      }
    } catch (error) {
      // Игнорируем ошибки доступа к директориям
    }
  }
  
  searchDir(dir);
  return htmlFiles;
}

// Генерация URL из файлового пути
function generateURL(filePath) {
  let url = filePath;
  
  // Убираем index.html из URL
  if (url.endsWith('/index.html')) {
    url = url.replace('/index.html', '/');
  }
  
  // Убираем .html из других файлов
  if (url.endsWith('.html')) {
    url = url.replace('.html', '');
  }
  
  // Добавляем слэш в конце для директорий
  if (!url.endsWith('/') && !url.includes('.')) {
    url += '/';
  }
  
  return `https://avtogost77.ru/${url}`;
}

// Основная функция обновления sitemap
function updateSitemap() {
  console.log('🗺️ Обновляем sitemap.xml...');
  
  try {
    // Находим все HTML файлы
    const htmlFiles = findHtmlFiles('.');
    
    console.log(`📄 Найдено ${htmlFiles.length} HTML файлов`);
    
    // Группируем файлы по типам
    const pages = htmlFiles.map(filePath => {
      const normalizedPath = filePath.replace(/\\/g, '/');
      const config = getPagePriority(normalizedPath);
      const url = generateURL(normalizedPath);
      
      return {
        url,
        priority: config.priority,
        changefreq: config.changefreq,
        lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        filePath: normalizedPath
      };
    });
    
    // Сортируем по приоритету (высокий приоритет первым)
    pages.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
    
    // Генерируем XML sitemap
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Добавляем страницы
    for (const page of pages) {
      sitemapXML += `
    <url>
        <loc>${page.url}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
    }
    
    sitemapXML += `
</urlset>`;
    
    // Сохраняем sitemap.xml
            fs.writeFileSync('sitemap.xml', sitemapXML);
    console.log(`✅ Sitemap обновлен! Добавлено ${pages.length} страниц`);
    
    // Генерируем статистику по типам страниц
    const stats = {
      routes: pages.filter(p => p.filePath.includes('routes/')).length,
      industries: pages.filter(p => p.filePath.includes('industries/')).length,
      calculators: pages.filter(p => p.filePath.includes('calculators/')).length,
      cost: pages.filter(p => p.filePath.includes('cost/')).length,
      blog: pages.filter(p => p.filePath.includes('blog/')).length,
      main: pages.filter(p => !p.filePath.includes('/') || p.filePath === 'index.html').length
    };
    
    console.log('📊 Статистика sitemap:');
    console.log(`   🛣️  Маршруты: ${stats.routes}`);
    console.log(`   🏭 Отрасли: ${stats.industries}`);
    console.log(`   💰 Калькуляторы: ${stats.calculators}`);
    console.log(`   💳 "Сколько стоит": ${stats.cost}`);
    console.log(`   📝 Блог: ${stats.blog}`);
    console.log(`   🏠 Основные: ${stats.main}`);
    
    // Создаем robots.txt если его нет
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://avtogost77.ru/sitemap.xml

# Ускоряем индексацию важных разделов
Allow: /routes/
Allow: /industries/
Allow: /calculators/
Allow: /cost/

# Блокируем технические файлы
Disallow: /assets/
Disallow: /.github/
Disallow: /node_modules/
Disallow: *.json
Disallow: *.md

# Основные страницы
Allow: /services
Allow: /about
Allow: /contact
Allow: /help
Allow: /blog/`;
    
            if (!fs.existsSync('robots.txt')) {
          fs.writeFileSync('robots.txt', robotsTxt);
      console.log('🤖 Создан robots.txt');
    }
    
    return pages.length;
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении sitemap:', error);
    throw error;
  }
}

// Запуск обновления
if (require.main === module) {
  updateSitemap();
}

module.exports = { updateSitemap };