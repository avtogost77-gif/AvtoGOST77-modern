# 🚀 Решение проблем производительности Cursor

## 🔥 Твои симптомы:
- net::ERR_BLOCKED_BY_CLIENT 
- Content Security Policy блокировки
- HTTP 499/500 ошибки
- Медленная работа на Intel Pentium Silver N5000

## 💊 Решения:

### 1. Отключи защиту в реальном времени (временно):
```bash
# Windows Defender
# Открой PowerShell от админа:
Set-MpPreference -DisableRealtimeMonitoring $true

# Добавь Cursor в исключения:
Add-MpPreference -ExclusionPath "C:\Users\[твой_юзер]\AppData\Local\Programs\cursor"
```

### 2. Проверь настройки прокси:
```bash
# В Git Bash:
git config --global --unset http.proxy
git config --global --unset https.proxy

# Проверь системные настройки:
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

### 3. Оптимизация Cursor для слабого ПК:

#### В настройках Cursor (Ctrl+,):
- **Отключи телеметрию**: Settings → Telemetry → Disable all
- **Отключи автообновления**: Settings → Update → Manual
- **Уменьши количество воркеров**: Settings → Extensions → Max Worker Processes: 1
- **Отключи GPU**: Settings → GPU → Disable Hardware Acceleration

#### В settings.json добавь:
```json
{
  "telemetry.telemetryLevel": "off",
  "workbench.enableExperiments": false,
  "extensions.autoUpdate": false,
  "update.mode": "manual",
  "search.followSymlinks": false,
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/dist/**": true,
    "**/build/**": true
  },
  "typescript.disableAutomaticTypeAcquisition": true,
  "git.autorefresh": false,
  "git.enabled": false,
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.value": 5
}
```

### 4. Очистка кэша Cursor:
```bash
# Windows - в PowerShell:
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Cache"
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\CachedData"
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Code Cache"
```

### 5. Альтернативный запуск:
```bash
# Запусти Cursor с отключенной песочницей:
cursor --no-sandbox --disable-gpu --disable-software-rasterizer
```

### 6. Для твоего процессора (Intel Pentium Silver N5000):

#### Системные оптимизации:
1. **Отключи Windows Search**: services.msc → Windows Search → Disabled
2. **Отключи Superfetch**: services.msc → SysMain → Disabled  
3. **Режим производительности**: Панель управления → Электропитание → Высокая производительность

#### Проверь фоновые процессы:
```bash
# PowerShell от админа:
Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name, CPU, WorkingSet
```

### 7. Радикальное решение:
Используй Cursor в браузере: https://cursor.sh/web
(Но это не идеально для локальной разработки)

## 🎯 Быстрый чеклист:
1. [ ] Отключи антивирус временно
2. [ ] Добавь Cursor в исключения
3. [ ] Очисти кэш
4. [ ] Примени настройки производительности
5. [ ] Перезапусти Cursor с флагами
6. [ ] Проверь улучшения

## 💡 Если ничего не помогло:
- Попробуй VS Code + Continue.dev (легче)
- Или используй локальные LLM через Ollama
- Или работай через SSH на мощном сервере