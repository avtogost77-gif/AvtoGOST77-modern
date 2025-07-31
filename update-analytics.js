#!/usr/bin/env node
/**
 * 📊 МАССОВОЕ ОБНОВЛЕНИЕ АНАЛИТИКИ
 * Обновляет коды Яндекс.Метрики и Google Analytics на всех HTML страницах
 * Задача от Универсала-3000
 */

const fs = require('fs').promises;
const path = require('path');

// Конфигурация
const CONFIG = {
  // Актуальные коды аналитики (из includes/analytics.html)
  YANDEX_METRIKA: '98832562',
  GOOGLE_ANALYTICS: 'G-EMQ3D0X8K7',
  
  // Старые коды для замены
  OLD_YANDEX: '103413788',
  OLD_GOOGLE: 'G-BZZPY2YQPP',
  
  // Паттерны для поиска
  patterns: {
    yandexMetrika: /ym\(\s*(\d+)\s*,\s*"init"/g,
    yandexNoscript: /mc\.yandex\.ru\/watch\/(\d+)/g,
    googleAnalytics: /gtag\s*\(\s*['"]config['"]\s*,\s*['"]([A-Z0-9-]+)['"]\s*\)/g,
    googleScript: /googletagmanager\.com\/gtag\/js\?id=([A-Z0-9-]+)/g
  }
};

// Статистика
let stats = {
  totalFiles: 0,
  processedFiles: 0,
  updatedFiles: 0,
  errors: 0,
  yandexUpdates: 0,
  googleUpdates: 0
};

/**
 * Обновляет аналитику в HTML файле
 */
async function updateAnalyticsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    // Замена Яндекс.Метрики
    content = content.replace(CONFIG.patterns.yandexMetrika, (match, id) => {
      if (id !== CONFIG.YANDEX_METRIKA) {
        changes++;
        stats.yandexUpdates++;
        console.log(`  📊 Яндекс.Метрика: ${id} → ${CONFIG.YANDEX_METRIKA}`);
        return `ym(${CONFIG.YANDEX_METRIKA}, "init"`;
      }
      return match;
    });
    
    content = content.replace(CONFIG.patterns.yandexNoscript, (match, id) => {
      if (id !== CONFIG.YANDEX_METRIKA) {
        changes++;
        return `mc.yandex.ru/watch/${CONFIG.YANDEX_METRIKA}`;
      }
      return match;
    });
    
    // Замена Google Analytics
    content = content.replace(CONFIG.patterns.googleAnalytics, (match, id) => {
      if (id !== CONFIG.GOOGLE_ANALYTICS) {
        changes++;
        stats.googleUpdates++;
        console.log(`  📈 Google Analytics: ${id} → ${CONFIG.GOOGLE_ANALYTICS}`);
        return `gtag('config', '${CONFIG.GOOGLE_ANALYTICS}')`;
      }
      return match;
    });
    
    content = content.replace(CONFIG.patterns.googleScript, (match, id) => {
      if (id !== CONFIG.GOOGLE_ANALYTICS) {
        changes++;
        return `googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS}`;
      }
      return match;
    });
    
    // Проверяем, есть ли вообще аналитика
    const hasYandex = content.includes('ym(') || content.includes('yandex.ru/metrika');
    const hasGoogle = content.includes('gtag(') || content.includes('googletagmanager.com');
    
    // Если нет аналитики, добавляем через include
    if (!hasYandex && !hasGoogle && content.includes('</head>')) {
      console.log(`  ➕ Добавляем аналитику через include`);
      
      // Проверяем, есть ли уже include
      if (!content.includes('includes/analytics.html')) {
        content = content.replace('</head>', `
  <!-- Analytics -->
  <!--#include virtual="/includes/analytics.html" -->
</head>`);
        changes++;
      }
    }
    
    // Сохраняем, если были изменения
    if (changes > 0) {
      await fs.writeFile(filePath, content, 'utf8');
      stats.updatedFiles++;
      console.log(`✅ Обновлен: ${path.basename(filePath)} (${changes} изменений)`);
    }
    
    stats.processedFiles++;
    
  } catch (error) {
    console.error(`❌ Ошибка в файле ${filePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Рекурсивно находит все HTML файлы
 */
async function findHtmlFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        // Пропускаем системные папки
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'test-deploy') {
          await findHtmlFiles(filePath, fileList);
        }
      } else if (file.endsWith('.html')) {
        fileList.push(filePath);
        stats.totalFiles++;
      }
    }
  } catch (error) {
    console.error(`Ошибка при чтении директории ${dir}:`, error.message);
  }
  
  return fileList;
}

/**
 * Создает отчет об обновлении
 */
async function createReport() {
  const report = `# 📊 ОТЧЕТ ОБ ОБНОВЛЕНИИ АНАЛИТИКИ

## Дата: ${new Date().toLocaleString('ru-RU')}

### 📈 Статистика:
- **Всего файлов найдено:** ${stats.totalFiles}
- **Обработано файлов:** ${stats.processedFiles}
- **Обновлено файлов:** ${stats.updatedFiles}
- **Ошибок:** ${stats.errors}

### 🔄 Замены:
- **Яндекс.Метрика:** ${stats.yandexUpdates} замен
  - Старый код: ${CONFIG.OLD_YANDEX}
  - Новый код: ${CONFIG.YANDEX_METRIKA}
  
- **Google Analytics:** ${stats.googleUpdates} замен
  - Старый код: ${CONFIG.OLD_GOOGLE}
  - Новый код: ${CONFIG.GOOGLE_ANALYTICS}

### ✅ Результат:
${stats.errors === 0 ? 'Все файлы успешно обновлены!' : `Обновление завершено с ${stats.errors} ошибками.`}

### 📝 Рекомендации:
1. Проверьте работу аналитики на сайте
2. Убедитесь, что счетчики активны в личных кабинетах
3. Дождитесь появления данных (может занять до 24 часов)

---
*Отчет сгенерирован автоматически скриптом update-analytics.js*
`;

  await fs.writeFile('ANALYTICS-UPDATE-REPORT.md', report, 'utf8');
  console.log('\n📄 Отчет сохранен в ANALYTICS-UPDATE-REPORT.md');
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 ЗАПУСК МАССОВОГО ОБНОВЛЕНИЯ АНАЛИТИКИ\n');
  console.log(`📊 Целевые коды:`);
  console.log(`   Яндекс.Метрика: ${CONFIG.YANDEX_METRIKA}`);
  console.log(`   Google Analytics: ${CONFIG.GOOGLE_ANALYTICS}\n`);
  
  // Находим все HTML файлы
  console.log('🔍 Поиск HTML файлов...');
  const htmlFiles = await findHtmlFiles(process.cwd());
  console.log(`📁 Найдено файлов: ${htmlFiles.length}\n`);
  
  // Обрабатываем каждый файл
  console.log('⚙️ Обработка файлов:');
  for (const file of htmlFiles) {
    await updateAnalyticsInFile(file);
  }
  
  // Выводим итоги
  console.log('\n📊 ИТОГИ:');
  console.log(`✅ Обновлено файлов: ${stats.updatedFiles}/${stats.totalFiles}`);
  console.log(`📈 Замен Яндекс.Метрики: ${stats.yandexUpdates}`);
  console.log(`📈 Замен Google Analytics: ${stats.googleUpdates}`);
  
  if (stats.errors > 0) {
    console.log(`❌ Ошибок: ${stats.errors}`);
  }
  
  // Создаем отчет
  await createReport();
  
  console.log('\n✨ Обновление завершено!');
}

// Запуск
main().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});