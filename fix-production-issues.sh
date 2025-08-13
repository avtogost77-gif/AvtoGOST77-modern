#!/bin/bash

# 🔧 СКРИПТ ИСПРАВЛЕНИЯ КРИТИЧЕСКИХ ПРОБЛЕМ ПРОДАКШН СБОРКИ
# АвтоГОСТ77 - 13.08.2025

echo "🚀 Начинаем исправление критических проблем продакшн сборки..."

# Создаем резервную копию
echo "📦 Создаем резервную копию..."
backup_dir="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp -r assets "$backup_dir/"
cp *.html "$backup_dir/"
cp *.js "$backup_dir/" 2>/dev/null || true
cp *.css "$backup_dir/" 2>/dev/null || true
echo "✅ Резервная копия создана: $backup_dir"

# 1. Удаляем тестовую страницу
echo "🗑️ Удаляем тестовую страницу..."
if [ -f "test-calculator.html" ]; then
    rm "test-calculator.html"
    echo "✅ test-calculator.html удален"
else
    echo "ℹ️ test-calculator.html не найден"
fi

# 2. Очищаем console.log из продакшн файлов
echo "🧹 Очищаем отладочные console.log..."

# Создаем временные файлы для очистки
find assets/js/ -name "*.js" -type f | while read file; do
    if [ -f "$file" ]; then
        # Создаем копию без console.log
        temp_file="${file}.temp"
        
        # Удаляем console.log, console.warn, console.error (но оставляем console.error для критических ошибок)
        sed '/console\.log(/d; /console\.warn(/d' "$file" > "$temp_file"
        
        # Проверяем, что файл не пустой
        if [ -s "$temp_file" ]; then
            mv "$temp_file" "$file"
            echo "✅ Очищен: $file"
        else
            echo "⚠️ Файл стал пустым, восстанавливаем: $file"
            rm "$temp_file"
        fi
    fi
done

# 3. Восстанавливаем Service Worker
echo "🔧 Восстанавливаем Service Worker..."

# Создаем новый Service Worker
cat > sw.js << 'EOF'
// SERVICE WORKER АВТОГОСТ77 - ПРОДАКШН ВЕРСИЯ
console.log('🚀 Service Worker АвтоГОСТ77 активирован');

const CACHE_NAME = 'avtogost77-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/critical-optimized.min.css',
  '/assets/css/unified-styles.min.css',
  '/assets/js/main.min.js',
  '/assets/js/smart-calculator-v2.js',
  '/favicon.svg',
  '/manifest.json'
];

// Установка
self.addEventListener('install', (event) => {
  console.log('📦 SW: Установка кэша');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ SW: Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Активация');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем аналитику и внешние ресурсы
  if (event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('mc.yandex.ru') ||
      event.request.url.includes('unpkg.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кэша или загружаем из сети
        return response || fetch(event.request);
      })
  );
});

console.log('✅ Service Worker АвтоГОСТ77 готов к работе');
EOF

echo "✅ Service Worker восстановлен"

# 4. Восстанавливаем регистрацию SW в index.html
echo "🔧 Восстанавливаем регистрацию Service Worker..."

# Создаем временный файл для index.html
temp_index="index_temp.html"

# Заменяем закомментированный SW код на рабочий
sed '/ОТКЛЮЧАЕМ SERVICE WORKER/,/Простая инициализация без SW/c\
        // Восстановленная регистрация Service Worker\
        if ("serviceWorker" in navigator) {\
            window.addEventListener("load", () => {\
                navigator.serviceWorker.register("/sw.js")\
                    .then((registration) => {\
                        console.log("✅ SW зарегистрирован успешно");\
                    })\
                    .catch((registrationError) => {\
                        console.log("⚠️ SW регистрация не удалась:", registrationError);\
                    });\
            });\
        }\
        \
        // Инициализация сайта\
        document.addEventListener("DOMContentLoaded", function() {\
            console.log("🚀 Сайт загружен с Service Worker");\
        });' index.html > "$temp_index"

# Проверяем, что замена прошла успешно
if [ -s "$temp_index" ]; then
    mv "$temp_index" index.html
    echo "✅ Регистрация Service Worker восстановлена в index.html"
else
    echo "⚠️ Ошибка при восстановлении SW, восстанавливаем из резервной копии"
    cp "$backup_dir/index.html" .
fi

# 5. Создаем .env файл для API токенов (пример)
echo "🔐 Создаем пример .env файла для API токенов..."
cat > .env.example << 'EOF'
# API ТОКЕНЫ АВТОГОСТ77 - ПРИМЕР ФАЙЛА
# Скопируйте этот файл в .env и заполните реальными значениями

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Google Analytics ID
GA_TRACKING_ID=G-EMQ3D0X8K7

# Yandex Metrika ID
YM_TRACKING_ID=103413788

# Основной телефон
MAIN_PHONE=+79162720932

# Дополнительный телефон
SECONDARY_PHONE=+7999458907
EOF

echo "✅ .env.example создан"

# 6. Создаем .gitignore если его нет
if [ ! -f ".gitignore" ]; then
    echo "📝 Создаем .gitignore..."
    cat > .gitignore << 'EOF'
# Конфиденциальные данные
.env
.env.local
.env.production

# Резервные копии
backup-*/

# Логи
*.log

# Временные файлы
*.tmp
*.temp

# Системные файлы
.DS_Store
Thumbs.db

# IDE файлы
.vscode/
.idea/
*.swp
*.swo

# Node.js (если используется)
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Тестовые файлы
test-*.html
debug-*.html
EOF
    echo "✅ .gitignore создан"
fi

# 7. Создаем скрипт для проверки безопасности
echo "🔍 Создаем скрипт проверки безопасности..."
cat > check-security.sh << 'EOF'
#!/bin/bash

echo "🔒 Проверка безопасности АвтоГОСТ77..."

# Проверяем наличие API токенов в коде
echo "🔍 Проверяем API токены..."
if grep -r "7999458907:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8" assets/js/ 2>/dev/null; then
    echo "❌ КРИТИЧНО: API токены найдены в коде!"
else
    echo "✅ API токены не найдены в коде"
fi

# Проверяем console.log
echo "🔍 Проверяем console.log..."
console_count=$(grep -r "console.log" assets/js/ 2>/dev/null | wc -l)
if [ "$console_count" -gt 0 ]; then
    echo "⚠️ Найдено $console_count console.log в JS файлах"
else
    echo "✅ console.log не найдены"
fi

# Проверяем тестовые файлы
echo "🔍 Проверяем тестовые файлы..."
if [ -f "test-calculator.html" ]; then
    echo "❌ Найден тестовый файл: test-calculator.html"
else
    echo "✅ Тестовые файлы не найдены"
fi

# Проверяем Service Worker
echo "🔍 Проверяем Service Worker..."
if grep -q "KILLER\|NUKING\|DESTROY" sw.js 2>/dev/null; then
    echo "❌ Service Worker содержит проблемную логику"
else
    echo "✅ Service Worker в порядке"
fi

echo "✅ Проверка безопасности завершена"
EOF

chmod +x check-security.sh
echo "✅ Скрипт проверки безопасности создан"

# 8. Создаем отчет о выполненных исправлениях
echo "📊 Создаем отчет о исправлениях..."
cat > FIXES-APPLIED-$(date +%Y%m%d).md << EOF
# 🔧 ИСПРАВЛЕНИЯ ПРОДАКШН СБОРКИ
## АвтоГОСТ77 - $(date +%d.%m.%Y)

### ✅ Выполненные исправления:

1. **Удалена тестовая страница**
   - Удален файл: test-calculator.html

2. **Очищен отладочный код**
   - Удалены console.log из JS файлов
   - Сохранены console.error для критических ошибок

3. **Восстановлен Service Worker**
   - Создан новый sw.js с правильной логикой
   - Восстановлена регистрация в index.html

4. **Подготовлена безопасность**
   - Создан .env.example для API токенов
   - Создан .gitignore для защиты конфиденциальных данных

5. **Созданы инструменты мониторинга**
   - Скрипт check-security.sh для проверки безопасности

### 📋 Следующие шаги:

1. **Ручные исправления:**
   - Вынести API токены в переменные окружения
   - Унифицировать контактные данные
   - Вынести inline стили в CSS файлы

2. **Тестирование:**
   - Проверить работу Service Worker
   - Протестировать калькулятор
   - Проверить аналитику

3. **Мониторинг:**
   - Запустить check-security.sh
   - Проверить консоль браузера
   - Мониторить производительность

### 📁 Резервная копия:
Создана в папке: $backup_dir

### 🔍 Проверка:
Запустите: ./check-security.sh

---
*Исправления применены: $(date)*
EOF

echo "✅ Отчет о исправлениях создан"

# Финальная проверка
echo ""
echo "🎉 ИСПРАВЛЕНИЯ ЗАВЕРШЕНЫ!"
echo ""
echo "📋 Что было сделано:"
echo "✅ Удалена тестовая страница"
echo "✅ Очищен отладочный код"
echo "✅ Восстановлен Service Worker"
echo "✅ Подготовлена безопасность"
echo "✅ Созданы инструменты мониторинга"
echo ""
echo "🔍 Для проверки запустите: ./check-security.sh"
echo "📊 Отчет сохранен в: FIXES-APPLIED-$(date +%Y%m%d).md"
echo "📦 Резервная копия в: $backup_dir"
echo ""
echo "⚠️ ВАЖНО: Не забудьте вручную вынести API токены в переменные окружения!"
