# 🧹 ПЛАН ОЧИСТКИ РЕПОЗИТОРИЯ И ЗАЩИТЫ ОТ МУСОРА

## 📊 ТЕКУЩАЯ СИТУАЦИЯ:

### Найдено мусорных файлов:
- **6,540 SEO-страниц** с типами транспорта:
  - `fura-*.html` - 3,270 файлов
  - `gazelle-*.html` - 3,270 файлов
  - Варианты: обычные, `-nedorogo`, `-srochno`

### Почему это мусор:
1. **Дублирование контента** - одинаковые страницы
2. **Низкое качество** - сгенерированы массово
3. **Риск фильтров** от поисковиков
4. **Замедление работы** репозитория

## 🎯 ПЛАН ДЕЙСТВИЙ:

### ШАГ 1: СОЗДАЕМ .GITIGNORE ПРАВИЛА
```bash
# Запрещаем массовую генерацию
fura-*.html
gazelle-*.html
kamaz-*.html
tent-*.html
refrizherator-*.html
*-nedorogo.html
*-srochno.html
*-bistro.html
*-deshevo.html

# Временные файлы
*.tmp
*.bak
.DS_Store
Thumbs.db

# Логи генерации
generation-*.log
```

### ШАГ 2: УДАЛЯЕМ МУСОР ИЗ РЕПОЗИТОРИЯ
```bash
#!/bin/bash
# cleanup-garbage.sh

echo "🧹 Начинаем очистку репозитория..."

# Удаляем файлы транспорта
git rm -f fura-*.html
git rm -f gazelle-*.html

# Удаляем из истории git (опционально)
# git filter-branch --force --index-filter \
#   'git rm --cached --ignore-unmatch fura-*.html gazelle-*.html' \
#   --prune-empty --tag-name-filter cat -- --all

echo "✅ Очистка завершена!"
```

### ШАГ 3: ЗАЩИТА ОТ ПОВТОРНОЙ ГЕНЕРАЦИИ

#### A) Обновляем скрипты генерации:
```javascript
// В generate-enhanced.js добавляем проверку
const BANNED_PATTERNS = [
  /^fura-/,
  /^gazelle-/,
  /-nedorogo$/,
  /-srochno$/,
  /-deshevo$/
];

function isFileAllowed(filename) {
  return !BANNED_PATTERNS.some(pattern => pattern.test(filename));
}
```

#### B) Создаем whitelist для генерации:
```javascript
// allowed-routes.json
{
  "allowedCities": [
    "moskva", "sankt-peterburg", "novosibirsk",
    "ekaterinburg", "kazan", "nizhniy-novgorod"
  ],
  "allowedTypes": [
    "gruzoperevozki", "sbornye-gruzy", "dostavka"
  ],
  "maxPagesPerBatch": 20
}
```

### ШАГ 4: GITHUB ACTIONS ЗАЩИТА
```yaml
# .github/workflows/protection.yml
name: Protect from garbage

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check-files:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for banned files
        run: |
          banned=$(find . -name "fura-*.html" -o -name "gazelle-*.html" | wc -l)
          if [ $banned -gt 0 ]; then
            echo "❌ Найдены запрещенные файлы!"
            exit 1
          fi
          
      - name: Check file count
        run: |
          count=$(find . -name "*.html" | wc -l)
          if [ $count -gt 1000 ]; then
            echo "❌ Слишком много HTML файлов: $count"
            exit 1
          fi
```

## 🛡️ ИТОГОВАЯ ЗАЩИТА:

### 1. **На уровне Git:**
- `.gitignore` блокирует мусор
- Pre-commit хуки проверяют файлы
- GitHub Actions отклоняет PR с мусором

### 2. **На уровне генерации:**
- Whitelist разрешенных маршрутов
- Лимит 20 страниц за раз
- Проверка качества контента

### 3. **На уровне команды:**
- Только Opus генерирует SEO-страницы
- Universal-3000 в бане на генерацию
- Default фокусируется на функционале

## ✅ РЕЗУЛЬТАТ:

После очистки у нас будет:
- **~500 качественных страниц** вместо 10,000+ мусора
- **Быстрый репозиторий** без лишних файлов
- **Защита от повтора** на всех уровнях
- **SEO без рисков** фильтров

## 🚀 КОМАНДЫ ДЛЯ ЗАПУСКА:

```bash
# 1. Очистка
./scripts/cleanup-garbage.sh

# 2. Коммит
git commit -m "🧹 Удалил 6,540 мусорных SEO-страниц"

# 3. Push
git push origin main

# 4. Очистка истории (опционально)
git gc --aggressive --prune=now
```