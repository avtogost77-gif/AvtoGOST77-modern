#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Читаем полную базу
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'russia-cities.json'), 'utf8'));

// Регионы которые нас интересуют
const TARGET_REGIONS = [
    'Московская область',
    'Ленинградская область',
    'Санкт-Петербург',
    'Москва',
    'Краснодарский край',
    'Ростовская область',
    'Свердловская область',
    'Нижегородская область',
    'Республика Татарстан',
    'Самарская область',
    'Челябинская область',
    'Новосибирская область'
];

// Извлекаем города по регионам
const citiesByRegion = {};
const allTargetCities = [];

data.forEach(city => {
    const regionName = city.region.name;
    
    if (TARGET_REGIONS.includes(regionName)) {
        if (!citiesByRegion[regionName]) {
            citiesByRegion[regionName] = [];
        }
        
        citiesByRegion[regionName].push({
            name: city.name,
            population: city.population,
            zip: city.zip
        });
        
        allTargetCities.push(city.name);
    }
});

// Статистика
console.log('📊 СТАТИСТИКА ПО РЕГИОНАМ:');
Object.entries(citiesByRegion).forEach(([region, cities]) => {
    console.log(`${region}: ${cities.length} городов`);
});

console.log(`\n✅ ИТОГО: ${allTargetCities.length} городов`);

// Сохраняем результат
const jsContent = `const REGIONAL_CITIES = ${JSON.stringify(allTargetCities, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'js', 'regional-cities.js'), jsContent);
console.log('💾 Сохранено в assets/js/regional-cities.js');
