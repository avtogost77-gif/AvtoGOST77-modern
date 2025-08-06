// Статическая база реальных автомобильных расстояний между городами России
// Источник: Яндекс.Карты, Google Maps, реальные замеры
// РАСШИРЕННАЯ ВЕРСИЯ: 1000км от Москвы + маркетплейс-локации

const REAL_DISTANCES = {
  // Москва как центральный хаб (РАСШИРЕННАЯ ВЕРСИЯ)
  "moskva": {
    // ЦЕНТРАЛЬНЫЙ ФО (до 300км)
    "tula": 180,          // М2 "Крым"
    "kaluga": 165,        // А101
    "ryazan": 196,        // М5 "Урал"
    "vladimir": 184,      // М7 "Волга"  
    "tver": 164,          // М10 "Россия"
    "yaroslavl": 264,     // М8 "Холмогоры"
    "kostroma": 344,      // М8 "Холмогоры"
    "ivanovo": 318,       // М7 "Волга"
    
    // ОБЛАСТНЫЕ ЦЕНТРЫ (300-600км)
    "voronezh": 463,      // М4 "Дон"
    "belgorod": 695,      // М2 "Крым"
    "kursk": 512,         // М2 "Крым"
    "orel": 368,          // М2 "Крым"
    "bryansk": 379,       // А141
    "smolensk": 378,      // М1 "Беларусь"
    "lipetsk": 444,       // М4 "Дон"
    "tambov": 460,        // М5 "Урал"
    
    // КРУПНЫЕ ГОРОДА (600-1000км)
    "spb": 635,           // М11 "Нева" - прямая скоростная
    "nizhniy-novgorod": 411, // М7 "Волга"
    "kazan": 719,         // М7 "Волга"  
    "samara": 840,        // М5 "Урал"
    "penza": 630,         // М5 "Урал"
    "saransk": 641,       // М5 "Урал"
    "cheboksary": 638,    // М7 "Волга"
    "ulyanovsk": 719,     // М5 "Урал"
    "saratov": 858,       // М5 "Урал"
    
    // СЕВЕРО-ЗАПАД (в пределах 1000км)
    "novgorod": 552,      // М10 "Россия"
    "pskov": 689,         // М9 "Балтия"
    "petrozavodsk": 925,  // М8 "Холмогоры"
    "vologda": 460,       // М8 "Холмогоры"
    
    // МАРКЕТПЛЕЙС-ЛОКАЦИИ И ФЦ
    "koledinovo": 25,     // Коледино WB - пригород Москвы
    "podolsk": 40,        // Подольск - южное направление
    "belye-stolby": 50,   // Белые Столбы WB - М4 "Дон"
    "elektrostal": 58,    // Электросталь - восточное направление
    "tver-ozon": 164,     // Тверь Ozon = обычная Тверь
    
    // ПРОМЫШЛЕННЫЕ ЦЕНТРЫ
    "tula-industrial": 180, // Тула промзона = обычная Тула
    
    // Существующие (сохраняем)
    "ekaterinburg": 1416, // М5 "Урал" + Р242
    "rostov": 1067,       // М4 "Дон" 
    "chelyabinsk": 1496,  // М5 "Урал"
    "ufa": 1166,          // М5 "Урал"
    "astrakhan": 1411,    // М6 "Каспий"
    "krasnodar": 1231,    // М4 "Дон"
    "sochi": 1620,        // М4 "Дон" + А147
    "stavropol": 1456,    // М4 "Дон"
    "makhachkala": 1784,  // М4 "Дон" + Р217
    "grozny": 1681,       // М4 "Дон" + Р217
    "nalchik": 1538,      // М4 "Дон" + А158
    "novosibirsk": 3303,  // М5 "Урал" + Р254
    "omsk": 2676,         // М5 "Урал" + Р254
    "krasnoyarsk": 3354,  // М5 "Урал" + Р255
    "irkutsk": 5042,      // М5 "Урал" + Р255
    "khabarovsk": 8533,   // М5 "Урал" + Р258
    "vladivostok": 9074,  // М5 "Урал" + Р258
    "tomsk": 3506,        // М5 "Урал" + Р255
    "kemerovo": 3607,     // М5 "Урал" + А384
    "novokuznetsk": 3665, // М5 "Урал" + А384
    "barnaul": 3419,      // М5 "Урал" + Р256
    "chita": 6074,        // М5 "Урал" + Р258
    "yakutsk": 8468,      // М5 "Урал" + Р504
    "magadan": 10726,     // М5 "Урал" + Р504
    "petropavlovsk-kamchatsky": 11910, // М5 + авиа + автодороги
    "yuzhno-sakhalinsk": 10417, // М5 + паром + автодороги
    "tyumen": 1766,       // М5 "Урал"
    "surgut": 2148,       // М5 "Урал" + Р404
    "kurgan": 1943        // М5 "Урал"
  },

  // САНКТ-ПЕТЕРБУРГ как второй хаб
  "spb": {
    "moskva": 635,        // М11 "Нева"
    "tver": 485,          // М10 "Россия"
    "novgorod": 180,      // М10 "Россия"
    "pskov": 280,         // А212
    "petrozavodsk": 412,  // А121
    "vologda": 662,       // А114
    "yaroslavl": 897,     // М8 через Вологду
    "smolensk": 664,      // М1 через Москву
    "kaluga": 800,        // через Москву
    "tula": 815          // через Москву
  },

  // ЦЕНТРАЛЬНЫЙ ФО - взаимные связи
  "tula": {
    "moskva": 180,
    "kaluga": 150,        // Р132
    "ryazan": 240,        // Р22
    "orel": 180,          // М2 "Крым"
    "lipetsk": 280,       // Р22
    "voronezh": 350,      // через Липецк
    "kursk": 330,         // М2 "Крым"
    "bryansk": 280        // А141
  },

  "kaluga": {
    "moskva": 165,
    "tula": 150,
    "bryansk": 220,       // А141
    "smolensk": 280,      // Р101
    "spb": 800,           // через Москву
    "tver": 320          // через Москву
  },

  "ryazan": {
    "moskva": 196,
    "tula": 240,
    "vladimir": 120,      // Р25
    "tambov": 280,        // Р22
    "voronezh": 370,      // через Тамбов
    "lipetsk": 320,       // Р22
    "nizhniy-novgorod": 320 // через Владимир
  },

  "vladimir": {
    "moskva": 184,
    "ryazan": 120,
    "yaroslavl": 250,     // А113
    "nizhniy-novgorod": 230, // М7 "Волга"
    "kostroma": 280,      // через Ярославль
    "ivanovo": 120,       // А113
    "cheboksary": 380,    // через Н.Новгород
    "elektrostal": 80     // близко к Москве
  },

  "tver": {
    "moskva": 164,
    "spb": 485,
    "yaroslavl": 280,     // Р84
    "smolensk": 320,      // А141
    "novgorod": 350,      // М10
    "pskov": 520,         // через Новгород
    "vologda": 450,       // через Ярославль
    "tver-ozon": 0        // это одно и то же место
  },

  "yaroslavl": {
    "moskva": 264,
    "vladimir": 250,
    "kostroma": 85,       // А113
    "ivanovo": 110,       // А113
    "tver": 280,
    "vologda": 220,       // Р104
    "nizhniy-novgorod": 340, // через Кострому
    "spb": 897           // через Вологду
  },

  // ПОВОЛЖЬЕ
  "nizhniy-novgorod": {
    "moskva": 411,
    "vladimir": 230,
    "kostroma": 260,
    "kazan": 380,         // М7 "Волга"
    "cheboksary": 230,    // М7 "Волга"
    "saransk": 190,       // Р158
    "ryazan": 320,
    "yaroslavl": 340
  },

  "kazan": {
    "moskva": 719,
    "nizhniy-novgorod": 380,
    "cheboksary": 150,    // М7 "Волга"
    "ulyanovsk": 220,     // М7 "Волга"
    "samara": 360,        // М7 "Волга"
    "penza": 380,         // через Ульяновск
    "ekaterinburg": 730,  // Р239
    "ufa": 525           // Р239
  },

  "samara": {
    "moskva": 840,
    "kazan": 360,
    "ulyanovsk": 160,     // М5 "Урал"
    "saratov": 442,       // М5 "Урал"
    "penza": 330,         // М5 "Урал"
    "orenburg": 280,      // М5 "Урал"
    "ufa": 300,          // М5 "Урал"
    "volgograd": 648      // М6 "Каспий"
  },

  // ЧЕРНОЗЕМЬЕ
  "voronezh": {
    "moskva": 463,
    "tula": 350,
    "lipetsk": 120,       // М4 "Дон"
    "tambov": 140,        // Р22
    "kursk": 180,         // М2 "Крым"
    "belgorod": 280,      // М2 "Крым"
    "rostov": 580,        // М4 "Дон"
    "saratov": 420       // через Тамбов
  },

  "belgorod": {
    "moskva": 695,
    "voronezh": 280,
    "kursk": 150,         // М2 "Крым"
    "rostov": 450,        // М4 "Дон"
    "kharkov": 80        // международная трасса
  },

  // МАРКЕТПЛЕЙС-ЛОКАЦИИ (детально)
  "koledinovo": {
    "moskva": 25,         // пригород Москвы
    "podolsk": 20,        // рядом
    "belye-stolby": 30,   // соседние ФЦ
    "tula": 160,          // близко к М2
    "kaluga": 140,        // через Москву
    "ryazan": 180        // через Москву
  },

  "podolsk": {
    "moskva": 40,
    "koledinovo": 20,
    "belye-stolby": 15,   // очень близко
    "tula": 140,          // прямо по М2
    "kaluga": 120,        // через Москву
    "elektrostal": 80     // через Москву
  },

  "belye-stolby": {
    "moskva": 50,
    "podolsk": 15,
    "koledinovo": 30,
    "tula": 130,          // прямо по М4
    "voronezh": 420,      // прямо по М4
    "rostov": 1020       // прямо по М4
  },

  "elektrostal": {
    "moskva": 58,
    "vladimir": 80,       // близко
    "ryazan": 140,        // через Владимир
    "yaroslavl": 200,     // через Москву
    "ivanovo": 180       // через Владимир
  },

  // СЕВЕРО-ЗАПАД
  "novgorod": {
    "moskva": 552,
    "spb": 180,
    "tver": 350,
    "pskov": 240,         // А116
    "petrozavodsk": 580,  // через СПб
    "vologda": 620       // через СПб
  },

  "pskov": {
    "moskva": 689,
    "spb": 280,
    "novgorod": 240,
    "smolensk": 380,      // А141
    "tver": 520,         // через Новгород
    "riga": 250          // международная
  },

  // ПРОМЫШЛЕННЫЕ ЦЕНТРЫ
  "lipetsk": {
    "moskva": 444,
    "voronezh": 120,
    "tula": 280,
    "tambov": 180,        // Р22
    "ryazan": 320,        // Р22
    "kursk": 200,         // М4
    "belgorod": 350      // М4
  },

  "tambov": {
    "moskva": 460,
    "voronezh": 140,
    "lipetsk": 180,
    "ryazan": 280,
    "penza": 240,         // Р208
    "saratov": 280,       // Р22
    "samara": 500        // через Пензу
  }
};

function getRealDistance(fromCityCode, toCityCode) {
  // Прямое направление
  const fromCity = REAL_DISTANCES[fromCityCode];
  if (fromCity && fromCity[toCityCode]) {
    return fromCity[toCityCode];
  }
  
  // Обратное направление  
  const toCity = REAL_DISTANCES[toCityCode];
  if (toCity && toCity[fromCityCode]) {
    return toCity[fromCityCode];
  }
  
  return null;
}

// Экспортируем для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getRealDistance, REAL_DISTANCES };
}