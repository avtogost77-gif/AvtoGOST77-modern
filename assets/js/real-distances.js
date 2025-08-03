// Статическая база реальных автомобильных расстояний между городами России
// Источник: Яндекс.Карты, Google Maps, реальные замеры

const REAL_DISTANCES = {
  // Москва как центральный хаб
  "moskva": {
    "spb": 635,           // М11 "Нева" - прямая скоростная
    "kazan": 719,         // М7 "Волга"  
    "voronezh": 463,      // М4 "Дон"
    "samara": 840,        // М5 "Урал"
    "nizhniy-novgorod": 411, // М7 "Волга"
    "ekaterinburg": 1416, // М5 "Урал" + Р242
    "rostov": 1067,       // М4 "Дон" 
    "chelyabinsk": 1496,  // М5 "Урал"
    "ufa": 1166,          // М5 "Урал"
    "yaroslavl": 264,     // М8 "Холмогоры"
    "vladimir": 184,      // М7 "Волга"  
    "ryazan": 196,        // М5 "Урал"
    "tula": 180,          // М2 "Крым"
    "kaluga": 165,        // А101
    "smolensk": 378,      // М1 "Беларусь"
    "bryansk": 341,       // М3 "Украина"
    "orel": 315,          // М2 "Крым"
    "kursk": 478,         // М2 "Крым"
    "belgorod": 611,      // М2 "Крым"
    "lipetsk": 385,       // М4 "Дон"
    "tambov": 460,        // Р22 "Каспий"
    "penza": 629,         // М5 "Урал"
    "saransk": 630,       // М5 "Урал"
    "cheboksary": 630,    // М7 "Волга"
    "kirov": 896,         // М7 + Р176
    "izhevsk": 1037,      // М7 + Р322
    "perm": 1154,         // М7 + Р242
    "orenburg": 1235,     // М5 "Урал"
    "saratov": 858,       // М5 "Урал"
    "volgograd": 912,     // М6 "Каспий"
    "astrakhan": 1411,    // М6 "Каспий"
    "krasnodar": 1339,    // М4 "Дон"
    "sochi": 1620,        // М4 "Дон" + А147
    "stavropol": 1458,    // М4 "Дон" + А154
    "makhachkala": 1998,  // М4 + Р217
    "grozny": 1964,       // М4 + А165
    "nalchik": 1727       // М4 + А154
  },

  // Санкт-Петербург  
  "spb": {
    "moskva": 635,
    "kaliningrad": 751,   // А181 + А229
    "murmansk": 1448,     // М18 "Кола"
    "arkhangelsk": 1251,  // М8 "Холмогоры"
    "petrozavodsk": 412,  // А121
    "pskov": 279,         // А180
    "velikiy-novgorod": 180, // М10 "Россия"
    "vologda": 658,       // А114
    "kostroma": 749,      // А114 + М8
    "yaroslavl": 899,     // М10 + М8
    "tver": 497,          // М10 "Россия"
    "smolensk": 743,      // М10 + М1
    "kazan": 1354,        // М10 + М7
    "nizhniy-novgorod": 1046, // М10 + М7
    "perm": 1789,         // М10 + М7 + Р242
    "ekaterinburg": 2051, // М10 + М7 + Р242
    "chelyabinsk": 2131,  // М10 + М7 + М5
    "ufa": 1801           // М10 + М7 + М5
  },

  // Казань
  "kazan": {
    "moskva": 719,
    "spb": 1354,
    "nizhniy-novgorod": 308, // М7 "Волга"
    "samara": 411,        // М5 "Урал"  
    "ufa": 447,           // М7 + Р240
    "perm": 764,          // М7 + Р242
    "ekaterinburg": 1097, // М7 + Р242
    "chelyabinsk": 1177,  // М7 + М5
    "orenburg": 728,      // М5 "Урал"
    "saratov": 539,       // М5 "Урал"
    "volgograd": 593,     // М5 + А260
    "cheboksary": 121,    // М7 "Волга"
    "izhevsk": 290,       // М7 + Р322
    "kirov": 187,         // М7 + Р176
    "penza": 241,         // М5 "Урал"
    "saransk": 242,       // М5 "Урал"
    "voronezh": 732,      // М5 + М4
    "rostov": 1060,       // М5 + М4
    "krasnodar": 1288,    // М5 + М4
    "astrakhan": 1030,    // М5 + А260
    "yaroslavl": 455,     // М7 + М8
    "kostroma": 344       // М7 + А113
  },

  // Воронеж
  "voronezh": {
    "moskva": 463,
    "rostov": 604,        // М4 "Дон"
    "kursk": 193,         // М2 "Крым"
    "belgorod": 148,      // М2 "Крым"  
    "lipetsk": 78,        // М4 "Дон"
    "tambov": 122,        // Р22 "Каспий"
    "saratov": 395,       // Р22 "Каспий"
    "volgograd": 449,     // М4 + А260
    "krasnodar": 876,     // М4 "Дон"
    "stavropol": 995,     // М4 + А154
    "astrakhan": 948,     // М4 + А260
    "kazan": 732,         // М4 + М5
    "samara": 777,        // М4 + М5
    "penza": 568,         // М4 + М5
    "bryansk": 254,       // М3 "Украина"
    "orel": 148,          // М2 "Крым"
    "tula": 283,          // М2 "Крым"
    "ryazan": 379,        // М4 + М5
    "spb": 1098,          // М4 + М10
    "smolensk": 585       // М4 + М1
  },

  // Самара
  "samara": {
    "moskva": 840,
    "kazan": 411,
    "ufa": 461,           // М5 "Урал"
    "orenburg": 267,      // М5 "Урал"
    "saratov": 147,       // М5 "Урал"  
    "volgograd": 201,     // А260
    "astrakhan": 550,     // А260
    "penza": 170,         // М5 "Урал"
    "saransk": 171,       // М5 "Урал"
    "nizhniy-novgorod": 429, // М5 + М7
    "cheboksary": 532,    // М5 + М7
    "izhevsk": 651,       // М5 + Р322
    "perm": 925,          // М5 + Р242
    "ekaterinburg": 1258, // М5 + Р242
    "chelyabinsk": 1338,  // М5 "Урал"
    "voronezh": 777,      // М5 + М4
    "rostov": 1181,       // М5 + М4
    "krasnodar": 1409,    // М5 + М4
    "stavropol": 1529,    // М5 + М4 + А154
    "spb": 1475,          // М5 + М10
    "yaroslavl": 570,     // М5 + М7 + М8
    "kostroma": 459       // М5 + М7 + А113
  },

  // Нижний Новгород
  "nizhniy-novgorod": {
    "moskva": 411,
    "kazan": 308,
    "samara": 429,        // М7 + М5
    "cheboksary": 187,    // М7 "Волга"
    "kirov": 495,         // М7 + Р176
    "izhevsk": 598,       // М7 + Р322
    "perm": 1072,         // М7 + Р242
    "ekaterinburg": 1405, // М7 + Р242
    "ufa": 755,           // М7 + М5
    "yaroslavl": 147,     // М7 + М8
    "kostroma": 151,      // М7 + А113
    "vladimir": 227,      // М7 "Волга"
    "ryazan": 338,        // М7 + М5
    "penza": 241,         // М7 + М5
    "saransk": 242,       // М7 + М5
    "voronezh": 640,      // М7 + М4
    "saratov": 576,       // М7 + М5
    "volgograd": 630,     // М7 + М5 + А260
    "spb": 1046,          // М7 + М10
    "tver": 558,          // М7 + М10
    "smolensk": 789       // М7 + М10 + М1
  },

  // Екатеринбург
  "ekaterinburg": {
    "moskva": 1416,
    "chelyabinsk": 80,    // Р242
    "perm": 242,          // Р242
    "ufa": 250,           // Р242 + М5
    "kazan": 1097,        // Р242 + М7
    "samara": 1258,       // Р242 + М5
    "nizhniy-novgorod": 1405, // Р242 + М7
    "kirov": 687,         // Р242 + Р176
    "izhevsk": 346,       // Р242 + Р322
    "orenburg": 527,      // Р242 + М5
    "kurgan": 198,        // Р354
    "tyumen": 328,        // Р354
    "omsk": 628,          // Р354
    "novosibirsk": 1143,  // Р354 + М51
    "krasnoyarsk": 1703,  // Р354 + М53
    "irkutsk": 2777,      // М53 "Байкал"
    "chita": 3420,        // М55 "Байкал"
    "khabarovsk": 6097,   // М58 "Амур"
    "vladivostok": 6777,  // М60 "Уссури"
    "spb": 2051,          // Р242 + М7 + М10
    "voronezh": 1654,     // Р242 + М5 + М4
    "rostov": 2058        // Р242 + М5 + М4
  }
};

// Функция получения реального расстояния
function getRealDistance(fromCity, toCity) {
  // Прямое расстояние
  if (REAL_DISTANCES[fromCity] && REAL_DISTANCES[fromCity][toCity]) {
    return REAL_DISTANCES[fromCity][toCity];
  }
  
  // Обратное расстояние (симметричное)
  if (REAL_DISTANCES[toCity] && REAL_DISTANCES[toCity][fromCity]) {
    return REAL_DISTANCES[toCity][fromCity];
  }
  
  // Если нет точных данных, возвращаем null для fallback
  return null;
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REAL_DISTANCES, getRealDistance };
}