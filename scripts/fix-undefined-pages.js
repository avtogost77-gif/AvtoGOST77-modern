#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Исправляем страницы с undefined...\n');

// Находим все файлы с дефисом в начале
const files = fs.readdirSync('.').filter(f => f.startsWith('-') && f.endsWith('.html'));

console.log(`Найдено ${files.length} файлов для исправления`);

let fixed = 0;
let errors = 0;

files.forEach((file, index) => {
  try {
    // Читаем файл
    let content = fs.readFileSync(file, 'utf8');
    
    // Заменяем все undefined на "Грузоперевозки"
    const originalLength = content.length;
    content = content.replace(/undefined/g, 'Грузоперевозки');
    
    // Исправляем serviceType в Schema.org
    content = content.replace(/"serviceType": ""/, '"serviceType": "Грузоперевозки"');
    
    // Записываем обратно
    fs.writeFileSync(file, content);
    
    if (content.length !== originalLength) {
      fixed++;
      if (fixed % 100 === 0) {
        console.log(`✅ Исправлено ${fixed} файлов...`);
      }
    }
  } catch (error) {
    errors++;
    console.error(`❌ Ошибка в файле ${file}:`, error.message);
  }
});

console.log(`\n✅ Готово!`);
console.log(`📊 Статистика:`);
console.log(`   - Обработано: ${files.length}`);
console.log(`   - Исправлено: ${fixed}`);
console.log(`   - Ошибок: ${errors}`);

// Проверяем результат на первом файле
if (files.length > 0) {
  console.log('\n🔍 Проверка первого файла:');
  const checkContent = fs.readFileSync(files[0], 'utf8');
  const titleMatch = checkContent.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    console.log(`   Title: ${titleMatch[1]}`);
  }
}