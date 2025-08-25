#!/bin/bash
# Скрипт для исправления посадочной страницы блога

echo "🔧 Исправление посадочной страницы блога..."

# Создаем backup
cp blog/index.html blog/index.html.backup
echo "📁 Создан backup: blog/index.html.backup"

echo ""
echo "🔧 Этап 1: Исправление canonical URL..."

# Исправляем неправильный canonical URL
sed -i 's|<link rel="canonical" href="https://avtogost77.ru/">|<link rel="canonical" href="https://avtogost77.ru/blog/">|g' blog/index.html

echo ""
echo "🧹 Этап 2: Очистка Schema.org разметки..."

# Удаляем дублирующиеся BreadcrumbList
sed -i '/"@type": "BreadcrumbList"/,/}/d' blog/index.html

# Удаляем избыточную Organization разметку
sed -i '/"@type": "Organization"/,/}/d' blog/index.html

# Добавляем чистую Schema.org разметку
clean_schema='<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "АвтоГОСТ - Блог о грузоперевозках",
  "url": "https://avtogost77.ru/blog/",
  "description": "Экспертные статьи о грузоперевозках, логистике и транспорте"
}
</script>'

# Вставляем после первого script tag
sed -i '/<script type="application\/ld+json">/a\'"$clean_schema" blog/index.html

echo ""
echo "🔗 Этап 3: Добавление ссылок на новые статьи..."

# Добавляем ссылки на новые страницы городов
new_articles_section='                <!-- Новые статьи: Страницы городов -->
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Грузоперевозки Москва-Казань">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Направления</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../gruzoperevozki-moskva-kazan.html">Грузоперевозки Москва-Казань: быстрая доставка от 25₽/км</a></h2>
                        <p>Профессиональные грузоперевозки между Москвой и Казанью. Отдельные машины и сборные отправления. Калькулятор стоимости онлайн.</p>
                        <a href="../gruzoperevozki-moskva-kazan.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Грузоперевозки Москва-Екатеринбург">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Направления</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../gruzoperevozki-moskva-ekaterinburg.html">Грузоперевозки Москва-Екатеринбург: надежная доставка грузов</a></h2>
                        <p>Грузоперевозки между Москвой и Екатеринбургом. Негабаритные грузы, промышленное оборудование, сборные отправления.</p>
                        <a href="../gruzoperevozki-moskva-ekaterinburg.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Грузоперевозки Москва-Новосибирск">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Направления</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../gruzoperevozki-moskva-novosibirsk.html">Грузоперевозки Москва-Новосибирск: доставка в Сибирь</a></h2>
                        <p>Доставка грузов из Москвы в Новосибирск. Дальние перевозки, специальные условия, отслеживание транспорта.</p>
                        <a href="../gruzoperevozki-moskva-novosibirsk.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>'

# Вставляем новые статьи после существующих
sed -i '/<!-- Статья 7: Как заказать Газель -->/a\'"$new_articles_section" blog/index.html

echo ""
echo "📝 Этап 4: Обновление дат..."

# Обновляем даты на актуальные
sed -i 's/1 января 2025/25 августа 2025/g' blog/index.html

echo ""
echo "🎨 Этап 5: Добавление ссылок на актуальные статьи блога..."

# Добавляем ссылки на актуальные статьи блога
blog_articles_section='                <!-- Актуальные статьи блога -->
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Подвел перевозчик">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Советы</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../blog-1-carrier-failed.html">Подвел перевозчик: что делать? Пошаговая инструкция 2025</a></h2>
                        <p>Что делать, если подвел перевозчик? Пошаговый план действий для спасения ситуации и поиска замены за 2 часа.</p>
                        <a href="../blog-1-carrier-failed.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Доставка на Wildberries">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Маркетплейсы</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../blog-2-wildberries-delivery.html">Доставка товара на склад Wildberries: полный гайд поставщика</a></h2>
                        <p>Подробная инструкция по доставке товаров на склады Wildberries. Требования, документы, штрафы и практические советы.</p>
                        <a href="../blog-2-wildberries-delivery.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="../assets/img/hero-logistics.webp" alt="Спот-заявки">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-category">Услуги</span>
                            <span class="blog-date">25 августа 2025</span>
                        </div>
                        <h2><a href="../blog-3-spot-orders.html">Спот-заявки для экстренных доставок: как это работает</a></h2>
                        <p>Спот-заявки для срочных грузоперевозок. Как заказать транспорт за 2 часа, особенности и преимущества услуги.</p>
                        <a href="../blog-3-spot-orders.html" class="blog-read-more">Читать далее →</a>
                    </div>
                </article>'

# Вставляем статьи блога после новых статей городов
sed -i '/<!-- Новые статьи: Страницы городов -->/a\'"$blog_articles_section" blog/index.html

echo ""
echo "✅ Исправления завершены!"
echo "📊 Что исправлено:"
echo "   - ✅ Исправлен canonical URL"
echo "   - ✅ Очищена Schema.org разметка"
echo "   - ✅ Добавлены ссылки на новые страницы городов"
echo "   - ✅ Добавлены ссылки на актуальные статьи блога"
echo "   - ✅ Обновлены даты на 2025 год"
echo ""
echo "�� Готово к деплою!"
