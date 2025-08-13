#!/bin/bash

# Скрипт для обновления калькулятора на всех страницах
# Дата: 2025-08-13

echo "🚀 Обновление калькулятора на всех страницах..."

# Список всех HTML файлов с калькулятором
PAGES=(
    "gruzoperevozki-spb.html"
    "gruzoperevozki-iz-moskvy.html"
    "gruzoperevozki-ekaterinburg.html"
    "gazel-gruzoperevozki.html"
    "fura-20-tonn-gruzoperevozki.html"
    "pyatitonnik-gruzoperevozki.html"
    "self-employed-delivery.html"
    "rc-dostavka.html"
    "urgent-delivery.html"
    "gruzoperevozki-moskva-voronezh.html"
    "gruzoperevozki-po-moskve.html"
    "gruzoperevozki-moskva-tambov.html"
    "gruzoperevozki-moskva-orel.html"
    "gruzoperevozki-moskva-spb.html"
)

# Функция для добавления CSS файла
add_calculator_css() {
    local file="$1"
    echo "📝 Добавляю CSS в $file..."
    
    # Добавляем CSS файл после unified-styles.min.css
    sed -i '/unified-styles\.min\.css.*media="print"/a\    <link rel="stylesheet" href="assets/css/calculator-modern.css?v=20250813-new">' "$file"
}

# Функция для замены старого калькулятора на новый
replace_calculator() {
    local file="$1"
    echo "🔄 Обновляю калькулятор в $file..."
    
    # Создаем временный файл с новым калькулятором
    cat > /tmp/new_calculator.html << 'EOF'
    <!-- Калькулятор -->
    <section id="calculator" class="calculator-section">
        <div class="calculator-container">
            <div class="calculator-card">
                <div class="calculator-header">
                    <div class="calculator-title">
                        <h2>🚛 Калькулятор стоимости</h2>
                        <p>Рассчитайте стоимость доставки за 30 секунд</p>
                    </div>
                    <div class="calculator-badges">
                        <div class="calc-badge">
                            <span class="calc-badge-icon">⚡</span>
                            Быстрый расчет
                        </div>
                        <div class="calc-badge">
                            <span class="calc-badge-icon">💰</span>
                            Без скрытых платежей
                        </div>
                        <div class="calc-badge">
                            <span class="calc-badge-icon">✅</span>
                            Точные цены
                        </div>
                    </div>
                </div>
                
                <form class="calculator-form" id="calculatorForm">
                    <!-- Прогресс-бар -->
                    <div class="form-progress">
                        <div class="progress-line">
                            <div class="progress-line-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-step active" data-step="1">
                            <div class="step-circle">1</div>
                            <div class="step-label">Маршрут</div>
                        </div>
                        <div class="progress-step" data-step="2">
                            <div class="step-circle">2</div>
                            <div class="step-label">Груз</div>
                        </div>
                        <div class="progress-step" data-step="3">
                            <div class="step-circle">3</div>
                            <div class="step-label">Расчет</div>
                        </div>
                    </div>
                    
                    <!-- Шаг 1: Маршрут -->
                    <div class="calc-step active" id="step1">
                        <div class="route-inputs">
                            <div class="form-group">
                                <label for="fromCity">Откуда</label>
                                <input type="text" 
                                       class="form-control"
                                       id="fromCity" 
                                       name="from" 
                                       placeholder="Введите город отправления" 
                                       data-address-type="from"
                                       autocomplete="off"
                                       required>
                                <div class="address-suggestions" data-for="from"></div>
                            </div>
                            
                            <div class="route-arrow">
                                →
                            </div>
                            
                            <div class="form-group">
                                <label for="toCity">Куда</label>
                                <input type="text" 
                                       class="form-control"
                                       id="toCity" 
                                       name="to" 
                                       placeholder="Введите город назначения"
                                       data-address-type="to"
                                       autocomplete="off"
                                       required>
                                <div class="address-suggestions" data-for="to"></div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-calculate" id="nextStep1">
                                Далее: Указать груз
                            </button>
                        </div>
                    </div>
                    
                    <!-- Шаг 2: Груз -->
                    <div class="calc-step" id="step2">
                        <div class="cargo-inputs">
                            <div class="form-group">
                                <label for="weight">Вес груза, кг</label>
                                <input type="number" 
                                       class="form-control"
                                       id="weight" 
                                       name="weight" 
                                       placeholder="Например: 1000" 
                                       min="1" 
                                       autocomplete="off" 
                                       required>
                            </div>
                            
                            <div class="form-group">
                                <label for="volume">Объем, м³</label>
                                <input type="number" 
                                       class="form-control"
                                       id="volume" 
                                       name="volume" 
                                       placeholder="Если груз объемный" 
                                       min="0" 
                                       step="0.1" 
                                       autocomplete="off">
                            </div>
                        </div>
                        
                        <div class="consolidated-checkbox">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" id="isConsolidated" name="isConsolidated">
                                <div class="checkbox-content">
                                    <div class="checkbox-title">
                                        <span class="checkbox-icon">📦</span>
                                        Сборный груз
                                    </div>
                                    <div class="checkbox-description">
                                        Выгоднее при консолидации, срок может увеличиться на 1-2 дня
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-calculate" id="prevStep2">
                                ← Назад
                            </button>
                            <button type="button" class="btn-calculate" id="nextStep2">
                                Рассчитать стоимость
                            </button>
                        </div>
                    </div>
                    
                    <!-- Шаг 3: Расчет -->
                    <div class="calc-step" id="step3">
                        <div class="form-actions">
                            <button type="button" class="btn-calculate" id="prevStep3">
                                ← Назад
                            </button>
                            <button type="button" class="btn-calculate" id="calculateButton">
                                <span class="btn-text">Рассчитываем стоимость...</span>
                                <span class="btn-loading" style="display: none;">
                                    <span class="loading-spinner"></span>
                                    Рассчитываем...
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
                
                <div id="calculatorResult" class="calculator-result">
                    <div class="result-header">
                        <div class="result-price" id="resultPrice">0 ₽</div>
                        <div class="result-subtitle" id="resultSubtitle">Стоимость доставки</div>
                    </div>
                    
                    <div class="result-details" id="resultDetails">
                        <!-- Детали будут добавлены через JavaScript -->
                    </div>
                    
                    <div class="result-actions">
                        <a href="tel:+79162720932" class="btn-result btn-primary-result">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                            </svg>
                            Заказать доставку
                        </a>
                        <button type="button" class="btn-result btn-secondary-result" id="newCalculation">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>
                            </svg>
                            Новый расчет
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
EOF

    # Ищем старый калькулятор и заменяем его
    # Сначала ищем секцию с id="calculator"
    if grep -q 'id="calculator"' "$file"; then
        # Находим начало и конец старого калькулятора
        start_line=$(grep -n 'id="calculator"' "$file" | head -1 | cut -d: -f1)
        if [ -n "$start_line" ]; then
            # Ищем конец секции (следующую секцию или footer)
            end_line=$(awk -v start="$start_line" 'NR > start && /^[[:space:]]*<section/ {print NR-1; exit}' "$file")
            if [ -z "$end_line" ]; then
                end_line=$(awk -v start="$start_line" 'NR > start && /^[[:space:]]*<footer/ {print NR-1; exit}' "$file")
            fi
            if [ -z "$end_line" ]; then
                end_line=$(wc -l < "$file")
            fi
            
            # Создаем временный файл
            head -n $((start_line-1)) "$file" > /tmp/temp_file.html
            cat /tmp/new_calculator.html >> /tmp/temp_file.html
            tail -n +$((end_line+1)) "$file" >> /tmp/temp_file.html
            mv /tmp/temp_file.html "$file"
        fi
    else
        echo "⚠️  Калькулятор не найден в $file"
    fi
}

# Функция для добавления JavaScript файлов
add_calculator_js() {
    local file="$1"
    echo "📝 Добавляю JavaScript в $file..."
    
    # Добавляем JS файлы перед закрывающим тегом body
    sed -i '/<\/body>/i\    <script src="assets/js/smart-calculator-v2.js?v=20250813-fixed" async></script>\n    <script src="assets/js/calculator-ui.js?v=20250813-new" async></script>' "$file"
}

# Функция для обновления hero секции
update_hero_section() {
    local file="$1"
    echo "🎨 Обновляю hero секцию в $file..."
    
    # Ищем hero секцию и добавляем hero-content wrapper
    sed -i '/<section.*hero.*>/,/<div class="container">/ {
        /<div class="container">/a\
        <div class="hero-content">
        /<\/div>/ {
            /<\/div>/a\
        </div>
        }
    }' "$file"
}

# Основной цикл обновления
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "🔄 Обрабатываю $page..."
        
        # Создаем резервную копию
        cp "$page" "${page}.backup"
        
        # Добавляем CSS
        add_calculator_css "$page"
        
        # Заменяем калькулятор
        replace_calculator "$page"
        
        # Добавляем JavaScript
        add_calculator_js "$page"
        
        # Обновляем hero секцию
        update_hero_section "$page"
        
        echo "✅ $page обновлен"
    else
        echo "❌ Файл $page не найден"
    fi
done

# Очищаем временные файлы
rm -f /tmp/new_calculator.html

echo "🎉 Обновление завершено!"
echo "📁 Резервные копии сохранены с расширением .backup"
echo "🚀 Готово к деплою: ./deploy-ssh-key.sh"
