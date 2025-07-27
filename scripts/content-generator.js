const fs = require('fs');
const path = require('path');

// База расстояний между городами
const DISTANCES = {
  'Москва-Санкт-Петербург': { km: 700, hours: '10-12 часов' },
  'Москва-Екатеринбург': { km: 1800, hours: '24-30 часов' },
  'Москва-Новосибирск': { km: 3300, hours: '2-3 дня' },
  'Москва-Казань': { km: 800, hours: '12-14 часов' },
  'Москва-Нижний Новгород': { km: 420, hours: '6-8 часов' },
  'Москва-Самара': { km: 1050, hours: '14-16 часов' },
  'Москва-Краснодар': { km: 1350, hours: '18-22 часа' },
  'Москва-Пермь': { km: 1400, hours: '20-24 часа' },
  'Москва-Уфа': { km: 1350, hours: '18-22 часа' },
  'Москва-Ростов-на-Дону': { km: 1100, hours: '14-18 часов' },
  'Москва-Челябинск': { km: 1750, hours: '24-28 часов' },
  'Москва-Омск': { km: 2700, hours: '2-3 дня' },
  'Москва-Тюмень': { km: 2100, hours: '28-32 часа' },
  'Москва-Иркутск': { km: 5200, hours: '4-5 дней' },
  'Москва-Владивосток': { km: 9300, hours: '7-9 дней' },
  'Санкт-Петербург-Екатеринбург': { km: 2300, hours: '30-36 часов' },
  'Санкт-Петербург-Новосибирск': { km: 3800, hours: '3-4 дня' },
  // Добавим остальные по мере необходимости
};

// Популярные грузы по типам транспорта
const CARGO_TYPES = {
  'sbornye-gruzy': [
    'Товары для маркетплейсов',
    'Промышленное оборудование',
    'Строительные материалы',
    'Продукты питания (сухие)',
    'Бытовая техника',
    'Мебель и интерьер',
    'Автозапчасти',
    'Текстиль и одежда'
  ],
  'gazelle': [
    'Документы и образцы',
    'Легкие грузы до 2 тонн',
    'Хрупкие товары',
    'Срочные посылки',
    'Товары интернет-магазинов',
    'Медикаменты',
    'Электроника',
    'Цветы и растения'
  ],
  'fura': [
    'Крупные партии товаров',
    'Промышленные грузы',
    'Строительные материалы',
    'Сельхозпродукция',
    'Металлоизделия',
    'Химическая продукция',
    'Оборудование',
    'Контейнерные грузы'
  ]
};

// Особенности маршрутов
const ROUTE_FEATURES = {
  'Москва-Санкт-Петербург': 'Федеральная трасса М-11 «Нева». Платные участки для экономии времени. Круглосуточное движение.',
  'Москва-Екатеринбург': 'Трасса М-7 «Волга» через Нижний Новгород и Казань. Возможны сезонные ограничения.',
  'Москва-Новосибирск': 'Транссибирская магистраль. Обязательные остановки для отдыха водителей.',
  'Москва-Казань': 'М-7 «Волга». Интенсивное движение, требуется опытный водитель.',
  'Москва-Краснодар': 'М-4 «Дон». Летом высокая загрузка из-за туристов. Альтернативные маршруты.',
  'Москва-Владивостok': 'Самый длинный маршрут. Смена водителей обязательна. Специальные условия.',
  // default
  'default': 'Федеральная трасса. Опытные водители. GPS-мониторинг на всем маршруте.'
};

// Преимущества (рандомизация)
const ADVANTAGES = [
  {
    title: 'Прямые договоры',
    text: 'Работаем напрямую с проверенными перевозчиками. Без посредников и скрытых комиссий.'
  },
  {
    title: 'Гарантия сроков',
    text: 'Доставка точно в срок или компенсация. Отслеживание груза 24/7.'
  },
  {
    title: 'Все включено',
    text: 'Цена «от двери до двери». Никаких доплат за погрузку, оформление, экспедирование.'
  },
  {
    title: 'Личный менеджер',
    text: 'Один специалист ведет ваш груз от заявки до доставки. Всегда на связи.'
  },
  {
    title: 'Страхование груза',
    text: 'Полная материальная ответственность. Все грузы застрахованы.'
  },
  {
    title: 'Гибкие условия',
    text: 'Отсрочка платежа для постоянных клиентов. Работаем с НДС и без.'
  }
];

// FAQ шаблоны
const FAQ_TEMPLATES = {
  'sbornye-gruzy': [
    {
      question: 'Какой минимальный объем для сборного груза?',
      answer: 'Принимаем грузы от 1 м³ или от 100 кг. Это может быть даже одна коробка — мы найдем попутный транспорт.'
    },
    {
      question: 'Как рассчитывается стоимость сборного груза?',
      answer: 'Стоимость зависит от объема, веса и расстояния. Мы берем большее значение из объемного или физического веса. Точный расчет — за 15 минут.'
    },
    {
      question: 'Сколько времени занимает доставка?',
      answer: 'Сроки зависят от маршрута. Обычно это {hours} с момента отправки. Сборные грузы могут идти на 1-2 дня дольше из-за консолидации.'
    }
  ],
  'gazelle': [
    {
      question: 'Какая грузоподъемность у Газели?',
      answer: 'Стандартная Газель берет до 2 тонн и до 16 м³. Есть удлиненные версии до 21 м³. Подберем оптимальный вариант под ваш груз.'
    },
    {
      question: 'Можно ли заказать Газель срочно?',
      answer: 'Да, подача машины от 2 часов в пределах города. Для междугородних — обычно в день заказа.'
    }
  ],
  'fura': [
    {
      question: 'Какие типы фур доступны?',
      answer: 'Тент, рефрижератор, изотерм. Еврофуры 82-96 м³. Сцепки до 120 м³. Подберем под ваш груз.'
    },
    {
      question: 'Есть ли ограничения по весу?',
      answer: 'Стандартная фура — до 20 тонн. Для негабарита оформляем спецразрешения.'
    }
  ]
};

// CTA варианты
const CTA_VARIANTS = [
  {
    title: 'Получите расчет за 15 минут',
    subtitle: 'Оставьте заявку и мы перезвоним с готовым предложением'
  },
  {
    title: 'Нужна доставка {service_genitive}?',
    subtitle: 'Организуем перевозку уже сегодня. Звоните!'
  },
  {
    title: 'Закажите {service} прямо сейчас',
    subtitle: 'Лучшие условия для маршрута {from_city} — {to_city}'
  }
];

// Функция генерации контента для маршрута
function generateRouteContent(route) {
  const routeKey = `${route.from_city}-${route.to_city}`;
  const distance = DISTANCES[routeKey] || DISTANCES[`${route.to_city}-${route.from_city}`] || { km: 1000, hours: '24 часа' };
  
  // Случайный выбор преимуществ
  const shuffled = ADVANTAGES.sort(() => 0.5 - Math.random());
  const selectedAdvantages = shuffled.slice(0, 3);
  
  // FAQ для типа транспорта
  const faqs = FAQ_TEMPLATES[route.service] || FAQ_TEMPLATES['sbornye-gruzy'];
  const routeFaq = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer.replace('{hours}', distance.hours)
  }));
  
  // CTA
  const cta = CTA_VARIANTS[Math.floor(Math.random() * CTA_VARIANTS.length)];
  
  // Особенности маршрута
  const routeFeature = ROUTE_FEATURES[routeKey] || ROUTE_FEATURES['default'];
  
  // Популярные грузы
  const cargoTypes = CARGO_TYPES[route.service] || CARGO_TYPES['sbornye-gruzy'];
  
  // Склонения
  const serviceGenitive = {
    'sbornye-gruzy': 'сборных грузов',
    'gazelle': 'Газели',
    'fura': 'фуры',
    '5-tonnik': '5-тонника',
    '10-tonnik': '10-тонника'
  }[route.service] || route.service;
  
  const servicePrepositional = {
    'sbornye-gruzy': 'сборных грузах',
    'gazelle': 'доставке Газелью',
    'fura': 'перевозке фурой',
    '5-tonnik': 'перевозке 5-тонником',
    '10-tonnik': 'перевозке 10-тонником'
  }[route.service] || route.service;
  
  // Ценовое преимущество
  const priceBenefit = route.modifier === 'nedorogo' 
    ? 'Лучшая цена' 
    : route.modifier === 'srochno' 
    ? 'Срочная подача' 
    : 'Фиксированная цена';
  
  // Время доставки
  const deliveryTime = route.modifier === 'srochno'
    ? `${distance.hours} (экспресс)`
    : distance.hours;
    
  return {
    // Основные данные из route
    ...route,
    
    // Сгенерированный контент
    route_distance: distance.km,
    route_time: distance.hours,
    route_description: `Доставка ${serviceGenitive} по маршруту ${route.from_city} — ${route.to_city} осуществляется по федеральной трассе. Общее расстояние ${distance.km} км преодолевается за ${distance.hours} с учетом обязательных остановок.`,
    
    popular_cargo: cargoTypes.slice(0, 5),
    route_features: routeFeature,
    
    advantage_1_title: selectedAdvantages[0].title,
    advantage_1_text: selectedAdvantages[0].text,
    advantage_2_title: selectedAdvantages[1].title,
    advantage_2_text: selectedAdvantages[1].text,
    advantage_3_title: selectedAdvantages[2].title,
    advantage_3_text: selectedAdvantages[2].text,
    
    service_genitive: serviceGenitive,
    service_prepositional: servicePrepositional,
    
    route_faq: routeFaq,
    
    cta_title: cta.title.replace('{service_genitive}', serviceGenitive).replace('{service}', route.service_ru).replace('{from_city}', route.from_city).replace('{to_city}', route.to_city),
    cta_subtitle: cta.subtitle.replace('{from_city}', route.from_city).replace('{to_city}', route.to_city),
    
    price_benefit: priceBenefit,
    delivery_time: deliveryTime,
    
    // Похожие маршруты (генерируются отдельно)
    related_routes: []
  };
}

module.exports = { generateRouteContent };