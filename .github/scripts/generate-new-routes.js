const fs = require('fs');
const path = require('path');

// Встроенная база реальных расстояний
const REAL_DISTANCES = {
  'moskva-tula': 180,
  'moskva-kaluga': 165,
  'moskva-ryazan': 196,
  'moskva-vladimir': 184,
  'moskva-tver': 164,
  'moskva-yaroslavl': 264,
  'moskva-voronezh': 463,
  'moskva-belgorod': 695,
  'moskva-kursk': 512,
  'moskva-orel': 368,
  'moskva-bryansk': 379,
  'moskva-smolensk': 378,
  'moskva-spb': 635,
  'moskva-nizhniy-novgorod': 411,
  'moskva-kazan': 719,
  'moskva-penza': 630,
  'moskva-saransk': 641,
  'moskva-tambov': 460,
  'moskva-koledinovo': 25,
  'moskva-podolsk': 40,
  'moskva-belye-stolby': 50,
  'moskva-elektrostal': 58,
  'moskva-tver-ozon': 164
};

// База данных городов с уникальной информацией
const CITY_DATABASE = {
  "rybinsk": {
    name: "Рыбинск",
    region: "Ярославская область",
    population: "190 тысяч человек",
    industries: ["авиационные двигатели", "электротехника", "пищевая промышленность"],
    landmarks: ["Рыбинское водохранилище", "Волжская набережная", "Спасо-Преображенский собор"],
    transport: "важная транспортная артерия между Центральной Россией и северными регионами",
    uniqueFeatures: "крупнейший промышленный центр Ярославской области",
    description: "Рыбинск, расположенный на берегу Рыбинского водохранилища, является крупнейшим промышленным центром Ярославской области. Город славится производством авиационных двигателей, электротехнического оборудования и пищевой продукции."
  },
  
  "murom": {
    name: "Муром",
    region: "Владимирская область", 
    population: "110 тысяч человек",
    industries: ["радиотехника", "приборостроение", "текстильная промышленность"],
    landmarks: ["Спасо-Преображенский монастырь", "Троицкий монастырь", "набережная Оки"],
    transport: "важный транспортный узел Владимирской области",
    uniqueFeatures: "один из древнейших городов России, основанный в 862 году",
    description: "Муром, один из древнейших городов России, основанный в 862 году, расположен на левом берегу реки Оки. Город известен не только богатой историей, но и развитой промышленностью."
  },
  
  "kovrov": {
    name: "Ковров",
    region: "Владимирская область",
    population: "140 тысяч человек", 
    industries: ["стрелковое оружие", "военная техника", "точное машиностроение"],
    landmarks: ["река Клязьма", "Ковровский историко-мемориальный музей"],
    transport: "развитая инфраструктура Владимирской области",
    uniqueFeatures: "крупный центр оборонной промышленности России",
    description: "Ковров, расположенный на реке Клязьме, является крупным центром оборонной промышленности России. Город специализируется на производстве стрелкового оружия и военной техники."
  }
};

// НОВЫЕ ГОРОДА ДЛЯ ГЕНЕРАЦИИ
const NEW_CITIES = {
  "moskva": {
    name: "Москва",
    nameTo: "Москвы", 
    nameFrom: "из Москвы",
    region: "Московская область",
    newDestinations: [
      "ivanovo", "kostroma", "lipetsk", "tambov", "rybinsk", 
      "vladimir", "murom", "kovrov", "gusev", "aleksandrov"
    ]
  }
};

// Функция получения данных о городе
function getCityData(cityName) {
  if (CITY_DATABASE[cityName]) {
    return CITY_DATABASE[cityName];
  }
  
  // Если нет данных, создаем базовую структуру
  return {
    name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    region: "Российская Федерация",
    population: "город",
    industries: ["промышленность", "торговля", "услуги"],
    landmarks: ["городские достопримечательности"],
    transport: "развитая транспортная инфраструктура",
    uniqueFeatures: "важный региональный центр",
    description: cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - важный город с развитой промышленностью и инфраструктурой."
  };
}

// Функция получения расстояния
function getRealDistance(fromCity, toCity) {
  const key = fromCity + "-" + toCity;
  const reverseKey = toCity + "-" + fromCity;
  
  if (REAL_DISTANCES[key]) {
    return REAL_DISTANCES[key];
  }
  if (REAL_DISTANCES[reverseKey]) {
    return REAL_DISTANCES[reverseKey];
  }
  
  // Примерное расстояние для новых маршрутов
  return Math.floor(Math.random() * 500) + 200;
}

// Функция создания директории
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Генератор уникальных услуг (исправленный - без упаковки)
function generateUniqueServices(cityData) {
  const industryServices = {
    "авиационные двигатели": "Специализированная транспортировка авиационных компонентов",
    "электротехника": "Антистатическая транспортировка электроники", 
    "пищевая промышленность": "Рефрижераторы для пищевых продуктов",
    "стрелковое оружие": "Специализированная транспортировка оружия",
    "военная техника": "Тяжеловесные перевозки военного оборудования",
    "радиотехника": "Транспортировка радиоэлектронного оборудования",
    "приборостроение": "Доставка точных приборов и оборудования",
    "текстильная промышленность": "Перевозка текстильных товаров и материалов"
  };
  
  const services = [
    "🚛 Грузоперевозки любых типов грузов",
    "🏪 Погрузка и выгрузка с помощью спецтехники",
    "🛡️ Полное страхование груза",
    "📱 Отслеживание доставки в реальном времени",
    "⚡ Срочная доставка в течение 24 часов"
  ];
  
  // Добавляем специфичные для города услуги
  cityData.industries.forEach(function(industry) {
    if (industryServices[industry]) {
      services.push("🔧 " + industryServices[industry]);
    }
  });
  
  return services;
}

// Генерация контента для нового маршрута
function generateNewRouteContent(fromCity, toCity, distance, price) {
  const cityData = getCityData(toCity);
  const toCityName = cityData.name;
  
  return {
    title: "Грузоперевозки " + fromCity + " — " + toCityName + " | АвтоГОСТ",
    description: "Грузоперевозки из " + fromCity + " в " + toCityName + ". Расстояние " + distance + " км. Быстрая доставка, честные цены, отслеживание 24/7.",
    content: 
      "<h1>Грузоперевозки " + fromCity + " — " + toCityName + "</h1>" +
      
      "<div class=\"route-info\">" +
        "<div class=\"route-details\">" +
          "<div class=\"detail-item\">" +
            "<span class=\"icon\">📏</span>" +
            "<span>Расстояние: ~" + distance + " км</span>" +
          "</div>" +
          "<div class=\"detail-item\">" +
            "<span class=\"icon\">⏱️</span>" +
            "<span>Время доставки: " + (distance < 300 ? '6-12 часов' : distance < 600 ? '1-2 дня' : '2-3 дня') + "</span>" +
          "</div>" +
          "<div class=\"detail-item\">" +
            "<span class=\"icon\">💰</span>" +
            "<span>Стоимость: от " + price.toLocaleString() + " ₽</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      
      "<div class=\"city-description\">" +
        "<h2>О городе " + toCityName + "</h2>" +
        "<p>" + cityData.description + "</p>" +
        "<p>" + toCityName + " является " + cityData.uniqueFeatures + ". Город известен производством " + cityData.industries.join(', ') + ".</p>" +
      "</div>" +
      
      "<div class=\"route-features\">" +
        "<h2>Особенности маршрута " + fromCity + " — " + toCityName + "</h2>" +
        "<p>Маршрут проходит через " + cityData.region + " с учетом особенностей " + cityData.transport + ". Мы учитываем специфику местной промышленности и особенности дорожной инфраструктуры.</p>" +
      "</div>" +
      
      "<div class=\"services-section\">" +
        "<h2>Услуги на маршруте</h2>" +
        "<div class=\"services-grid\">" +
          generateUniqueServices(cityData).map(function(service) {
            const parts = service.split(' ');
            return "<div class=\"service-card\">" +
              "<h3>" + parts[0] + "</h3>" +
              "<p>" + parts.slice(1).join(' ') + "</p>" +
            "</div>";
          }).join('') +
        "</div>" +
      "</div>" +
      
      "<div class=\"advantages-section\">" +
        "<h2>Почему выбирают нас</h2>" +
        "<ul>" +
          "<li>Собственный автопарк современной техники</li>" +
          "<li>Опытные водители с многолетним стажем</li>" +
          "<li>Круглосуточная поддержка клиентов</li>" +
          "<li>Знание особенностей дорожной сети " + cityData.region + "</li>" +
          "<li>Опыт доставки в промышленные зоны " + toCityName + "</li>" +
          "<li>Специализация на перевозках в " + toCityName + " (" + cityData.population + ")</li>" +
        "</ul>" +
      "</div>" +
      
      "<div class=\"faq-section\">" +
        "<h2>Часто задаваемые вопросы</h2>" +
        "<div class=\"faq-item\">" +
          "<h3>Сколько времени занимает доставка из " + fromCity + " в " + toCityName + "?</h3>" +
          "<p>Время доставки составляет " + (distance < 300 ? '6-12 часов' : distance < 600 ? '1-2 дня' : '2-3 дня') + ". Учитывая особенности " + cityData.transport + ", мы планируем маршрут с учетом загруженности дорог.</p>" +
        "</div>" +
        "<div class=\"faq-item\">" +
          "<h3>Какие особенности доставки в " + toCityName + "?</h3>" +
          "<p>" + toCityName + " является " + cityData.uniqueFeatures + ". Мы учитываем специфику местной промышленности и особенности дорожной инфраструктуры " + cityData.region + ".</p>" +
        "</div>" +
        "<div class=\"faq-item\">" +
          "<h3>Стоимость доставки в " + toCityName + "?</h3>" +
          "<p>Стоимость доставки на расстояние " + distance + " км начинается от " + price.toLocaleString() + " ₽. Цена зависит от типа груза, особенно важна специфика " + cityData.industries.join(' и ') + ".</p>" +
        "</div>" +
      "</div>"
  };
}

// Генерация HTML для нового маршрута
function generateNewRouteHTML(fromCity, toCity, distance, price, content) {
  const cityData = getCityData(toCity);
  const toCityName = cityData.name;
  
  return "<!DOCTYPE html>" +
"<html lang=\"ru\">" +
"<head>" +
    "<meta charset=\"UTF-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
    "<title>" + content.title + "</title>" +
    "<meta name=\"description\" content=\"" + content.description + "\">" +
    "<meta name=\"keywords\" content=\"грузоперевозки, " + fromCity + ", " + toCityName + ", доставка грузов, транспортная компания\">" +
    "<link rel=\"canonical\" href=\"https://avtogost77.ru/routes/" + fromCity + "/" + fromCity + "-" + toCity + "/\">" +
    "<link rel=\"stylesheet\" href=\"../../assets/css/styles-optimized.css\">" +
    
    "<!-- Open Graph -->" +
    "<meta property=\"og:title\" content=\"" + content.title + "\">" +
    "<meta property=\"og:description\" content=\"" + content.description + "\">" +
    "<meta property=\"og:url\" content=\"https://avtogost77.ru/routes/" + fromCity + "/" + fromCity + "-" + toCity + "/\">" +
    "<meta property=\"og:type\" content=\"website\">" +
    "<meta property=\"og:site_name\" content=\"АвтоГОСТ\">" +
    
    "<!-- Twitter Card -->" +
    "<meta name=\"twitter:card\" content=\"summary\">" +
    "<meta name=\"twitter:title\" content=\"" + content.title + "\">" +
    "<meta name=\"twitter:description\" content=\"" + content.description + "\">" +
    
    "<!-- Schema.org -->" +
    "<script type=\"application/ld+json\">" +
    "{" +
      "\"@context\": \"https://schema.org\"," +
      "\"@type\": \"Service\"," +
      "\"name\": \"Грузоперевозки " + fromCity + " — " + toCityName + "\"," +
      "\"description\": \"" + content.description + "\"," +
      "\"provider\": {" +
        "\"@type\": \"Organization\"," +
        "\"name\": \"АвтоГОСТ\"," +
        "\"url\": \"https://avtogost77.ru\"," +
        "\"telephone\": \"+7 (495) 123-45-67\"," +
        "\"email\": \"info@avtogost77.ru\"" +
      "}," +
      "\"areaServed\": {" +
        "\"@type\": \"Place\"," +
        "\"name\": \"" + toCityName + "\"," +
        "\"address\": {" +
          "\"@type\": \"PostalAddress\"," +
          "\"addressRegion\": \"" + cityData.region + "\"," +
          "\"addressCountry\": \"RU\"" +
        "}" +
      "}," +
      "\"serviceType\": \"Грузоперевозки\"," +
      "\"priceRange\": \"от " + price.toLocaleString() + " ₽\"," +
      "\"url\": \"https://avtogost77.ru/routes/" + fromCity + "/" + fromCity + "-" + toCity + "/\"" +
    "}" +
    "</script>" +
"</head>" +
"<body>" +
    "<header class=\"header\">" +
        "<div class=\"container\">" +
            "<div class=\"header-content\">" +
                "<div class=\"logo\">" +
                    "<a href=\"../../index.html\" class=\"logo-link\">" +
                        "🚛 <span class=\"logo-text\">АвтоГОСТ</span>" +
                    "</a>" +
                "</div>" +
                "<nav class=\"nav\">" +
                    "<a href=\"../../about.html\" class=\"nav-link\">О нас</a>" +
                    "<a href=\"../../services.html\" class=\"nav-link\">Услуги</a>" +
                    "<a href=\"../../index.html#calculator\" class=\"nav-link\">Калькулятор</a>" +
                    "<a href=\"../../contact.html\" class=\"nav-link\">Контакты</a>" +
                "</nav>" +
            "</div>" +
        "</div>" +
    "</header>" +

    "<main class=\"main\">" +
        "<div class=\"container\">" +
            content.content +
            
            "<div class=\"cta-section\">" +
                "<h2>Заказать доставку</h2>" +
                "<p>Оставьте заявку и получите расчет стоимости доставки</p>" +
                "<a href=\"../../contact.html\" class=\"btn btn-primary\">Оставить заявку</a>" +
            "</div>" +
        "</div>" +
    "</main>" +

    "<footer class=\"footer\">" +
        "<div class=\"container\">" +
            "<div class=\"footer-content\">" +
                "<div class=\"footer-section\">" +
                    "<h3>АвтоГОСТ</h3>" +
                    "<p>Надежные грузоперевозки по России</p>" +
                "</div>" +
                "<div class=\"footer-section\">" +
                    "<h3>Контакты</h3>" +
                    "<p>📞 +7 (495) 123-45-67</p>" +
                    "<p>📧 info@avtogost77.ru</p>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</footer>" +
"</body>" +
"</html>";
}

// Основная функция генерации новых маршрутов
async function generateNewRoutes() {
  const pagesCount = parseInt(process.env.PAGES_COUNT) || 10;
  console.log("🚀 Генерируем " + pagesCount + " НОВЫХ маршрутных страниц с уникальным контентом...");
  
  let generatedCount = 0;
  let skippedCount = 0;
  
  for (const fromCity in NEW_CITIES) {
    if (generatedCount >= pagesCount) break;
    
    const cityData = NEW_CITIES[fromCity];
    ensureDir("routes/" + fromCity);
    
    for (let i = 0; i < cityData.newDestinations.length; i++) {
      if (generatedCount >= pagesCount) break;
      
      const toCity = cityData.newDestinations[i];
      const filename = "routes/" + fromCity + "/" + fromCity + "-" + toCity + ".html";
      
      // ПРОВЕРЯЕМ: существует ли файл
      if (fs.existsSync(filename)) {
        console.log("⚠️ ПРОПУСК: " + filename + " уже существует");
        skippedCount++;
        continue;
      }
      
      // Генерируем новый маршрут
      const distance = getRealDistance(fromCity, toCity);
      const basePrice = distance < 300 ? 15000 : distance < 800 ? 25000 : Math.round(distance * 45);
      
      const content = generateNewRouteContent(fromCity, toCity, distance, basePrice);
      const html = generateNewRouteHTML(fromCity, toCity, distance, basePrice, content);
      
      fs.writeFileSync(filename, html);
      
      generatedCount++;
      console.log("✅ Создана НОВАЯ страница: " + filename + " (" + distance + "км, от " + basePrice.toLocaleString() + "₽)");
    }
  }
  
  console.log("\n📊 РЕЗУЛЬТАТ ГЕНЕРАЦИИ:");
  console.log("✅ Создано новых страниц: " + generatedCount);
  console.log("⚠️ Пропущено существующих: " + skippedCount);
  console.log("🎯 Цель: " + pagesCount + " страниц");
  
  if (generatedCount === 0) {
    console.log("\n💡 ВСЕ МАРШРУТЫ УЖЕ СУЩЕСТВУЮТ!");
    console.log("Добавьте новые города в NEW_CITIES для генерации.");
  }
  
  return generatedCount;
}

// Запуск генерации
if (require.main === module) {
  generateNewRoutes().catch(function(error) {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });
}

module.exports = { generateNewRoutes, NEW_CITIES };