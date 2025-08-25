#!/bin/bash
# Скрипт для мониторинга индексации новых страниц

echo "📊 Мониторинг индексации новых страниц..."

# Массив новых страниц для мониторинга
new_pages=(
    "gruzoperevozki-moskva-kazan.html"
    "gruzoperevozki-moskva-nizhny-novgorod.html"
    "gruzoperevozki-moskva-rostov.html"
    "gruzoperevozki-moskva-samara.html"
    "gruzoperevozki-moskva-ufa.html"
    "gruzoperevozki-moskva-ekaterinburg.html"
    "gruzoperevozki-moskva-novosibirsk.html"
    "gruzoperevozki-moskva-krasnodar.html"
    "gruzoperevozki-moskva-chelyabinsk.html"
    "gruzoperevozki-moskva-omsk.html"
    "gruzoperevozki-moskva-perm.html"
)

# Массив статей блога для мониторинга
blog_articles=(
    "blog-1-carrier-failed.html"
    "blog-2-wildberries-delivery.html"
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
    "blog-5-logistics-optimization.html"
    "blog-6-marketplace-insider.html"
    "blog-7-how-to-order-gazelle.html"
    "blog-8-cargo-insurance.html"
    "blog-9-dangerous-goods.html"
    "blog-10-self-employed-logistics.html"
)

echo ""
echo "🔍 Проверка доступности новых страниц..."

# Проверяем доступность новых страниц
for page in "${new_pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/$page")
    if [ "$status" = "200" ]; then
        echo "   ✅ $page - доступна (HTTP $status)"
    else
        echo "   ❌ $page - недоступна (HTTP $status)"
    fi
done

echo ""
echo "🔍 Проверка доступности статей блога..."

# Проверяем доступность статей блога
for article in "${blog_articles[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/$article")
    if [ "$status" = "200" ]; then
        echo "   ✅ $article - доступна (HTTP $status)"
    else
        echo "   ❌ $article - недоступна (HTTP $status)"
    fi
done

echo ""
echo "🗺️ Проверка sitemap.xml..."

# Проверяем sitemap
sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/sitemap.xml")
if [ "$sitemap_status" = "200" ]; then
    echo "   ✅ sitemap.xml - доступен (HTTP $sitemap_status)"
    
    # Проверяем наличие новых страниц в sitemap
    echo "   📋 Проверяем наличие новых страниц в sitemap..."
    for page in "${new_pages[@]}"; do
        if curl -s "https://avtogost77.ru/sitemap.xml" | grep -q "$page"; then
            echo "      ✅ $page - есть в sitemap"
        else
            echo "      ❌ $page - НЕТ в sitemap"
        fi
    done
else
    echo "   ❌ sitemap.xml - недоступен (HTTP $sitemap_status)"
fi

echo ""
echo "🔍 Проверка robots.txt..."

# Проверяем robots.txt
robots_status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/robots.txt")
if [ "$robots_status" = "200" ]; then
    echo "   ✅ robots.txt - доступен (HTTP $robots_status)"
    
    # Проверяем наличие sitemap в robots.txt
    if curl -s "https://avtogost77.ru/robots.txt" | grep -q "sitemap"; then
        echo "      ✅ Sitemap указан в robots.txt"
    else
        echo "      ❌ Sitemap НЕ указан в robots.txt"
    fi
else
    echo "   ❌ robots.txt - недоступен (HTTP $robots_status)"
fi

echo ""
echo "📊 Создание отчета о мониторинге..."

# Создаем отчет
report_file="indexing-monitor-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$report_file" << EOF
# 📊 ОТЧЕТ О МОНИТОРИНГЕ ИНДЕКСАЦИИ

**Дата проверки:** $(date)  
**Статус:** Мониторинг завершен

---

## 🌐 **ДОСТУПНОСТЬ СТРАНИЦ**

### **Новые страницы городов (11 штук):**
EOF

for page in "${new_pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/$page")
    if [ "$status" = "200" ]; then
        echo "- ✅ **$page** - доступна (HTTP $status)" >> "$report_file"
    else
        echo "- ❌ **$page** - недоступна (HTTP $status)" >> "$report_file"
    fi
done

cat >> "$report_file" << EOF

### **Статьи блога (10 штук):**
EOF

for article in "${blog_articles[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://avtogost77.ru/$article")
    if [ "$status" = "200" ]; then
        echo "- ✅ **$article** - доступна (HTTP $status)" >> "$report_file"
    else
        echo "- ❌ **$article** - недоступна (HTTP $status)" >> "$report_file"
    fi
done

cat >> "$report_file" << EOF

---

## 🗺️ **SITEMAP И ROBOTS.TXT**

### **Sitemap.xml:**
- **Статус:** $(if [ "$sitemap_status" = "200" ]; then echo "✅ Доступен"; else echo "❌ Недоступен"; fi) (HTTP $sitemap_status)

### **Robots.txt:**
- **Статус:** $(if [ "$robots_status" = "200" ]; then echo "✅ Доступен"; else echo "❌ Недоступен"; fi) (HTTP $robots_status)

---

## 🎯 **РЕКОМЕНДАЦИИ**

### **Немедленно:**
1. 📤 **Отправить sitemap** в Google Search Console
2. 📤 **Отправить sitemap** в Yandex.Webmaster
3. 🔍 **Проверить индексацию** через неделю

### **На этой неделе:**
1. 📊 **Мониторить позиции** по ключевым запросам
2. 📈 **Отслеживать трафик** на новые страницы
3. 🔗 **Проверить внутренние ссылки**

### **В следующем месяце:**
1. 📈 **Анализ эффективности** новых страниц
2. 🎯 **Корректировка SEO-стратегии**
3. 📝 **Создание дополнительного контента**

---

## 📈 **ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ**

### **Через 1-2 недели:**
- 🔍 **Индексация** новых страниц в поисковых системах
- 📊 **Первые позиции** по НЧ запросам
- 🎯 **Первые переходы** на новые страницы

### **Через 1 месяц:**
- 📈 **+200% органического трафика**
- 🎯 **+15-20 запросов** в топ-10
- 💰 **Первые заказы** через новые страницы

---

*Отчет создан: $(date)*  
*Следующая проверка: через неделю*
EOF

echo "📄 Отчет сохранен: $report_file"

echo ""
echo "✅ Мониторинг завершен!"
echo "📊 Результаты:"
echo "   - Проверено новых страниц: ${#new_pages[@]}"
echo "   - Проверено статей блога: ${#blog_articles[@]}"
echo "   - Создан отчет: $report_file"
echo ""
echo "🚀 Рекомендации:"
echo "   1. Отправить sitemap в поисковые системы"
echo "   2. Проверить индексацию через неделю"
echo "   3. Мониторить позиции по ключевым запросам"
