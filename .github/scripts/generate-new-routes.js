const fs = require('fs');
const path = require('path');

// Встроенная база реальных расстояний (в радиусе 1500 км от Москвы)
const REAL_DISTANCES = {
  // Центральный федеральный округ
  'moskva-tula': 180, 'moskva-kaluga': 165, 'moskva-ryazan': 196, 'moskva-vladimir': 184,
  'moskva-tver': 164, 'moskva-yaroslavl': 264, 'moskva-voronezh': 463, 'moskva-belgorod': 695,
  'moskva-kursk': 512, 'moskva-orel': 368, 'moskva-bryansk': 379, 'moskva-smolensk': 378,
  'moskva-lipetsk': 400, 'moskva-tambov': 460, 'moskva-ivanovo': 250, 'moskva-kostroma': 320,
  'moskva-rybinsk': 280, 'moskva-murom': 280, 'moskva-kovrov': 250, 'moskva-gusev': 200,
  'moskva-aleksandrov': 120, 'moskva-kolomna': 100, 'moskva-serpukhov': 80, 'moskva-odintsovo': 20,
  'moskva-khimki': 15, 'moskva-balashikha': 25, 'moskva-korolev': 30, 'moskva-mytishchi': 20,
  'moskva-lyubertsy': 15, 'moskva-podolsk': 40, 'moskva-ramenskoe': 35, 'moskva-dolgoprudny': 20,
  'moskva-reutov': 25, 'moskva-domodedovo': 35, 'moskva-krasnogorsk': 20, 'moskva-sergiev-posad': 70,
  'moskva-shchelkovo': 30, 'moskva-noginsk': 50, 'moskva-pushkino': 25, 'moskva-zhukovsky': 40,
  'moskva-elektrostal': 58, 'moskva-klin': 85, 'moskva-solnechnogorsk': 65, 'moskva-istra': 60,
  'moskva-chekhov': 70, 'moskva-shatura': 120, 'moskva-egoryevsk': 100, 'moskva-lukhovitsy': 110,
  'moskva-zaraisk': 140, 'moskva-kashira': 115, 'moskva-stupino': 90, 'moskva-voskresensk': 80,
  'moskva-ozery': 100, 'moskva-kolomna': 100, 'moskva-zhukovsky': 40, 'moskva-ramenskoe': 35,
  
  // Северо-Западный федеральный округ
  'moskva-spb': 635, 'moskva-novgorod': 520, 'moskva-pskov': 730, 'moskva-petrozavodsk': 850,
  'moskva-vologda': 450, 'moskva-veliky-novgorod': 520, 'moskva-kaliningrad': 1200,
  'moskva-murmansk': 1400, 'moskva-arkhangelsk': 1200, 'moskva-syktyvkar': 1400,
  
  // Приволжский федеральный округ
  'moskva-nizhniy-novgorod': 411, 'moskva-kazan': 719, 'moskva-penza': 630, 'moskva-saransk': 641,
  'moskva-samara': 850, 'moskva-ulyanovsk': 700, 'moskva-kirov': 900, 'moskva-izhevsk': 1100,
  'moskva-perm': 1200, 'moskva-orenburg': 1400, 'moskva-ufa': 1200, 'moskva-cheboksary': 650,
  'moskva-yoshkar-ola': 650, 'moskva-saransk': 641, 'moskva-dzerzhinsk': 400, 'moskva-arzamas': 400,
  'moskva-vyksa': 350, 'moskva-pavlovo': 400, 'moskva-kulebaki': 350, 'moskva-navashino': 350,
  'moskva-lukoyanov': 450, 'moskva-perevoz': 400, 'moskva-sergach': 450, 'moskva-shakhunya': 450,
  'moskva-urmaev': 450, 'moskva-vetluga': 450, 'moskva-varnavino': 450, 'moskva-krasnye-baki': 450,
  'moskva-semyonov': 450, 'moskva-gorodets': 450, 'moskva-balakhna': 450, 'moskva-bogorodsk': 450,
  'moskva-kstovo': 450, 'moskva-lukoyanov': 450, 'moskva-perevoz': 450, 'moskva-sergach': 450,
  
  // Южный федеральный округ
  'moskva-rostov': 1100, 'moskva-krasnodar': 1350, 'moskva-sochi': 1500, 'moskva-volgograd': 950,
  'moskva-astrakhan': 1400, 'moskva-elista': 1200, 'moskva-maykop': 1400, 'moskva-cherkessk': 1400,
  'moskva-nazran': 1500, 'moskva-grozny': 1500, 'moskva-makhachkala': 1500, 'moskva-vladikavkaz': 1500,
  'moskva-nalchik': 1500, 'moskva-magas': 1500, 'moskva-yoshkar-ola': 650, 'moskva-cheboksary': 650,
  
  // Северо-Кавказский федеральный округ
  'moskva-stavropol': 1300, 'moskva-pyatigorsk': 1400, 'moskva-kislovodsk': 1400,
  'moskva-essentuki': 1400, 'moskva-nalchik': 1500, 'moskva-vladikavkaz': 1500,
  
  // Уральский федеральный округ
  'moskva-ekaterinburg': 1800, 'moskva-chelyabinsk': 1800, 'moskva-tyumen': 2100,
  'moskva-kurgan': 2000, 'moskva-surgut': 2800, 'moskva-nizhnevartovsk': 2800,
  
  // Сибирский федеральный округ (только ближайшие)
  'moskva-omsk': 2500, 'moskva-novosibirsk': 2800, 'moskva-krasnoyarsk': 3300,
  
  // Дальневосточный федеральный округ (только для справки)
  'moskva-vladivostok': 9000, 'moskva-khabarovsk': 8500, 'moskva-yakutsk': 6500
};

// База данных городов с уникальной информацией (крупные города в радиусе 1500 км)
const CITY_DATABASE = {
  // Центральный федеральный округ
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
  },

  "ivanovo": {
    name: "Иваново",
    region: "Ивановская область",
    population: "400 тысяч человек",
    industries: ["текстильная промышленность", "швейная промышленность", "машиностроение"],
    landmarks: ["Ивановский текстильный комбинат", "Музей ивановского ситца", "Площадь Революции"],
    transport: "крупный транспортный узел Центральной России",
    uniqueFeatures: "текстильная столица России",
    description: "Иваново, известный как текстильная столица России, является крупным промышленным центром с богатыми традициями в текстильной и швейной промышленности."
  },

  "kostroma": {
    name: "Кострома",
    region: "Костромская область",
    population: "270 тысяч человек",
    industries: ["текстильная промышленность", "машиностроение", "деревообработка"],
    landmarks: ["Ипатьевский монастырь", "Торговые ряды", "набережная Волги"],
    transport: "важный порт на реке Волге",
    uniqueFeatures: "один из городов Золотого кольца России",
    description: "Кострома, один из древнейших городов России и часть Золотого кольца, славится своими историческими памятниками и развитой текстильной промышленностью."
  },

  "lipetsk": {
    name: "Липецк",
    region: "Липецкая область",
    population: "500 тысяч человек",
    industries: ["черная металлургия", "машиностроение", "пищевая промышленность"],
    landmarks: ["Липецкий металлургический комбинат", "Петровский спуск", "Соборная площадь"],
    transport: "крупный промышленный центр Центрального Черноземья",
    uniqueFeatures: "крупнейший центр черной металлургии в регионе",
    description: "Липецк является крупным промышленным центром с развитой металлургической промышленностью и современной инфраструктурой."
  },

  "tambov": {
    name: "Тамбов",
    region: "Тамбовская область",
    population: "280 тысяч человек",
    industries: ["химическая промышленность", "машиностроение", "пищевая промышленность"],
    landmarks: ["Тамбовский вал", "Соборная площадь", "Парк Победы"],
    transport: "важный транспортный узел Центрального Черноземья",
    uniqueFeatures: "крупный центр химической промышленности",
    description: "Тамбов, расположенный в центре Черноземья, является важным промышленным и культурным центром с развитой химической промышленностью."
  },

  "vladimir": {
    name: "Владимир",
    region: "Владимирская область",
    population: "350 тысяч человек",
    industries: ["машиностроение", "текстильная промышленность", "стекольная промышленность"],
    landmarks: ["Успенский собор", "Золотые ворота", "Дмитриевский собор"],
    transport: "крупный транспортный узел Владимирской области",
    uniqueFeatures: "древняя столица Северо-Восточной Руси",
    description: "Владимир, древняя столица Северо-Восточной Руси, является важным историческим и промышленным центром с богатым культурным наследием."
  },

  "gusev": {
    name: "Гусь-Хрустальный",
    region: "Владимирская область",
    population: "55 тысяч человек",
    industries: ["стекольная промышленность", "хрусталь", "декоративные изделия"],
    landmarks: ["Гусевский хрустальный завод", "Музей хрусталя", "река Гусь"],
    transport: "развитая инфраструктура Владимирской области",
    uniqueFeatures: "центр стекольной промышленности России",
    description: "Гусь-Хрустальный славится своим хрусталем и стекольной промышленностью, являясь одним из центров этого ремесла в России."
  },

  "aleksandrov": {
    name: "Александров",
    region: "Владимирская область",
    population: "60 тысяч человек",
    industries: ["текстильная промышленность", "машиностроение", "электроника"],
    landmarks: ["Александровская слобода", "Успенский монастырь", "Музей-заповедник"],
    transport: "важный транспортный узел Владимирской области",
    uniqueFeatures: "исторический центр с богатым культурным наследием",
    description: "Александров, известный своей исторической Александровской слободой, является важным культурным и промышленным центром."
  },

  // Северо-Западный федеральный округ
  "spb": {
    name: "Санкт-Петербург",
    region: "Ленинградская область",
    population: "5.4 миллиона человек",
    industries: ["машиностроение", "судостроение", "электроника", "туризм"],
    landmarks: ["Эрмитаж", "Петропавловская крепость", "Невский проспект"],
    transport: "крупнейший порт России на Балтийском море",
    uniqueFeatures: "культурная столица России",
    description: "Санкт-Петербург, культурная столица России, является крупнейшим промышленным, научным и культурным центром страны."
  },

  "novgorod": {
    name: "Великий Новгород",
    region: "Новгородская область",
    population: "220 тысяч человек",
    industries: ["машиностроение", "химическая промышленность", "деревообработка"],
    landmarks: ["Новгородский кремль", "Софийский собор", "Ярославово дворище"],
    transport: "важный исторический и культурный центр",
    uniqueFeatures: "один из древнейших городов России",
    description: "Великий Новгород, один из древнейших городов России, является важным историческим и культурным центром с богатым наследием."
  },

  "pskov": {
    name: "Псков",
    region: "Псковская область",
    population: "200 тысяч человек",
    industries: ["машиностроение", "электроника", "легкая промышленность"],
    landmarks: ["Псковский кремль", "Троицкий собор", "Поганкины палаты"],
    transport: "важный транспортный узел на западе России",
    uniqueFeatures: "один из древнейших городов России",
    description: "Псков, один из древнейших городов России, является важным историческим и культурным центром с развитой промышленностью."
  },

  "vologda": {
    name: "Вологда",
    region: "Вологодская область",
    population: "300 тысяч человек",
    industries: ["машиностроение", "деревообработка", "пищевая промышленность"],
    landmarks: ["Вологодский кремль", "Софийский собор", "Музей кружева"],
    transport: "важный транспортный узел Северо-Запада",
    uniqueFeatures: "столица русского кружева",
    description: "Вологда, известная как столица русского кружева, является важным культурным и промышленным центром Северо-Запада России."
  },

  // Приволжский федеральный округ
  "nizhniy-novgorod": {
    name: "Нижний Новгород",
    region: "Нижегородская область",
    population: "1.2 миллиона человек",
    industries: ["автомобилестроение", "судостроение", "машиностроение"],
    landmarks: ["Нижегородский кремль", "Чкаловская лестница", "набережная Волги"],
    transport: "крупнейший порт на реке Волге",
    uniqueFeatures: "столица Поволжья",
    description: "Нижний Новгород, столица Поволжья, является крупным промышленным, научным и культурным центром с развитой автомобильной промышленностью."
  },

  "kazan": {
    name: "Казань",
    region: "Республика Татарстан",
    population: "1.2 миллиона человек",
    industries: ["нефтехимия", "машиностроение", "пищевая промышленность"],
    landmarks: ["Казанский кремль", "Мечеть Кул-Шариф", "улица Баумана"],
    transport: "крупный транспортный узел Поволжья",
    uniqueFeatures: "столица Республики Татарстан",
    description: "Казань, столица Республики Татарстан, является крупным промышленным, научным и культурным центром с богатой историей."
  },

  "samara": {
    name: "Самара",
    region: "Самарская область",
    population: "1.1 миллиона человек",
    industries: ["авиакосмическая промышленность", "автомобилестроение", "нефтехимия"],
    landmarks: ["набережная Волги", "Площадь Куйбышева", "Жигулевские горы"],
    transport: "крупный порт на реке Волге",
    uniqueFeatures: "крупный центр авиакосмической промышленности",
    description: "Самара является крупным промышленным центром с развитой авиакосмической промышленностью и автомобилестроением."
  },

  "penza": {
    name: "Пенза",
    region: "Пензенская область",
    population: "520 тысяч человек",
    industries: ["машиностроение", "химическая промышленность", "пищевая промышленность"],
    landmarks: ["Пензенский краеведческий музей", "Площадь Ленина", "набережная Суры"],
    transport: "важный транспортный узел Поволжья",
    uniqueFeatures: "крупный промышленный центр Поволжья",
    description: "Пенза является важным промышленным и культурным центром Поволжья с развитой машиностроительной промышленностью."
  },

  "saransk": {
    name: "Саранск",
    region: "Республика Мордовия",
    population: "320 тысяч человек",
    industries: ["машиностроение", "электроника", "пищевая промышленность"],
    landmarks: ["Соборная площадь", "Мордовский краеведческий музей", "Парк культуры"],
    transport: "столица Республики Мордовия",
    uniqueFeatures: "столица Республики Мордовия",
    description: "Саранск, столица Республики Мордовия, является важным промышленным и культурным центром с развитой машиностроительной промышленностью."
  },

  "kirov": {
    name: "Киров",
    region: "Кировская область",
    population: "500 тысяч человек",
    industries: ["машиностроение", "деревообработка", "химическая промышленность"],
    landmarks: ["Театральная площадь", "набережная Вятки", "Александровский сад"],
    transport: "важный транспортный узел Приволжья",
    uniqueFeatures: "крупный промышленный центр Приволжья",
    description: "Киров является крупным промышленным центром с развитой машиностроительной и деревообрабатывающей промышленностью."
  },

  "izhevsk": {
    name: "Ижевск",
    region: "Удмуртская Республика",
    population: "650 тысяч человек",
    industries: ["машиностроение", "металлообработка", "автомобилестроение"],
    landmarks: ["Площадь оружейников", "Михайловский собор", "набережная Ижа"],
    transport: "столица Удмуртской Республики",
    uniqueFeatures: "оружейная столица России",
    description: "Ижевск, оружейная столица России, является крупным промышленным центром с развитой машиностроительной промышленностью."
  },

  "perm": {
    name: "Пермь",
    region: "Пермский край",
    population: "1 миллион человек",
    industries: ["нефтехимия", "машиностроение", "деревообработка"],
    landmarks: ["набережная Камы", "Театральная площадь", "Пермский краеведческий музей"],
    transport: "крупный порт на реке Каме",
    uniqueFeatures: "крупный промышленный центр Урала",
    description: "Пермь является крупным промышленным центром с развитой нефтехимической и машиностроительной промышленностью."
  },

  "orenburg": {
    name: "Оренбург",
    region: "Оренбургская область",
    population: "550 тысяч человек",
    industries: ["нефтегазовая промышленность", "машиностроение", "пищевая промышленность"],
    landmarks: ["набережная Урала", "Площадь Ленина", "Оренбургский краеведческий музей"],
    transport: "важный транспортный узел Южного Урала",
    uniqueFeatures: "крупный центр нефтегазовой промышленности",
    description: "Оренбург является важным промышленным центром с развитой нефтегазовой промышленностью."
  },

  "ufa": {
    name: "Уфа",
    region: "Республика Башкортостан",
    population: "1.1 миллиона человек",
    industries: ["нефтехимия", "машиностроение", "пищевая промышленность"],
    landmarks: ["Площадь Салавата Юлаева", "набережная Белой", "Башкирский краеведческий музей"],
    transport: "столица Республики Башкортостан",
    uniqueFeatures: "столица Республики Башкортостан",
    description: "Уфа, столица Республики Башкортостан, является крупным промышленным центром с развитой нефтехимической промышленностью."
  },

  "cheboksary": {
    name: "Чебоксары",
    region: "Чувашская Республика",
    population: "480 тысяч человек",
    industries: ["машиностроение", "электроника", "пищевая промышленность"],
    landmarks: ["набережная Волги", "Площадь Республики", "Чувашский краеведческий музей"],
    transport: "столица Чувашской Республики",
    uniqueFeatures: "столица Чувашской Республики",
    description: "Чебоксары, столица Чувашской Республики, является важным промышленным центром с развитой машиностроительной промышленностью."
  },

  "yoshkar-ola": {
    name: "Йошкар-Ола",
    region: "Республика Марий Эл",
    population: "280 тысяч человек",
    industries: ["машиностроение", "деревообработка", "пищевая промышленность"],
    landmarks: ["Площадь Республики", "набережная Малой Кокшаги", "Марийский краеведческий музей"],
    transport: "столица Республики Марий Эл",
    uniqueFeatures: "столица Республики Марий Эл",
    description: "Йошкар-Ола, столица Республики Марий Эл, является важным промышленным и культурным центром."
  },

  // Южный федеральный округ
  "rostov": {
    name: "Ростов-на-Дону",
    region: "Ростовская область",
    population: "1.1 миллиона человек",
    industries: ["машиностроение", "пищевая промышленность", "легкая промышленность"],
    landmarks: ["набережная Дона", "Площадь Советов", "Ростовский краеведческий музей"],
    transport: "крупный порт на реке Дон",
    uniqueFeatures: "столица Юга России",
    description: "Ростов-на-Дону, столица Юга России, является крупным промышленным и культурным центром с развитой машиностроительной промышленностью."
  },

  "krasnodar": {
    name: "Краснодар",
    region: "Краснодарский край",
    population: "900 тысяч человек",
    industries: ["пищевая промышленность", "машиностроение", "легкая промышленность"],
    landmarks: ["Площадь Победы", "набережная Кубани", "Краснодарский краеведческий музей"],
    transport: "столица Краснодарского края",
    uniqueFeatures: "столица Краснодарского края",
    description: "Краснодар, столица Краснодарского края, является крупным промышленным и культурным центром с развитой пищевой промышленностью."
  },

  "volgograd": {
    name: "Волгоград",
    region: "Волгоградская область",
    population: "1 миллион человек",
    industries: ["металлургия", "машиностроение", "химическая промышленность"],
    landmarks: ["Мамаев курган", "набережная Волги", "Площадь Павших борцов"],
    transport: "крупный порт на реке Волге",
    uniqueFeatures: "город-герой",
    description: "Волгоград, город-герой, является крупным промышленным центром с развитой металлургической промышленностью."
  },

  "astrakhan": {
    name: "Астрахань",
    region: "Астраханская область",
    population: "530 тысяч человек",
    industries: ["рыбная промышленность", "нефтегазовая промышленность", "пищевая промышленность"],
    landmarks: ["Астраханский кремль", "набережная Волги", "Астраханский краеведческий музей"],
    transport: "крупный порт в дельте Волги",
    uniqueFeatures: "рыбная столица России",
    description: "Астрахань, рыбная столица России, является важным промышленным центром с развитой рыбной промышленностью."
  }
};

// НОВЫЕ ГОРОДА ДЛЯ ГЕНЕРАЦИИ (крупные города в радиусе 1500 км)
const NEW_CITIES = {
  "moskva": {
    name: "Москва",
    nameTo: "Москвы", 
    nameFrom: "из Москвы",
    region: "Московская область",
    newDestinations: [
      // Центральный федеральный округ
      "ivanovo", "kostroma", "lipetsk", "tambov", "rybinsk", 
      "vladimir", "murom", "kovrov", "gusev", "aleksandrov",
      
      // Северо-Западный федеральный округ
      "spb", "novgorod", "pskov", "vologda",
      
      // Приволжский федеральный округ
      "nizhniy-novgorod", "kazan", "samara", "penza", "saransk",
      "kirov", "izhevsk", "perm", "orenburg", "ufa", 
      "cheboksary", "yoshkar-ola",
      
      // Южный федеральный округ
      "rostov", "krasnodar", "volgograd", "astrakhan"
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
    // Центральный федеральный округ
    "авиационные двигатели": "Специализированная транспортировка авиационных компонентов",
    "электротехника": "Антистатическая транспортировка электроники", 
    "пищевая промышленность": "Рефрижераторы для пищевых продуктов",
    "стрелковое оружие": "Специализированная транспортировка оружия",
    "военная техника": "Тяжеловесные перевозки военного оборудования",
    "радиотехника": "Транспортировка радиоэлектронного оборудования",
    "приборостроение": "Доставка точных приборов и оборудования",
    "текстильная промышленность": "Перевозка текстильных товаров и материалов",
    "швейная промышленность": "Транспортировка готовой одежды и тканей",
    "машиностроение": "Перевозка промышленного оборудования",
    "черная металлургия": "Тяжеловесные перевозки металлопродукции",
    "химическая промышленность": "Специализированная транспортировка химических веществ",
    "стекольная промышленность": "Хрупкие грузы - стекло и хрусталь",
    "хрусталь": "Особая упаковка и транспортировка хрустальных изделий",
    "декоративные изделия": "Транспортировка декоративных и сувенирных товаров",
    "электроника": "Антистатическая транспортировка электронных компонентов",
    
    // Северо-Западный федеральный округ
    "судостроение": "Тяжеловесные перевозки судового оборудования",
    "туризм": "Транспортировка туристического оборудования",
    "деревообработка": "Перевозка пиломатериалов и деревянных изделий",
    
    // Приволжский федеральный округ
    "автомобилестроение": "Транспортировка автомобильных компонентов",
    "нефтехимия": "Специализированная транспортировка нефтехимической продукции",
    "авиакосмическая промышленность": "Транспортировка авиакосмического оборудования",
    "металлообработка": "Перевозка металлообрабатывающего оборудования",
    "нефтегазовая промышленность": "Транспортировка нефтегазового оборудования",
    
    // Южный федеральный округ
    "металлургия": "Тяжеловесные перевозки металлопродукции",
    "рыбная промышленность": "Рефрижераторы для рыбной продукции",
    "легкая промышленность": "Перевозка товаров легкой промышленности"
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