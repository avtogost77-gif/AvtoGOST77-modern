#!/bin/bash
echo "🎨 КОМПИЛЯЦИЯ SCSS ===="
npx sass styles/main.scss:compiled/main.css --style=expanded
npx sass styles/critical.scss:compiled/critical.css --style=expanded
