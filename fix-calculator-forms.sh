#!/bin/bash

echo "🔧 Обновляем формы калькулятора на всех новых страницах..."

# Список страниц для обновления
PAGES=(
    "trehtonnik-gruzoperevozki.html"
    "pyatitonnik-gruzoperevozki.html"
    "desyatitonnik-gruzoperevozki.html"
    "fura-20-tonn-gruzoperevozki.html"
    "gruzoperevozki-moskva-belgorod.html"
    "gruzoperevozki-moskva-tula.html"
)

# Новая форма калькулятора
NEW_FORM='            <!-- Калькулятор -->
            <section id="calculator">
                <h2>Калькулятор стоимости грузоперевозки</h2>
                <p>Рассчитайте точную стоимость за 30 секунд:</p>
                
                <form class="calculator-form" id="calculatorForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fromCity">Откуда</label>
                            <input type="text" 
                                   id="fromCity" 
                                   name="from" 
                                   placeholder="Введите город отправления" 
                                   data-address-type="from"
                                   autocomplete="off"
                                   required>
                            <div class="address-suggestions" data-for="from"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="toCity">Куда</label>
                            <input type="text" 
                                   id="toCity" 
                                   name="to" 
                                   placeholder="Введите город назначения"
                                   data-address-type="to"
                                   autocomplete="off"
                                   required>
                            <div class="address-suggestions" data-for="to"></div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="weight">Вес, кг</label>
                            <input type="number" id="weight" name="weight" placeholder="Вес груза" min="1" autocomplete="off" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="volume">Объем, м³</label>
                            <input type="number" id="volume" name="volume" placeholder="Если груз объемный, укажите объем" min="0" step="0.1" autocomplete="off">
                            <small class="form-text">
                                Если Ваш груз объемный или не запалетирован, введите объем или оставьте поле пустым для расчета с менеджером
                            </small>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" id="isConsolidated" name="isConsolidated">
                                <label for="isConsolidated" class="checkbox-label">
                                    <span class="checkbox-icon">📦</span>
                                    <span class="checkbox-text">
                                        <strong>Сборный груз</strong>
                                        <small>Экономия до 35%, срок доставки +30%</small>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary btn-lg" id="calculateButton">
                            <span class="btn-text">Рассчитать стоимость</span>
                            <span class="btn-loading" style="display: none;">Рассчитываем...</span>
                        </button>
                    </div>
                </form>
                
                <div id="calculatorResult" class="calculator-result"></div>
            </section>'

# Новые скрипты
NEW_SCRIPTS='    <!-- Scripts -->
    <script src="assets/js/main.js" defer></script>
    <script src="assets/js/ux-improvements.js" defer></script>
    <script src="assets/js/smart-calculator-v2.js" defer></script>'

for page in "${PAGES[@]}"; do
    echo "📄 Обновляем $page..."
    
    if [ -f "$page" ]; then
        # Создаем временный файл
        temp_file=$(mktemp)
        
        # Заменяем старую форму калькулятора на новую
        awk -v new_form="$NEW_FORM" '
        BEGIN { in_calculator = 0; in_old_form = 0; printed_form = 0; }
        
        /<!-- Калькулятор -->/ { 
            in_calculator = 1; 
            in_old_form = 0; 
            printed_form = 0; 
        }
        
        in_calculator && /<div class="calculator-form">/ { 
            in_old_form = 1; 
            print new_form; 
            printed_form = 1; 
            next; 
        }
        
        in_old_form && /<\/div>/ { 
            in_old_form = 0; 
            next; 
        }
        
        in_old_form { next; }
        
        /<!-- Scripts -->/ { 
            print new_scripts; 
            next; 
        }
        
        /<script src="assets\/js\/main\.js"/ { next; }
        /<script src="assets\/js\/ux-improvements\.js"/ { next; }
        /<script src="assets\/js\/smart-calculator-v2\.js"/ { next; }
        
        /function calculate/ { 
            in_old_script = 1; 
            next; 
        }
        
        in_old_script && /<\/script>/ { 
            in_old_script = 0; 
            next; 
        }
        
        in_old_script { next; }
        
        { print; }
        ' new_scripts="$NEW_SCRIPTS" "$page" > "$temp_file"
        
        # Заменяем оригинальный файл
        mv "$temp_file" "$page"
        
        echo "✅ $page обновлен"
    else
        echo "❌ Файл $page не найден"
    fi
done

echo "🎉 Обновление форм калькулятора завершено!"
