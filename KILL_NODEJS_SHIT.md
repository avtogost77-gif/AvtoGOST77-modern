# 🔥 ОПЕРАЦИЯ "УБИТЬ ГОВНО" - ЗАЧИСТКА СЕРВЕРА

## 💀 **ЧТО УБИВАЕМ:**
- Node.js процессы
- PM2 процессы 
- Next.js проекты
- JSON конфиги
- node_modules папки
- Статемы, ПМсы и прочее говно

---

## 🚫 **STEP 1: УБИВАЕМ ВСЕ ПРОЦЕССЫ**

```bash
# Убиваем все Node.js процессы
sudo pkill -f node
sudo pkill -f nodejs
sudo pkill -f npm
sudo pkill -f yarn
sudo pkill -f pnpm

# Убиваем PM2 нахрен
sudo pkill -f pm2
pm2 kill
pm2 delete all

# На всякий случай убиваем по портам
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
sudo fuser -k 8080/tcp
sudo fuser -k 8000/tcp
sudo fuser -k 5000/tcp

# Убиваем через системд если есть
sudo systemctl stop pm2*
sudo systemctl disable pm2*
```

---

## 🗑️ **STEP 2: УДАЛЯЕМ ФАЙЛЫ И ПАПКИ**

```bash
# Находим и уничтожаем все node_modules
find /www -name "node_modules" -type d -exec rm -rf {} +
find /var/www -name "node_modules" -type d -exec rm -rf {} +
find /home -name "node_modules" -type d -exec rm -rf {} +

# Убиваем Next.js проекты
find /www -name ".next" -type d -exec rm -rf {} +
find /var/www -name ".next" -type d -exec rm -rf {} +

# Удаляем package.json и связанное говно
find /www -name "package.json" -delete
find /www -name "package-lock.json" -delete
find /www -name "yarn.lock" -delete
find /www -name "tsconfig.json" -delete
find /www -name "next.config.js" -delete

# Убираем PM2 конфиги
rm -rf ~/.pm2
sudo rm -rf /root/.pm2
rm -f /etc/systemd/system/pm2*

# Чистим временные файлы
rm -rf /tmp/npm*
rm -rf /tmp/yarn*
rm -rf /tmp/.pm2*
```

---

## 🔍 **STEP 3: ПРОВЕРЯЕМ ЧТО УБИЛИ**

```bash
# Проверяем процессы
ps aux | grep -i node
ps aux | grep -i pm2
ps aux | grep -i next

# Проверяем порты
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080

# Проверяем остатки файлов
find /www -name "*node*" -type d
find /www -name "*next*" -type d
find /www -name "package*.json"
```

---

## 🚛 **STEP 4: ДЕПЛОИМ НАШУ КРАСОТУ**

```bash
# Переходим в папку сайта
cd /www/wwwroot/avtogost77.ru

# Удаляем старое говно если есть
rm -rf avtogost-site/
rm -rf node_modules/
rm -f package*.json

# Копируем наш оптимизированный HTML
# (файлы уже должны быть там, просто проверяем)

# Проверяем что всё на месте
ls -la
cat index.html | head -20

# Перезапускаем nginx
sudo systemctl reload nginx
```

---

## ✅ **STEP 5: ФИНАЛЬНАЯ ПРОВЕРКА**

```bash
# Проверяем что сайт работает
curl -I http://avtogost77.ru

# Проверяем что нет Node.js процессов
ps aux | grep node | grep -v grep

# Проверяем размер освобождённого места
df -h

echo "🎉 ГОВНО УНИЧТОЖЕНО! САЙТ РАБОТАЕТ НА ЧИСТОМ HTML!"
```

---

## 💡 **ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК:**

```bash
# Аварийное восстановление nginx
sudo systemctl restart nginx

# Проверка конфигурации nginx
sudo nginx -t

# Если нужно найти скрытые процессы
sudo lsof -i :3000
sudo netstat -tulpn | grep LISTEN
```

---

## 🎯 **РЕЗУЛЬТАТ:**
- ❌ Node.js - УБИТ
- ❌ PM2 - УНИЧТОЖЕН  
- ❌ Next.js - СТЁРТ
- ❌ JSON конфиги - УДАЛЕНЫ
- ✅ HTML сайт - РАБОТАЕТ
- ✅ Nginx - ЖИВОЙ
- ✅ Свободное место - ОСВОБОЖДЕНО

**МИССИЯ ВЫПОЛНЕНА!** 🔥💀