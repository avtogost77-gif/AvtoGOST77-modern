#!/bin/bash

# Создаем простой SVG favicon с логотипом грузовика
cat > favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#2563eb"/>
  <path d="M8 20h16v2H8zm0-4h12v2H8zm14-6H8v8h14V10zm2 0h2a2 2 0 012 2v4a2 2 0 01-2 2h-2V10z" fill="white"/>
  <circle cx="11" cy="24" r="2" fill="white"/>
  <circle cx="21" cy="24" r="2" fill="white"/>
</svg>
EOF

echo "✅ favicon.svg создан!"
echo "Теперь добавьте в <head> секцию index.html:"
echo '<link rel="icon" type="image/svg+xml" href="favicon.svg">'