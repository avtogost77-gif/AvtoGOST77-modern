# 🤖 ИНСТРУКЦИЯ ПО ЗАПУСКУ TELEGRAM БОТА

## 📋 ШАГ 1: ПОДГОТОВКА VPS

```bash
# Подключаемся к VPS
ssh root@193.160.208.183

# Переходим в папку проекта
cd /var/www/avtogost77

# Проверяем что файл есть
ls -la father_bot.py

# Делаем файл исполняемым
chmod +x father_bot.py
```

## 📦 ШАГ 2: УСТАНОВКА ЗАВИСИМОСТЕЙ

```bash
# Обновляем пакеты
apt update

# Устанавливаем pip для Python 3
apt install python3-pip -y

# Устанавливаем aiogram
pip3 install aiogram

# Проверяем установку
python3 -c "import aiogram; print('✅ aiogram установлен!')"
```

## 🔧 ШАГ 3: ТЕСТОВЫЙ ЗАПУСК

```bash
# Запускаем бота в тестовом режиме
python3 father_bot.py

# Должны увидеть:
# 🚀 Запускаем умного @father_bot!

# Проверяем в Telegram:
# 1. Находим @avtogost77_bot
# 2. Пишем /start
# 3. Проходим расчет

# Останавливаем тест: Ctrl+C
```

## 🚀 ШАГ 4: СОЗДАНИЕ SYSTEMD СЕРВИСА

```bash
# Создаем файл сервиса
nano /etc/systemd/system/avtogost_bot.service
```

Вставляем содержимое:
```ini
[Unit]
Description=AvtoGOST Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/avtogost77
ExecStart=/usr/bin/python3 /var/www/avtogost77/father_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Сохраняем: Ctrl+X, Y, Enter

## 🔨 ШАГ 5: ЗАПУСК СЕРВИСА

```bash
# Перезагружаем systemd
systemctl daemon-reload

# Включаем автозапуск
systemctl enable avtogost_bot

# Запускаем бота
systemctl start avtogost_bot

# Проверяем статус
systemctl status avtogost_bot

# Должно быть: Active: active (running)
```

## 📊 ШАГ 6: МОНИТОРИНГ

```bash
# Смотрим логи бота
journalctl -u avtogost_bot -f

# Проверяем что бот работает
ps aux | grep father_bot

# Статистика использования
systemctl status avtogost_bot
```

## 🛠️ УПРАВЛЕНИЕ БОТОМ

```bash
# Остановить бота
systemctl stop avtogost_bot

# Перезапустить бота
systemctl restart avtogost_bot

# Посмотреть последние логи
journalctl -u avtogost_bot -n 50
```

## ⚠️ ВОЗМОЖНЫЕ ПРОБЛЕМЫ

### Ошибка "Module not found":
```bash
pip3 install --upgrade aiogram
```

### Ошибка "Connection refused":
- Проверить токен бота в father_bot.py
- Проверить интернет на VPS

### Бот не отвечает:
```bash
# Проверяем процесс
systemctl status avtogost_bot

# Смотрим ошибки
journalctl -u avtogost_bot -n 100
```

## ✅ ПРОВЕРКА РАБОТЫ

1. **В Telegram:**
   - Найти @avtogost77_bot
   - Написать /start
   - Пройти весь расчет
   - Проверить что заявка пришла менеджеру

2. **На сервере:**
   ```bash
   # Бот запущен?
   systemctl is-active avtogost_bot
   
   # Сколько памяти использует?
   ps aux | grep father_bot
   ```

## 🎯 ГОТОВО!

Теперь у вас работает:
- ✅ Telegram бот @avtogost77_bot
- ✅ Автозапуск при перезагрузке
- ✅ Автоперезапуск при сбоях
- ✅ Логирование всех событий

**Не забудьте добавить ссылку на бота на сайт!** 🚀