#!/bin/bash

echo "🔧 Исправление проблем с калькулятором и стилями..."

# 1. Создаем резервную копию
echo "📦 Создание резервной копии..."
cp assets/js/smart-calculator-v2.js assets/js/smart-calculator-v2.js.backup
cp assets/js/smart-calculator-v2.min.js assets/js/smart-calculator-v2.min.js.backup

# 2. Обновляем версии файлов для сброса кэша
echo "🔄 Обновление версий файлов..."
sed -i 's/v=20250813/v=20250813-fix/g' index.html
sed -i 's/v=1754158000/v=1754158001/g' index.html

# 3. Проверяем существование CSS файлов
echo "📁 Проверка CSS файлов..."
if [ ! -f "assets/css/critical-optimized.min.css" ]; then
    echo "❌ Файл critical-optimized.min.css не найден!"
    exit 1
fi

if [ ! -f "assets/css/unified-styles.min.css" ]; then
    echo "❌ Файл unified-styles.min.css не найден!"
    exit 1
fi

# 4. Создаем минифицированную версию калькулятора
echo "📦 Создание минифицированной версии калькулятора..."
if command -v uglifyjs &> /dev/null; then
    uglifyjs assets/js/smart-calculator-v2.js -o assets/js/smart-calculator-v2.min.js
    echo "✅ Калькулятор минифицирован"
else
    echo "⚠️ uglifyjs не найден, копируем оригинал"
    cp assets/js/smart-calculator-v2.js assets/js/smart-calculator-v2.min.js
fi

# 5. Проверяем синтаксис JavaScript
echo "🔍 Проверка синтаксиса JavaScript..."
if command -v node &> /dev/null; then
    node -c assets/js/smart-calculator-v2.js
    if [ $? -eq 0 ]; then
        echo "✅ Синтаксис JavaScript корректен"
    else
        echo "❌ Ошибка в синтаксисе JavaScript"
        exit 1
    fi
else
    echo "⚠️ Node.js не найден, пропускаем проверку синтаксиса"
fi

# 6. Создаем тестовую страницу
echo "🧪 Создание тестовой страницы..."
cat > test-fix-results.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результаты исправлений</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🔧 Результаты исправлений</h1>
    
    <div class="test">
        <h3>Тест 1: Москва → СПб, 3000 кг (обычный)</h3>
        <div id="test1"></div>
    </div>
    
    <div class="test">
        <h3>Тест 2: Москва → СПб, 3000 кг (сборный)</h3>
        <div id="test2"></div>
    </div>
    
    <div class="test">
        <h3>Тест 3: Сравнение цен</h3>
        <div id="test3"></div>
    </div>

    <script src="assets/js/real-distances.js"></script>
    <script src="assets/js/smart-calculator-v2.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            try {
                const calc = new SmartCalculatorV2();
                
                // Тест 1: Обычный груз
                const regular = calc.calculatePrice('Москва', 'Санкт-Петербург', 3000, null, 'обычный');
                document.getElementById('test1').innerHTML = `
                    <p class="success">✅ Обычный груз: ${new Intl.NumberFormat('ru-RU').format(regular.price)} ₽</p>
                    <p>Транспорт: ${regular.transport}</p>
                    <p>Расстояние: ${regular.distance} км</p>
                `;
                
                // Тест 2: Сборный груз
                const consolidated = calc.calculatePrice('Москва', 'Санкт-Петербург', 3000, null, 'сборный');
                document.getElementById('test2').innerHTML = `
                    <p class="success">✅ Сборный груз: ${new Intl.NumberFormat('ru-RU').format(consolidated.price)} ₽</p>
                    <p>Транспорт: ${consolidated.transport}</p>
                    <p>Сборный: ${consolidated.details.isConsolidated ? 'Да' : 'Нет'}</p>
                `;
                
                // Тест 3: Сравнение
                const savings = regular.price - consolidated.price;
                const savingsPercent = Math.round((savings / regular.price) * 100);
                
                let comparisonClass = 'success';
                let comparisonText = '✅ Сборный груз дешевле обычного';
                
                if (consolidated.price >= regular.price) {
                    comparisonClass = 'error';
                    comparisonText = '❌ Сборный груз должен быть дешевле!';
                }
                
                if (regular.price > 1000000) {
                    comparisonClass = 'error';
                    comparisonText = '❌ Обычный груз слишком дорогой!';
                }
                
                if (consolidated.price > 1000000) {
                    comparisonClass = 'error';
                    comparisonText = '❌ Сборный груз слишком дорогой!';
                }
                
                document.getElementById('test3').innerHTML = `
                    <p class="${comparisonClass}">${comparisonText}</p>
                    <p>Экономия: ${new Intl.NumberFormat('ru-RU').format(savings)} ₽ (${savingsPercent}%)</p>
                    <p>Обычный: ${new Intl.NumberFormat('ru-RU').format(regular.price)} ₽</p>
                    <p>Сборный: ${new Intl.NumberFormat('ru-RU').format(consolidated.price)} ₽</p>
                `;
                
            } catch (error) {
                document.body.innerHTML += `<p class="error">❌ Ошибка: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
EOF

echo "✅ Тестовая страница создана: test-fix-results.html"

# 7. Запускаем локальный сервер для тестирования
echo "🚀 Запуск тестового сервера..."
echo "📱 Откройте http://localhost:8002/test-fix-results.html для проверки"
echo "📱 Откройте http://localhost:8002/test-calculator-fix.html для детального тестирования"
echo "📱 Откройте http://localhost:8002/test-css-loading.html для проверки CSS"

python3 -m http.server 8002 &

echo "✅ Исправления применены!"
echo "🔍 Проверьте результаты в браузере"
echo "🛑 Для остановки сервера: pkill -f 'python3 -m http.server 8002'"
