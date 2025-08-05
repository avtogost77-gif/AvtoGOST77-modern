# 🔧 Руководство по устранению проблем с производительностью Cursor

## 🚨 Выявленные проблемы

### 1. Блокировка сетевых запросов
- **Симптомы**: `net::ERR_BLOCKED_BY_CLIENT` для множества доменов
- **Причины**: Ad-blocker, антивирус, firewall или расширения браузера

### 2. Нарушения Content Security Policy
- **Симптомы**: "Refused to connect... violates CSP directive"
- **Причины**: Строгие настройки безопасности или конфликты расширений

### 3. Таймауты соединений
- **Симптомы**: Status 499 (Client Closed Request)
- **Причины**: Медленное соединение, перегрузка системы

## ✅ Шаги по устранению

### Шаг 1: Проверка расширений браузера
1. Откройте Cursor в режиме инкогнито (Ctrl+Shift+N)
2. Если работает лучше - проблема в расширениях
3. Отключите по очереди:
   - Ad-blockers (AdBlock, uBlock Origin)
   - Privacy расширения (Privacy Badger, Ghostery)
   - VPN расширения
   - Антивирусные расширения

### Шаг 2: Настройка исключений
Добавьте в белый список вашего ad-blocker/firewall:
- `*.cursor.sh`
- `*.cursor.com`
- `featureassets.org`
- `statsigapi.net`
- `cloudflare-dns.com`
- `browser-intake-us5-datadoghq.com`

### Шаг 3: Проверка антивируса
1. Временно отключите антивирус
2. Добавьте Cursor в исключения:
   - Windows Defender: Настройки → Обновление и безопасность → Безопасность Windows → Защита от вирусов → Исключения
   - Другие антивирусы: добавьте папку Cursor в исключения

### Шаг 4: Сброс настроек Cursor
```bash
# Windows
%APPDATA%\Cursor\
# Удалите папки Cache, GPUCache, Code Cache

# Или полный сброс (ВНИМАНИЕ: удалит все настройки)
%APPDATA%\Cursor\
```

### Шаг 5: Оптимизация для слабого CPU
Для Intel Pentium Silver N5000:

1. **Отключите ненужные функции**:
   - File → Preferences → Settings
   - Поиск: "telemetry" → отключить
   - Поиск: "minimap" → отключить
   - Поиск: "breadcrumbs" → отключить

2. **Уменьшите нагрузку**:
   ```json
   {
     "editor.minimap.enabled": false,
     "editor.renderWhitespace": "none",
     "editor.renderIndentGuides": false,
     "editor.folding": false,
     "editor.lineNumbers": "off",
     "workbench.tree.indent": 4,
     "window.zoomLevel": 0,
     "extensions.autoUpdate": false,
     "telemetry.telemetryLevel": "off"
   }
   ```

3. **Отключите автосохранение**:
   - File → Preferences → Settings
   - Auto Save → off

### Шаг 6: Альтернативные решения

1. **Используйте другой браузер**:
   - Если Cursor встроенный браузер глючит, попробуйте desktop версию

2. **VPN/Proxy**:
   - Иногда помогает смена региона
   - Попробуйте отключить VPN если используете

3. **DNS**:
   - Смените DNS на Google (8.8.8.8) или Cloudflare (1.1.1.1)

## 🔍 Диагностика

### Проверка сети
```bash
# Проверка доступности сервисов
ping cursor.sh
ping featureassets.org
ping statsigapi.net

# Проверка DNS
nslookup cursor.sh
nslookup featureassets.org
```

### Проверка процессов
```bash
# Windows - проверка на майнеры/вирусы
tasklist /FI "MEMUSAGE gt 100000"
wmic process where "WorkingSetSize > 104857600" get Name,ProcessId,WorkingSetSize

# Проверка CPU usage
wmic cpu get loadpercentage
```

## 💡 Временные решения

1. **Работа офлайн**:
   - Многие функции Cursor работают без интернета
   - Отключите синхронизацию и телеметрию

2. **Легковесные альтернативы**:
   - VS Code с минимальными расширениями
   - Sublime Text для простых правок

3. **Оптимизация системы**:
   ```bash
   # Очистка временных файлов Windows
   cleanmgr /sagerun:1
   
   # Отключение ненужных служб
   services.msc → отключите ненужные службы
   ```

## 📞 Если ничего не помогает

1. Обратитесь в поддержку Cursor с этими логами
2. Попробуйте переустановить Cursor
3. Проверьте обновления Windows/драйверов
4. Рассмотрите апгрейд железа (особенно RAM и SSD)

---

**Примечание**: Ваш CPU (Pentium Silver N5000) действительно слабоват для современных IDE. Рекомендую минимум 8GB RAM и SSD для комфортной работы.