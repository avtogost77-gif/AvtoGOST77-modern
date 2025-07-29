#!/usr/bin/env node
/**
 * 🚀 ГЕНЕРАТОР СТРАНИЦ МАРШРУТОВ
 * Генерирует все страницы маршрутов из шаблона
 * Запускается локально перед деплоем
 */

const fs = require('fs').promises;
const path = require('path');

// Конфигурация
const CONFIG = {
  // Основные города для генерации
  cities: [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
    'Нижний-Новгород', 'Казань', 'Челябинск', 'Омск', 'Самара',
    'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь',
    'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти',
    'Ижевск', 'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск',
    'Ярославль', 'Владивосток', 'Махачкала', 'Томск', 'Оренбург'
  ],
  
  // Модификаторы
  modifiers: ['недорого', 'срочно'],
  
  // Пути
  templatePath: path.join(__dirname, '../templates/route-template.html'),
  outputDir: path.join(__dirname, '../'),
  
  // Опции генерации
  generateBothDirections: true,  // Генерировать А-Б и Б-А
  skipSameCity: true,            // Пропускать маршруты типа Москва-Москва
};

// Статистика
let stats = {
  generated: 0,
  skipped: 0,
  errors: 0,
  startTime: Date.now()
};

/**
 * Транслитерация для URL
 */
function transliterate(text) {
  const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const en = 'abvgdeejziyklmnoprstufhcchhshh_y_eua';
  
  return text.toLowerCase()
    .split('')
    .map(char => {
      const index = ru.indexOf(char);
      return index >= 0 ? en[index] : char;
    })
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Генерация одной страницы
 */
async function generatePage(fromCity, toCity, modifier = '') {
  try {
    // Читаем шаблон
    let template = await fs.readFile(CONFIG.templatePath, 'utf8');
    
    // Формируем данные для замены
    const fromUrl = transliterate(fromCity);
    const toUrl = transliterate(toCity);
    const modifierUrl = modifier ? `-${modifier}` : '';
    const modifierText = modifier ? ` ${modifier}` : '';
    
    // Заменяем плейсхолдеры
    template = template
      .replace(/\{\{FROM_CITY\}\}/g, fromCity)
      .replace(/\{\{TO_CITY\}\}/g, toCity)
      .replace(/\{\{FROM_URL\}\}/g, fromUrl)
      .replace(/\{\{TO_URL\}\}/g, toUrl)
      .replace(/\{\{MODIFIER\}\}/g, modifierText)
      .replace(/\{\{MODIFIER_URL\}\}/g, modifierUrl)
      .replace(/\{\{TITLE_MODIFIER\}\}/g, modifier ? ` ${modifier}` : '')
      .replace(/\{\{H1_MODIFIER\}\}/g, modifier ? ` ${modifier.toUpperCase()}` : '')
      .replace(/\{\{META_MODIFIER\}\}/g, modifier || 'выгодно');
    
    // Формируем имя файла
    const filename = `${fromUrl}-${toUrl}${modifierUrl}.html`;
    const filepath = path.join(CONFIG.outputDir, filename);
    
    // Сохраняем файл
    await fs.writeFile(filepath, template, 'utf8');
    
    stats.generated++;
    if (stats.generated % 100 === 0) {
      console.log(`✅ Сгенерировано: ${stats.generated} страниц...`);
    }
    
    return filename;
    
  } catch (error) {
    console.error(`❌ Ошибка при генерации ${fromCity}-${toCity}:`, error.message);
    stats.errors++;
    return null;
  }
}

/**
 * Проверка существования шаблона
 */
async function checkTemplate() {
  try {
    await fs.access(CONFIG.templatePath);
    console.log('✅ Шаблон найден:', CONFIG.templatePath);
    return true;
  } catch {
    console.error('❌ Шаблон не найден! Создаю базовый шаблон...');
    await createDefaultTemplate();
    return true;
  }
}

/**
 * Создание базового шаблона
 */
async function createDefaultTemplate() {
  const template = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Грузоперевозки {{FROM_CITY}} - {{TO_CITY}}{{TITLE_MODIFIER}} | АвтоГОСТ</title>
    <meta name="description" content="Грузоперевозки из {{FROM_CITY}} в {{TO_CITY}}{{META_MODIFIER}}. ✅ Газель от 3000₽ ✅ Фура от 20000₽ ⏱ Доставка 1-2 дня 📞 +7 (916) 272-09-32">
    
    <!-- Стили -->
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <!-- Analytics -->
    <!--#include virtual="/includes/analytics.html" -->
</head>
<body>
    <!-- Header -->
    <!--#include virtual="/includes/header.html" -->
    
    <main>
        <section class="hero-route">
            <div class="container">
                <h1>Грузоперевозки {{FROM_CITY}} - {{TO_CITY}}{{H1_MODIFIER}}</h1>
                <p class="lead">Надежная доставка грузов по маршруту {{FROM_CITY}} - {{TO_CITY}}{{MODIFIER}}</p>
                
                <div class="cta-buttons">
                    <a href="#calculator" class="btn btn-primary">Рассчитать стоимость</a>
                    <a href="tel:+79162720932" class="btn btn-secondary">Позвонить</a>
                </div>
            </div>
        </section>
        
        <!-- Калькулятор -->
        <!--#include virtual="/includes/calculator.html" -->
        
        <!-- Преимущества -->
        <!--#include virtual="/includes/features.html" -->
        
        <!-- FAQ -->
        <!--#include virtual="/includes/faq.html" -->
    </main>
    
    <!-- Footer -->
    <!--#include virtual="/includes/footer.html" -->
    
    <!-- Scripts -->
    <script src="/assets/js/main.js"></script>
</body>
</html>`;

  // Создаем директорию templates если нет
  const templatesDir = path.dirname(CONFIG.templatePath);
  await fs.mkdir(templatesDir, { recursive: true });
  
  // Сохраняем шаблон
  await fs.writeFile(CONFIG.templatePath, template, 'utf8');
  console.log('✅ Базовый шаблон создан');
}

/**
 * Главная функция генерации
 */
async function generateAllRoutes() {
  console.log('🚀 ЗАПУСК ГЕНЕРАТОРА СТРАНИЦ МАРШРУТОВ\n');
  console.log(`📍 Города: ${CONFIG.cities.length}`);
  console.log(`🔄 Оба направления: ${CONFIG.generateBothDirections ? 'Да' : 'Нет'}`);
  console.log(`📝 Модификаторы: ${CONFIG.modifiers.join(', ')}\n`);
  
  // Проверяем шаблон
  if (!await checkTemplate()) {
    return;
  }
  
  // Генерируем все комбинации
  for (let i = 0; i < CONFIG.cities.length; i++) {
    for (let j = 0; j < CONFIG.cities.length; j++) {
      const fromCity = CONFIG.cities[i];
      const toCity = CONFIG.cities[j];
      
      // Пропускаем одинаковые города
      if (CONFIG.skipSameCity && i === j) {
        stats.skipped++;
        continue;
      }
      
      // Пропускаем обратное направление если не нужно
      if (!CONFIG.generateBothDirections && j < i) {
        stats.skipped++;
        continue;
      }
      
      // Базовая страница
      await generatePage(fromCity, toCity);
      
      // Страницы с модификаторами
      for (const modifier of CONFIG.modifiers) {
        await generatePage(fromCity, toCity, modifier);
      }
    }
  }
  
  // Выводим статистику
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  console.log('\n📊 СТАТИСТИКА:');
  console.log(`✅ Сгенерировано: ${stats.generated} страниц`);
  console.log(`⏭️ Пропущено: ${stats.skipped} комбинаций`);
  console.log(`❌ Ошибок: ${stats.errors}`);
  console.log(`⏱️ Время: ${duration} сек`);
  console.log(`💾 Размер: ~${(stats.generated * 10 / 1024).toFixed(1)} МБ`);
  
  console.log('\n✨ Генерация завершена!');
  console.log('📌 Теперь можно деплоить на хостинг');
}

// Запуск
if (require.main === module) {
  generateAllRoutes().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
}

module.exports = { generatePage, generateAllRoutes };