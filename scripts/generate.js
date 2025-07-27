#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const yaml = require('js-yaml');
const { transliterate } = require('transliteration');

// Configure Nunjucks to template directory
nunjucks.configure(path.join(__dirname, '..', 'templates'), { autoescape: false });

// Helpers
const slugOverrides = {
  'Москва': 'moskva',
  'Санкт-Петербург': 'spb',
  'Екатеринбург': 'ekaterinburg',
  'Казань': 'kazan',
  'Новосибирск': 'nsk'
};

function slugify(text) {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function citySlug(city) {
  return slugOverrides[city] || slugify(city);
}

// Load YAML matrix
const dataPath = path.join(__dirname, '..', 'data', 'routes.yaml');
const routes = yaml.load(fs.readFileSync(dataPath, 'utf8'));

const citiesPath = path.join(__dirname, '..', 'data', 'cities.yaml');
const servicesPath = path.join(__dirname, '..', 'data', 'services.yaml');
let cities = [];
let services = [];
if (fs.existsSync(citiesPath)) {
  cities = yaml.load(fs.readFileSync(citiesPath, 'utf8'));
}
if (fs.existsSync(servicesPath)) {
  services = yaml.load(fs.readFileSync(servicesPath, 'utf8'));
}

// Build auto routes for base pages (no modifier) when cities & services defined
if (cities.length && services.length) {
  cities.forEach(origin => {
    cities.forEach(dest => {
      if (origin.slug === dest.slug) return; // skip same city
      services.forEach(svc => {
        routes.push({
          service: svc.service,
          service_ru: svc.service_ru,
          from_city: origin.name,
          to_city: dest.name,
          payload: svc.payload,
          cta: svc.cta
        });
      });
    });
  });
}
// Deduplicate routes (avoid duplicates from YAML overrides)
const unique = new Map();
routes.forEach(r=>{
  const key=`${r.service}|${r.from_city}|${r.to_city}|${r.modifier||''}`;
  if(!unique.has(key)) unique.set(key,r);
});
const finalRoutes = Array.from(unique.values());

console.log(`Generating ${finalRoutes.length} routes...`);

const generatedUrls = [];

finalRoutes.forEach(route => {
  const fromSlug = citySlug(route.from_city);
  const toSlug = citySlug(route.to_city);
  const modifierSlug = route.modifier ? slugify(route.modifier) : '';

  const filename = `${route.service}-${fromSlug}-${toSlug}${modifierSlug ? '-' + modifierSlug : ''}.html`;
  const outputPath = filename; // root directory

  const payloadStr = route.payload ? ` • ${route.payload}` : '';

  const titleModifier = route.modifier ? ` ${route.modifier}` : '';
  const title = `${route.service_ru} ${route.from_city} - ${route.to_city}${titleModifier} | АвтоГОСТ`;
  const description = `${route.service_ru} по маршруту ${route.from_city} — ${route.to_city}. Быстро, надёжно, без переплат${payloadStr}.`;
  const h1 = `${route.service_ru} ${route.from_city} — ${route.to_city}${titleModifier ? ' ' + titleModifier : ''}`;
  const subtitle = route.subtitle || `${route.from_city} → ${route.to_city} ${payloadStr}`.trim();

  const html = nunjucks.render('landing.njk', {
    title,
    description,
    output_path: outputPath,
    service: route.service,
    service_ru: route.service_ru,
    from_city: route.from_city,
    to_city: route.to_city,
    h1,
    subtitle,
    cta_text: route.cta_text || 'Рассчитать стоимость'
  });

  fs.writeFileSync(path.join(__dirname, '..', filename), html);
  generatedUrls.push(outputPath);
  console.log(`✅ Generated ${filename}`);
});

// Update sitemap.xml
if (generatedUrls.length) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  let sitemap = fs.existsSync(sitemapPath)
    ? fs.readFileSync(sitemapPath, 'utf8')
    : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';

  const closingTag = '</urlset>';
  const urlsXml = generatedUrls.map(u => `  <url>\n    <loc>https://avtogost77.ru/${u}</loc>\n  </url>`).join('\n');

  sitemap = sitemap.replace(closingTag, `${urlsXml}\n${closingTag}`);
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('🗺️  sitemap.xml updated');
}

console.log(`🎉 Done. ${generatedUrls.length} pages generated.`);