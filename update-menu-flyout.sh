#!/bin/bash

echo "🔄 ОБНОВЛЕНИЕ РАСПАШНОГО МЕНЮ..."

PAGES=(
    "index.html"
    "services.html"
    "contact.html"
    "about.html"
    "faq.html"
    "legal-minimum.html"
    "urgent-delivery.html"
    "perevozka-mebeli.html"
    "perevozka-medoborudovaniya.html"
    "transportnaya-kompaniya.html"
    "gazel-gruzoperevozki.html"
    "trehtonnik-gruzoperevozki.html"
    "pyatitonnik-gruzoperevozki.html"
    "desyatitonnik-gruzoperevozki.html"
    "fura-20-tonn-gruzoperevozki.html"
    "gruzoperevozki-spb.html"
    "gruzoperevozki-po-moskve.html"
    "gruzoperevozki-iz-moskvy.html"
    "gruzoperevozki-moskva-kazan.html"
    "gruzoperevozki-moskva-ekaterinburg.html"
    "gruzoperevozki-moskva-novosibirsk.html"
    "ftl-ltl-perevozki.html"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "📝 Обновляем $page..."
        sed -i '/<!-- Навигация -->/,/<\/nav>/c\                <!-- Навигация -->\n                <nav class="nav">\n                    <!-- Основные пункты (всегда видимы) -->\n                    <div class="nav-primary">\n                        <a href="#calculator" class="nav-link nav-link-primary">Калькулятор</a>\n                        <a href="services.html" class="nav-link nav-link-primary">Услуги</a>\n                        <a href="contact.html" class="nav-link nav-link-primary">Контакты</a>\n                    </div>\n                    <!-- Дополнительное меню (дропдаун) -->\n                    <div class="nav-secondary">\n                        <button class="nav-more-btn dropdown-toggle">\n                            Ещё <span class="nav-more-icon">▼</span>\n                        </button>\n                        <div class="nav-dropdown">\n                            <div class="nav-sections">\n                                <!-- Направления -->\n                                <div class="nav-section">\n                                    <h4 class="nav-section-title" data-section="directions">🗺️ Направления</h4>\n                                    <div class="nav-submenu" id="directions-submenu">\n                                        <a href="gruzoperevozki-spb.html" class="nav-link">🏙️ Москва-СПб</a>\n                                        <a href="gruzoperevozki-po-moskve.html" class="nav-link">🏙️ По Москве</a>\n                                        <a href="gruzoperevozki-iz-moskvy.html" class="nav-link">🚚 Из Москвы</a>\n                                        <a href="gruzoperevozki-moskva-kazan.html" class="nav-link">🏛️ Москва-Казань</a>\n                                        <a href="gruzoperevozki-moskva-ekaterinburg.html" class="nav-link">🏔️ Москва-Екатеринбург</a>\n                                        <a href="gruzoperevozki-moskva-novosibirsk.html" class="nav-link">🌲 Москва-Новосибирск</a>\n                                    </div>\n                                </div>\n                                <!-- Транспорт -->\n                                <div class="nav-section">\n                                    <h4 class="nav-section-title" data-section="transport">🚚 Транспорт</h4>\n                                    <div class="nav-submenu" id="transport-submenu">\n                                        <a href="gazel-gruzoperevozki.html" class="nav-link">🚐 Газель</a>\n                                        <a href="trehtonnik-gruzoperevozki.html" class="nav-link">🚚 3-тонник</a>\n                                        <a href="pyatitonnik-gruzoperevozki.html" class="nav-link">🚛 5-тонник</a>\n                                        <a href="desyatitonnik-gruzoperevozki.html" class="nav-link">🚛 10-тонник</a>\n                                        <a href="fura-20-tonn-gruzoperevozki.html" class="nav-link">🚛 Фура 20т</a>\n                                    </div>\n                                </div>\n                                <!-- Услуги -->\n                                <div class="nav-section">\n                                    <h4 class="nav-section-title" data-section="services">🚛 Услуги</h4>\n                                    <div class="nav-submenu" id="services-submenu">\n                                        <a href="urgent-delivery.html" class="nav-link">⚡ Срочная доставка</a>\n                                        <a href="perevozka-mebeli.html" class="nav-link">🪑 Перевозка мебели</a>\n                                        <a href="perevozka-medoborudovaniya.html" class="nav-link">🏥 Медоборудование</a>\n                                        <a href="transportnaya-kompaniya.html" class="nav-link">🏢 О компании</a>\n                                    </div>\n                                </div>\n                                <!-- Информация -->\n                                <div class="nav-section">\n                                    <h4 class="nav-section-title" data-section="info">ℹ️ Информация</h4>\n                                    <div class="nav-submenu" id="info-submenu">\n                                        <a href="about.html" class="nav-link">📋 О нас</a>\n                                        <a href="legal-minimum.html" class="nav-link">📋 Юр. минимум</a>\n                                        <a href="faq.html" class="nav-link">❓ FAQ</a>\n                                        <a href="blog/index.html" class="nav-link">📰 Блог</a>\n                                        <a href="ftl-ltl-perevozki.html" class="nav-link">📊 FTL vs LTL</a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </nav>' "$page"
        echo "✅ $page обновлен"
    else
        echo "⚠️  Файл $page не найден"
    fi
done

echo "🎉 ОБНОВЛЕНИЕ ЗАВЕРШЕНО!"
