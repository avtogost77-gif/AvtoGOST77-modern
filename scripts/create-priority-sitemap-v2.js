const fs = require('fs');

// Города ЦФО
const CFO_CITIES = [
  'Москва', 'Белгород', 'Брянск', 'Владимир', 'Воронеж', 'Иваново',
  'Калуга', 'Кострома', 'Курск', 'Липецк', 'Орел', 'Рязань',
  'Смоленск', 'Тамбов', 'Тверь', 'Тула', 'Ярославль'
];

// Города-миллионники
const MILLION_CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Уфа', 'Ростов-на-Дону',
  'Омск', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'
];

// Объединяем и убираем дубли
const PRIORITY_CITIES = [...new Set([...CFO_CITIES, ...MILLION_CITIES, 'Санкт-Петербург'])];

console.log(`🎯 Приоритетные города (${PRIORITY_CITIES.length}):`, PRIORITY_CITIES);

// Модификаторы
const MODIFIERS = ['', '-nedorogo', '-srochno'];

// Начинаем новый sitemap
let newSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Главная -->
    <url>
        <loc>https://avtogost77.ru/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Основные страницы -->
`;

// Добавляем основные страницы
const mainPages = [
  'services.html', 'contact.html', 'about.html', 'blog.html',
  'calculator.html', 'track.html', 'privacy.html', 'terms.html',
  'help.html', 'logistics-antivirus.html'
];

// SEO страницы из предыдущего релиза (уже проиндексированы!)
const seoPages = [
  'faq-seo-optimized.html',
  'moscow-spb-delivery.html', 
  'logistics-for-pvh.html',
  'ip-small-business-delivery.html',
  'self-employed-delivery.html',
  'confectionery-delivery.html',
  'regions-to-marketplaces.html'
];

mainPages.forEach(page => {
  newSitemap += `    <url>
        <loc>https://avtogost77.ru/${page}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;
});

newSitemap += `
    <!-- SEO страницы (уже проиндексированы) -->
`;

// Добавляем SEO страницы
seoPages.forEach(page => {
  newSitemap += `    <url>
        <loc>https://avtogost77.ru/${page}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>
`;
});

newSitemap += `
    <!-- Блог статьи -->
`;

// Добавляем блог статьи
const blogPages = [
  'blog/cargo-safety.html',
  'blog/choose-transport.html', 
  'blog/delivery-myths.html',
  'blog/packaging-guide.html',
  // Блог статьи из предыдущего релиза
  'blog-1-carrier-failed.html',
  'blog-2-wildberries-delivery.html',
  'blog-3-spot-orders.html',
  'blog-4-remote-logistics.html',
  'blog-5-logistics-optimization.html',
  'blog-6-marketplace-insider.html'
];

blogPages.forEach(page => {
  newSitemap += `    <url>
        <loc>https://avtogost77.ru/${page}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
`;
});

newSitemap += `
    <!-- Приоритетные маршруты (ЦФО + миллионники + СПб) -->
`;

// Генерируем маршруты между приоритетными городами
let routeCount = 0;
const maxRoutes = 9850; // Оставляем запас для основных страниц (27 страниц уже добавлено)

for (let fromCity of PRIORITY_CITIES) {
  for (let toCity of PRIORITY_CITIES) {
    if (fromCity === toCity) continue;
    if (routeCount >= maxRoutes) break;
    
    const fromSlug = fromCity.toLowerCase()
      .replace(/-/g, '_')
      .replace(/\s+/g, '_')
      .replace('санкт_петербург', 'spb');
    
    const toSlug = toCity.toLowerCase()
      .replace(/-/g, '_')
      .replace(/\s+/g, '_')
      .replace('санкт_петербург', 'spb');
    
    for (let modifier of MODIFIERS) {
      if (routeCount >= maxRoutes) break;
      
      const url = `${fromSlug}-${toSlug}${modifier}.html`;
      const priority = modifier === '' ? '0.8' : '0.7';
      
      newSitemap += `    <url>
        <loc>https://avtogost77.ru/${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
    </url>
`;
      routeCount++;
    }
  }
}

newSitemap += `</urlset>`;

// Сохраняем новый sitemap в корень проекта
fs.writeFileSync('../sitemap.xml', newSitemap);

const totalPages = mainPages.length + seoPages.length + blogPages.length + routeCount;

console.log(`✅ Создан новый sitemap.xml с ${totalPages} страницами`);
console.log(`📊 Включено:`);
console.log(`   - ${mainPages.length} основных страниц`);
console.log(`   - ${seoPages.length} SEO страниц (уже проиндексированы)`);
console.log(`   - ${blogPages.length} блог статей`);
console.log(`   - ${routeCount} маршрутов между приоритетными городами`);
console.log(`🎯 Приоритеты: ЦФО + миллионники + Санкт-Петербург`);
console.log(`📁 Sitemap сохранен в корень проекта`);