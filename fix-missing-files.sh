#!/bin/bash

echo "🚨 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ НЕДОСТАЮЩИХ ФАЙЛОВ"
echo "=============================================="

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🔧 Загружаем недостающие CSS файлы..."

# Проверяем и загружаем aos.min.css в правильное место
if [ -f "assets/css/vendor/aos.min.css" ]; then
    scp -i $SSH_KEY assets/css/vendor/aos.min.css $VPS_HOST:$VPS_PATH/assets/css/vendor/
    echo "✅ aos.min.css загружен"
else
    echo "❌ aos.min.css не найден локально"
fi

echo "🔧 Загружаем недостающие JS файлы..."

# Загружаем aos.min.js в правильное место
if [ -f "assets/js/vendor/aos.min.js" ]; then
    scp -i $SSH_KEY assets/js/vendor/aos.min.js $VPS_HOST:$VPS_PATH/assets/js/vendor/
    echo "✅ aos.min.js загружен"
else
    echo "❌ aos.min.js не найден локально"
fi

# Загружаем jspdf.umd.min.js
if [ -f "assets/js/vendor/jspdf.umd.min.js" ]; then
    scp -i $SSH_KEY assets/js/vendor/jspdf.umd.min.js $VPS_HOST:$VPS_PATH/assets/js/vendor/
    echo "✅ jspdf.umd.min.js загружен"
else
    echo "❌ jspdf.umd.min.js не найден локально"
fi

echo "🔧 Создаем недостающие папки и файлы..."

# Создаем папку для JS dist файлов
ssh -i $SSH_KEY $VPS_HOST "mkdir -p $VPS_PATH/assets/js/dist"

# Загружаем optimizations.min.js если есть
if [ -f "assets/js/dist/optimizations.min.js" ]; then
    scp -i $SSH_KEY assets/js/dist/optimizations.min.js $VPS_HOST:$VPS_PATH/assets/js/dist/
    echo "✅ optimizations.min.js загружен"
else
    echo "❌ optimizations.min.js не найден локально"
fi

echo "🎨 Создаем недостающие SVG логотипы клиентов..."

# Создаем папку для клиентских логотипов
ssh -i $SSH_KEY $VPS_HOST "mkdir -p $VPS_PATH/assets/img/clients"

# Создаем простые SVG логотипы
ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/ozon-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#005baa\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"white\" font-family=\"Arial\" font-size=\"16\" font-weight=\"bold\">OZON</text>
</svg>
EOF"

ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/wildberries-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#cb11ab\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"white\" font-family=\"Arial\" font-size=\"14\" font-weight=\"bold\">Wildberries</text>
</svg>
EOF"

ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/yandex-market-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#ffdb4d\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"black\" font-family=\"Arial\" font-size=\"14\" font-weight=\"bold\">Я.Маркет</text>
</svg>
EOF"

ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/sber-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#21a038\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"white\" font-family=\"Arial\" font-size=\"16\" font-weight=\"bold\">СБЕР</text>
</svg>
EOF"

ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/ikea-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#0058a3\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"#ffda1a\" font-family=\"Arial\" font-size=\"16\" font-weight=\"bold\">IKEA</text>
</svg>
EOF"

ssh -i $SSH_KEY $VPS_HOST "cat > $VPS_PATH/assets/img/clients/lamoda-logo.svg << 'EOF'
<svg width=\"120\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"120\" height=\"40\" fill=\"#6667ab\" rx=\"8\"/>
  <text x=\"60\" y=\"24\" text-anchor=\"middle\" fill=\"white\" font-family=\"Arial\" font-size=\"14\" font-weight=\"bold\">LAMODA</text>
</svg>
EOF"

echo "🔧 Исправляем loading-states.js (дублирующий style)..."

# Исправляем проблему с дублирующим объявлением 'style'
ssh -i $SSH_KEY $VPS_HOST "sed -i 's/const style = /const loadingStyle = /g' $VPS_PATH/assets/js/loading-states.js"

echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/img/clients/*.svg"
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/js/loading-states.js"

echo "🔄 Перезапускаем nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl restart nginx"

echo ""
echo "✅ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
echo "========================="
echo "✅ SVG логотипы созданы"
echo "✅ loading-states.js исправлен"
echo "✅ Права доступа установлены"
echo "✅ Nginx перезапущен"
echo ""
echo "🌐 Проверяйте сайт: https://avtogost77.ru"
echo "🔍 Консоль должна быть чище!"


