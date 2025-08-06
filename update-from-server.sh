#!/bin/bash

echo "📥 Скачиваем последний деплой с GitHub..."

# Скачиваем архив
wget https://raw.githubusercontent.com/avtogost77-gif/AvtoGOST77-modern/main/avtogost-deploy-20250806-094949.zip

# Распаковываем во временную папку
unzip -q avtogost-deploy-20250806-094949.zip -d temp-deploy

# Копируем только нужные файлы (без routes/industries/calculators)
echo "📄 Обновляем основные страницы..."
cp temp-deploy/avtogost-deploy-20250806-094949/index.html .
cp temp-deploy/avtogost-deploy-20250806-094949/about.html .
cp temp-deploy/avtogost-deploy-20250806-094949/services.html .
cp temp-deploy/avtogost-deploy-20250806-094949/contact.html .
cp temp-deploy/avtogost-deploy-20250806-094949/help.html .
cp temp-deploy/avtogost-deploy-20250806-094949/faq.html .
cp temp-deploy/avtogost-deploy-20250806-094949/privacy.html .
cp temp-deploy/avtogost-deploy-20250806-094949/terms.html .
cp temp-deploy/avtogost-deploy-20250806-094949/track.html .
cp temp-deploy/avtogost-deploy-20250806-094949/404.html .

echo "📝 Обновляем блог..."
cp temp-deploy/avtogost-deploy-20250806-094949/blog-*.html .
mkdir -p blog
cp temp-deploy/avtogost-deploy-20250806-094949/blog/index.html blog/

echo "🆕 Обновляем новые страницы..."
cp temp-deploy/avtogost-deploy-20250806-094949/transportnaya-kompaniya.html .
cp temp-deploy/avtogost-deploy-20250806-094949/sbornye-gruzy.html .
cp temp-deploy/avtogost-deploy-20250806-094949/dostavka-na-marketpleysy.html .
cp temp-deploy/avtogost-deploy-20250806-094949/rc-dostavka.html .
cp temp-deploy/avtogost-deploy-20250806-094949/gruzoperevozki-*.html .
cp temp-deploy/avtogost-deploy-20250806-094949/logistika-dlya-biznesa.html .
cp temp-deploy/avtogost-deploy-20250806-094949/urgent-delivery.html .
cp temp-deploy/avtogost-deploy-20250806-094949/self-employed-delivery.html .
cp temp-deploy/avtogost-deploy-20250806-094949/ip-small-business-delivery.html .

echo "⚙️ Обновляем конфиги..."
cp temp-deploy/avtogost-deploy-20250806-094949/.htaccess .
cp temp-deploy/avtogost-deploy-20250806-094949/robots.txt .
cp temp-deploy/avtogost-deploy-20250806-094949/sitemap.xml .
cp temp-deploy/avtogost-deploy-20250806-094949/manifest.json .
cp temp-deploy/avtogost-deploy-20250806-094949/browserconfig.xml .
cp temp-deploy/avtogost-deploy-20250806-094949/favicon.svg .
cp temp-deploy/avtogost-deploy-20250806-094949/sw.js .

echo "🎨 Обновляем assets..."
cp -r temp-deploy/avtogost-deploy-20250806-094949/assets .

echo "📡 Обновляем фиды..."
cp temp-deploy/avtogost-deploy-20250806-094949/*.xml .
cp temp-deploy/avtogost-deploy-20250806-094949/*.yml .
cp temp-deploy/avtogost-deploy-20250806-094949/*.json .

# Очищаем
rm -rf temp-deploy
rm avtogost-deploy-20250806-094949.zip

echo "✅ Готово! Обновлено файлов: $(ls -la *.html | wc -l)"