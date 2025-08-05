const fs = require('fs');
const path = require('path');

// 🔗 СКРИПТ ВНУТРЕННЕЙ ПЕРЕЛИНКОВКИ ДЛЯ SEO
// Добавляет блоки похожих страниц на каждую страницу

// База данных всех страниц
const PAGES_DATABASE = {
  routes: [],
  calculators: [],
  industries: [],
  blog: [
    { url: '/blog-1-carrier-failed.html', title: 'Что делать, если подвел перевозчик', topic: 'форс-мажор' },
    { url: '/blog-2-wildberries-delivery.html', title: 'Доставка для Wildberries', topic: 'маркетплейсы' },
    { url: '/blog-3-spot-orders.html', title: 'Спот-заявки в логистике', topic: 'срочная доставка' },
    { url: '/blog-4-remote-logistics.html', title: 'Логистика отдаленных регионов', topic: 'межгород' },
    { url: '/blog-5-logistics-optimization.html', title: 'Оптимизация логистики', topic: 'экономия' },
    { url: '/blog-6-marketplace-insider.html', title: 'Инсайды маркетплейсов', topic: 'маркетплейсы' }
  ]
};

// Сканируем существующие страницы
function scanPages() {
  // Сканируем маршруты
  const routesDir = path.join(__dirname, '../../routes');
  if (fs.existsSync(routesDir)) {
    const cities = fs.readdirSync(routesDir).filter(f => fs.statSync(path.join(routesDir, f)).isDirectory());
    
    cities.forEach(city => {
      const cityDir = path.join(routesDir, city);
      const files = fs.readdirSync(cityDir).filter(f => f.endsWith('.html'));
      
      files.forEach(file => {
        if (file !== 'index.html') {
          const content = fs.readFileSync(path.join(cityDir, file), 'utf-8');
          const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
          const title = titleMatch ? titleMatch[1] : file.replace('.html', '');
          
          PAGES_DATABASE.routes.push({
            url: `/routes/${city}/${file}`,
            file: path.join(cityDir, file),
            city: city,
            title: title,
            fromCity: extractCity(file, 'from'),
            toCity: extractCity(file, 'to')
          });
        }
      });
    });
  }

  // Сканируем калькуляторы
  const calcDir = path.join(__dirname, '../../calculators');
  if (fs.existsSync(calcDir)) {
    const files = fs.readdirSync(calcDir).filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
      if (file !== 'index.html') {
        const content = fs.readFileSync(path.join(calcDir, file), 'utf-8');
        const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : file.replace('.html', '');
        
        PAGES_DATABASE.calculators.push({
          url: `/calculators/${file}`,
          file: path.join(calcDir, file),
          title: title,
          type: extractCalcType(file)
        });
      }
    });
  }

  // Сканируем отрасли
  const indDir = path.join(__dirname, '../../industries');
  if (fs.existsSync(indDir)) {
    const files = fs.readdirSync(indDir).filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
      if (file !== 'index.html') {
        const content = fs.readFileSync(path.join(indDir, file), 'utf-8');
        const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : file.replace('.html', '');
        
        PAGES_DATABASE.industries.push({
          url: `/industries/${file}`,
          file: path.join(indDir, file),
          title: title,
          industry: extractIndustry(file)
        });
      }
    });
  }
}

// Извлекаем город из имени файла
function extractCity(filename, type) {
  const parts = filename.replace('.html', '').split('-');
  if (type === 'from') return parts[0];
  if (type === 'to') return parts[parts.length - 1];
  return '';
}

// Извлекаем тип калькулятора
function extractCalcType(filename) {
  if (filename.includes('sbornye')) return 'сборные грузы';
  if (filename.includes('express')) return 'экспресс';
  if (filename.includes('oversized')) return 'негабарит';
  if (filename.includes('dangerous')) return 'опасные грузы';
  if (filename.includes('refrigerated')) return 'рефрижератор';
  if (filename.includes('furniture')) return 'мебель';
  if (filename.includes('moving')) return 'переезд';
  return 'стандарт';
}

// Извлекаем отрасль
function extractIndustry(filename) {
  const name = filename.replace('.html', '').replace(/-/g, ' ');
  return name;
}

// Генерируем HTML блок внутренних ссылок
function generateLinksBlock(currentPage) {
  let html = `
<!-- Блок внутренней перелинковки SEO -->
<section class="internal-links-section">
  <div class="container">
    <h2 class="section-title">Полезная информация</h2>
    <div class="links-grid">`;

  // Добавляем похожие маршруты (из того же города)
  if (currentPage.type === 'route' && currentPage.fromCity) {
    const similarRoutes = PAGES_DATABASE.routes.filter(r => 
      r.fromCity === currentPage.fromCity && 
      r.url !== currentPage.url
    ).slice(0, 4);

    if (similarRoutes.length > 0) {
      html += `
      <div class="links-block">
        <h3>Похожие маршруты из ${getReadableCity(currentPage.fromCity)}</h3>
        <ul class="links-list">`;
      
      similarRoutes.forEach(route => {
        html += `
          <li><a href="${route.url}">${route.title}</a></li>`;
      });
      
      html += `
        </ul>
      </div>`;
    }
  }

  // Добавляем релевантные калькуляторы
  if (PAGES_DATABASE.calculators.length > 0) {
    html += `
      <div class="links-block">
        <h3>Рассчитать стоимость</h3>
        <ul class="links-list">`;
    
    PAGES_DATABASE.calculators.slice(0, 3).forEach(calc => {
      html += `
          <li><a href="${calc.url}">${calc.title}</a></li>`;
    });
    
    html += `
        </ul>
      </div>`;
  }

  // Добавляем подходящие отрасли
  if (PAGES_DATABASE.industries.length > 0) {
    html += `
      <div class="links-block">
        <h3>Грузоперевозки по отраслям</h3>
        <ul class="links-list">`;
    
    PAGES_DATABASE.industries.slice(0, 3).forEach(ind => {
      html += `
          <li><a href="${ind.url}">${ind.title}</a></li>`;
    });
    
    html += `
        </ul>
      </div>`;
  }

  // Добавляем статьи блога
  html += `
      <div class="links-block">
        <h3>Полезные статьи</h3>
        <ul class="links-list">`;
  
  // Выбираем релевантные статьи
  const relevantArticles = selectRelevantArticles(currentPage);
  relevantArticles.forEach(article => {
    html += `
          <li><a href="${article.url}">${article.title}</a></li>`;
  });
  
  html += `
        </ul>
      </div>`;

  html += `
    </div>
  </div>
</section>

<style>
.internal-links-section {
  padding: 4rem 0;
  background-color: #f8f9fa;
  margin-top: 3rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.links-block {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.links-block h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2563eb;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-list li {
  margin-bottom: 0.75rem;
}

.links-list a {
  color: #4b5563;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.links-list a:before {
  content: "→";
  margin-right: 0.5rem;
  color: #2563eb;
}

.links-list a:hover {
  color: #2563eb;
}

@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`;

  return html;
}

// Получаем читаемое название города
function getReadableCity(citySlug) {
  const cities = {
    'moskva': 'Москвы',
    'spb': 'Санкт-Петербурга',
    'kazan': 'Казани',
    'nizhniy-novgorod': 'Нижнего Новгорода',
    'samara': 'Самары',
    'voronezh': 'Воронежа',
    'ekaterinburg': 'Екатеринбурга',
    'chelyabinsk': 'Челябинска',
    'rostov': 'Ростова-на-Дону'
  };
  return cities[citySlug] || citySlug;
}

// Выбираем релевантные статьи
function selectRelevantArticles(currentPage) {
  let relevant = [];
  
  // Для маршрутов с маркетплейс-локациями
  if (currentPage.url && (currentPage.url.includes('ozon') || currentPage.url.includes('wildberries'))) {
    relevant = PAGES_DATABASE.blog.filter(a => a.topic === 'маркетплейсы');
  }
  // Для дальних маршрутов
  else if (currentPage.type === 'route') {
    relevant = PAGES_DATABASE.blog.filter(a => a.topic === 'межгород' || a.topic === 'экономия');
  }
  // Для калькуляторов
  else if (currentPage.type === 'calculator') {
    relevant = PAGES_DATABASE.blog.filter(a => a.topic === 'экономия' || a.topic === 'срочная доставка');
  }
  
  // Если мало релевантных, добавляем популярные
  if (relevant.length < 3) {
    const popular = PAGES_DATABASE.blog.filter(a => !relevant.includes(a));
    relevant = [...relevant, ...popular].slice(0, 3);
  }
  
  return relevant.slice(0, 3);
}

// Добавляем блок ссылок на страницу
function addLinksToPage(pageInfo) {
  try {
    let content = fs.readFileSync(pageInfo.file, 'utf-8');
    
    // Проверяем, не добавлен ли уже блок
    if (content.includes('internal-links-section')) {
      console.log(`⏭️  Пропускаем ${pageInfo.file} - блок уже добавлен`);
      return false;
    }
    
    // Определяем тип страницы
    const currentPage = {
      type: pageInfo.url.includes('/routes/') ? 'route' : 
            pageInfo.url.includes('/calculators/') ? 'calculator' : 'industry',
      url: pageInfo.url,
      fromCity: pageInfo.fromCity,
      toCity: pageInfo.toCity
    };
    
    // Генерируем блок ссылок
    const linksBlock = generateLinksBlock(currentPage);
    
    // Вставляем перед футером или в конец body
    if (content.includes('</footer>')) {
      content = content.replace('</footer>', linksBlock + '\n</footer>');
    } else if (content.includes('</body>')) {
      content = content.replace('</body>', linksBlock + '\n</body>');
    } else {
      console.log(`⚠️  Не найден footer/body в ${pageInfo.file}`);
      return false;
    }
    
    // Сохраняем файл
    fs.writeFileSync(pageInfo.file, content);
    console.log(`✅ Добавлены ссылки в ${pageInfo.file}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${pageInfo.file}:`, error.message);
    return false;
  }
}

// Главная функция
async function main() {
  console.log('🔗 ЗАПУСК ВНУТРЕННЕЙ ПЕРЕЛИНКОВКИ');
  console.log('==================================\n');
  
  // Сканируем все страницы
  console.log('📊 Сканирование страниц...');
  scanPages();
  
  console.log(`\n📈 Найдено страниц:`);
  console.log(`   - Маршруты: ${PAGES_DATABASE.routes.length}`);
  console.log(`   - Калькуляторы: ${PAGES_DATABASE.calculators.length}`);
  console.log(`   - Отрасли: ${PAGES_DATABASE.industries.length}`);
  console.log(`   - Статьи блога: ${PAGES_DATABASE.blog.length}`);
  
  // Обрабатываем все страницы
  console.log('\n🔧 Добавление внутренних ссылок...\n');
  
  let processed = 0;
  let updated = 0;
  
  // Обрабатываем маршруты
  for (const page of PAGES_DATABASE.routes) {
    if (addLinksToPage(page)) updated++;
    processed++;
  }
  
  // Обрабатываем калькуляторы
  for (const page of PAGES_DATABASE.calculators) {
    if (addLinksToPage(page)) updated++;
    processed++;
  }
  
  // Обрабатываем отрасли
  for (const page of PAGES_DATABASE.industries) {
    if (addLinksToPage(page)) updated++;
    processed++;
  }
  
  console.log('\n✨ ГОТОВО!');
  console.log(`📊 Обработано: ${processed} страниц`);
  console.log(`✅ Обновлено: ${updated} страниц`);
  console.log(`⏭️  Пропущено: ${processed - updated} страниц`);
}

// Запускаем скрипт
main().catch(console.error);