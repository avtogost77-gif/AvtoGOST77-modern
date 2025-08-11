#!/bin/bash

echo "🔧 Добавление ID к секциям в self-employed-delivery.html..."

# Добавляем ID к секциям
sed -i 's/<section class="who-uses section" data-collapse="mobile">/<section id="who-uses" class="who-uses section" data-collapse="mobile">/g' self-employed-delivery.html
sed -i 's/<section class="quick-start section" data-collapse="mobile">/<section id="quick-start" class="quick-start section" data-collapse="mobile">/g' self-employed-delivery.html
sed -i 's/<section class="pricing section" data-collapse="mobile">/<section id="pricing" class="pricing section" data-collapse="mobile">/g' self-employed-delivery.html
sed -i 's/<section class="calculator-section section" data-collapse="mobile">/<section id="calculator" class="calculator-section section" data-collapse="mobile">/g' self-employed-delivery.html
sed -i 's/<section class="testimonials-section section" data-collapse="mobile">/<section id="testimonials" class="testimonials-section section" data-collapse="mobile">/g' self-employed-delivery.html
sed -i 's/<section class="faq-section section" data-collapse="mobile">/<section id="faq" class="faq-section section" data-collapse="mobile">/g' self-employed-delivery.html

echo "✅ ID добавлены к секциям!"
