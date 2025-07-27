#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const { generateRouteContent } = require('./content-generator');

// Настройка Nunjucks
nunjucks.configure(path.join(__dirname, '..', 'templates'), { 
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

// Загрузка данных
const cities = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'data', 'cities.yaml'), 'utf8'));
const services = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'data', 'services.yaml'), 'utf8'));
const routes = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'data', 'routes.yaml'), 'utf8'));

// Модификаторы
const modifiers = ['', 'nedorogo', 'srochno'];

// Счетчики
let generatedCount = 0;
const startTime = Date.now();

// Генерация всех комбинаций маршрутов
function generateAllRoutes() {
  const allRoutes = [];
  
  // Для каждого города
  cities.forEach(fromCity => {
    cities.forEach(toCity => {
      // Пропускаем одинаковые города
      if (fromCity.slug === toCity.slug) return;
      
      // Для каждого типа услуги
      services.forEach(service => {
        // Только сборные грузы для межрегиональных
        if (service.slug === 'sbornye-gruzy' && fromCity.region === toCity.region) {
          return; // Пропускаем внутрирегиональные для сборных
        }
        
        // Для каждого модификатора
        modifiers.forEach(modifier => {
          const route = {
            service: service.slug,
            service_ru: service.name,
            from_city: fromCity.name,
            to_city: toCity.name,
            from_slug: fromCity.slug,
            to_slug: toCity.slug,
            modifier: modifier,
            payload: service.payload || 'от 1 м³'
          };
          
          // Генерация URL и заголовков
          const urlParts = [service.slug, fromCity.slug, toCity.slug];
          if (modifier) urlParts.push(modifier);
          route.output_path = urlParts.join('-') + '.html';
          
          // Заголовок H1
          const modifierText = modifier === 'nedorogo' ? ' недорого' : modifier === 'srochno' ? ' срочно' : '';
          route.h1 = `${service.name} ${fromCity.name} — ${toCity.name}${modifierText}`;
          
          // Title
          route.title = `${route.h1} | АвтоГОСТ`;
          
          // Description
          const modifierDesc = modifier === 'nedorogo' ? ' по выгодной цене' : modifier === 'srochno' ? ' с экспресс-доставкой' : '';
          route.description = `${service.name} по маршруту ${fromCity.name} — ${toCity.name}${modifierDesc}. Надежно, быстро, с гарантией • ${service.payload}`;
          
          // Subtitle
          route.subtitle = `${fromCity.name} → ${toCity.name} • ${service.payload}`;
          
          allRoutes.push(route);
        });
      });
    });
  });
  
  return allRoutes;
}

// Генерация HTML для маршрута
function generateRoutePage(route) {
  // Генерируем контент
  const enrichedRoute = generateRouteContent(route);
  
  // Добавляем похожие маршруты
  enrichedRoute.related_routes = [
    {
      url: `${route.service}-${route.to_slug}-${route.from_slug}.html`,
      title: `${route.service_ru} ${route.to_city} — ${route.from_city}`
    },
    {
      url: `${route.service}-moskva-${route.to_slug}.html`,
      title: `${route.service_ru} Москва — ${route.to_city}`
    },
    {
      url: `${route.service}-${route.from_slug}-spb.html`,
      title: `${route.service_ru} ${route.from_city} — Санкт-Петербург`
    }
  ].filter(r => r.url !== route.output_path).slice(0, 3);
  
  // Рендерим шаблон
  const html = nunjucks.render('landing-enhanced.njk', enrichedRoute);
  
  // Сохраняем файл
  const outputPath = path.join(__dirname, '..', enrichedRoute.output_path);
  fs.writeFileSync(outputPath, html);
  
  generatedCount++;
  
  // Прогресс каждые 100 страниц
  if (generatedCount % 100 === 0) {
    console.log(`✅ Сгенерировано ${generatedCount} страниц...`);
  }
}

// Обновление sitemap
function updateSitemap(routes) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Удаляем закрывающий тег
  sitemap = sitemap.replace('</urlset>', '');
  
  // Добавляем новые URL
  routes.forEach(route => {
    const priority = route.modifier === '' ? '0.8' : '0.7';
    const url = `
  <url>
    <loc>https://avtogost77.ru/${route.output_path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    sitemap += url;
  });
  
  // Закрываем sitemap
  sitemap += '\n</urlset>';
  
  fs.writeFileSync(sitemapPath, sitemap);
}

// Главная функция
async function main() {
  console.log('🚀 ЗАПУСКАЮ ГЕНЕРАЦИЮ ЛЕНДИНГОВ С ПОЛНЫМ КОНТЕНТОМ!\n');
  
  // Генерируем все маршруты
  const allRoutes = generateAllRoutes();
  console.log(`📊 Найдено ${allRoutes.length} комбинаций маршрутов\n`);
  
  // Генерируем страницы партиями
  const batchSize = 400;
  for (let i = 0; i < allRoutes.length; i += batchSize) {
    const batch = allRoutes.slice(i, i + batchSize);
    
    console.log(`\n🔄 Генерирую партию ${Math.floor(i/batchSize) + 1} (${batch.length} страниц)...`);
    
    batch.forEach(route => {
      try {
        generateRoutePage(route);
      } catch (error) {
        console.error(`❌ Ошибка при генерации ${route.output_path}:`, error.message);
      }
    });
    
    // Обновляем sitemap для этой партии
    updateSitemap(batch);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log(`\n✅ ГОТОВО! Сгенерировано ${generatedCount} страниц за ${duration} секунд`);
  console.log(`📍 Sitemap обновлен`);
  console.log(`\n💡 Теперь страницы содержат:`);
  console.log(`   - Уникальный контент (30-50% различий)`);
  console.log(`   - Информацию о маршруте`);
  console.log(`   - FAQ с ответами`);
  console.log(`   - Преимущества`);
  console.log(`   - CTA блоки`);
  console.log(`   - Внутреннюю перелинковку`);
}

// Запуск
main().catch(console.error);