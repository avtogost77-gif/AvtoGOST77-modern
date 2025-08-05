const fs = require('fs');
const path = require('path');

// Функция для подсчета слов в HTML контенте
function countWords(htmlContent) {
  // Удаляем скрипты и стили
  let content = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Удаляем HTML теги
  content = content.replace(/<[^>]*>/g, ' ');
  
  // Удаляем лишние пробелы и считаем слова
  content = content.replace(/\s+/g, ' ').trim();
  
  // Считаем слова (русские и английские)
  const words = content.match(/[\u0400-\u04FF]+|[a-zA-Z]+/g) || [];
  return words.length;
}

// Функция для анализа файла
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const wordCount = countWords(content);
  const filename = path.basename(filePath);
  
  return {
    filename,
    wordCount,
    needsImprovement: wordCount < 2000
  };
}

// Функция для обхода директорий
function scanDirectory(dirPath, results = []) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'assets') {
      scanDirectory(fullPath, results);
    } else if (file.endsWith('.html') && !file.includes('404')) {
      results.push(analyzeFile(fullPath));
    }
  }
  
  return results;
}

// Главная функция
function main() {
  console.log('📊 Анализ глубины контента на страницах сайта\n');
  console.log('Целевой показатель: минимум 2000 слов на страницу\n');
  console.log('=' .repeat(60) + '\n');
  
  const baseDir = path.join(__dirname, '..', '..');
  const results = scanDirectory(baseDir);
  
  // Сортируем по количеству слов (от меньшего к большему)
  results.sort((a, b) => a.wordCount - b.wordCount);
  
  // Страницы, требующие улучшения
  const needsImprovement = results.filter(r => r.needsImprovement);
  const goodPages = results.filter(r => !r.needsImprovement);
  
  console.log('❌ Страницы, требующие улучшения (< 2000 слов):\n');
  for (const page of needsImprovement) {
    console.log(`   ${page.filename.padEnd(40)} - ${page.wordCount} слов`);
  }
  
  console.log('\n✅ Страницы с достаточным контентом (>= 2000 слов):\n');
  for (const page of goodPages) {
    console.log(`   ${page.filename.padEnd(40)} - ${page.wordCount} слов`);
  }
  
  // Статистика
  console.log('\n' + '=' .repeat(60));
  console.log('\n📈 Статистика:\n');
  console.log(`   Всего страниц: ${results.length}`);
  console.log(`   Требуют улучшения: ${needsImprovement.length} (${Math.round(needsImprovement.length / results.length * 100)}%)`);
  console.log(`   Соответствуют требованиям: ${goodPages.length} (${Math.round(goodPages.length / results.length * 100)}%)`);
  
  // Средние показатели
  const avgWords = Math.round(results.reduce((sum, r) => sum + r.wordCount, 0) / results.length);
  console.log(`   Среднее количество слов: ${avgWords}`);
  
  // Топ-5 страниц с наименьшим контентом
  console.log('\n🎯 Топ-5 страниц для приоритетного улучшения:\n');
  for (let i = 0; i < Math.min(5, needsImprovement.length); i++) {
    const page = needsImprovement[i];
    const deficit = 2000 - page.wordCount;
    console.log(`   ${i + 1}. ${page.filename} - всего ${page.wordCount} слов (нужно добавить ${deficit} слов)`);
  }
  
  // Сохраняем отчет
  const report = {
    date: new Date().toISOString(),
    totalPages: results.length,
    needsImprovement: needsImprovement.map(p => ({
      filename: p.filename,
      wordCount: p.wordCount,
      deficit: 2000 - p.wordCount
    })),
    statistics: {
      avgWords,
      percentNeedsImprovement: Math.round(needsImprovement.length / results.length * 100),
      totalPagesToImprove: needsImprovement.length
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'content-depth-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n💾 Отчет сохранен в .github/scripts/content-depth-report.json');
}

// Запускаем анализ
main();