#!/bin/bash
# 🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА VPS ДЛЯ АВТОГОСТ77
# Запускать от root на свежем Ubuntu 22.04

set -e  # Останавливаемся при ошибках

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 НАЧИНАЕМ НАСТРОЙКУ VPS ДЛЯ АВТОГОСТ77${NC}"
echo "======================================"

# 1. Обновление системы
echo -e "\n${YELLOW}📦 Обновляем систему...${NC}"
apt update && apt upgrade -y

# 2. Установка базового ПО
echo -e "\n${YELLOW}🔧 Устанавливаем необходимое ПО...${NC}"
apt install -y \
    nginx \
    certbot python3-certbot-nginx \
    git curl wget htop ncdu \
    zip unzip \
    fail2ban \
    ufw \
    redis-server \
    nodejs npm \
    python3 python3-pip python3-venv

# 3. Настройка файрвола
echo -e "\n${YELLOW}🔒 Настраиваем файрвол...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 4. Создание пользователя
echo -e "\n${YELLOW}👤 Создаем пользователя avtogost...${NC}"
if ! id -u avtogost > /dev/null 2>&1; then
    adduser --gecos "" --disabled-password avtogost
    usermod -aG sudo avtogost
    echo "avtogost ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
fi

# 5. Настройка директорий
echo -e "\n${YELLOW}📁 Создаем директории...${NC}"
mkdir -p /var/www/avtogost77
chown -R avtogost:avtogost /var/www/avtogost77

# 6. Базовая конфигурация Nginx
echo -e "\n${YELLOW}🌐 Настраиваем Nginx...${NC}"
cat > /etc/nginx/sites-available/avtogost77.ru << 'EOF'
server {
    listen 80;
    server_name avtogost77.ru www.avtogost77.ru;
    root /var/www/avtogost77;
    index index.html;

    # SSI для инклудов
    ssi on;
    
    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
    
    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Кеширование статики
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Блокируем доступ к скрытым файлам
    location ~ /\. {
        deny all;
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Лимиты для защиты от DDoS
    limit_req_zone $binary_remote_addr zone=one:10m rate=30r/m;
    location /api/ {
        limit_req zone=one burst=5;
    }
}
EOF

# Активируем сайт
ln -sf /etc/nginx/sites-available/avtogost77.ru /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 7. Оптимизация Nginx
echo -e "\n${YELLOW}⚡ Оптимизируем Nginx...${NC}"
cat > /etc/nginx/conf.d/optimization.conf << 'EOF'
# Оптимизация производительности
client_max_body_size 50M;
keepalive_timeout 65;
server_tokens off;

# Кеширование открытых файлов
open_file_cache max=2000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
open_file_cache_errors on;

# Gzip
gzip_comp_level 6;
gzip_proxied any;
EOF

# 8. Настройка Redis
echo -e "\n${YELLOW}💾 Настраиваем Redis...${NC}"
sed -i 's/^# maxmemory <bytes>/maxmemory 256mb/' /etc/redis/redis.conf
sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
systemctl restart redis-server

# 9. Создание swap файла (если нет)
echo -e "\n${YELLOW}💿 Проверяем swap...${NC}"
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 10. Настройка автообновлений безопасности
echo -e "\n${YELLOW}🔐 Настраиваем автообновления...${NC}"
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# 11. Создание структуры для бота
echo -e "\n${YELLOW}🤖 Подготавливаем окружение для бота...${NC}"
mkdir -p /opt/avtogost77/bot
chown -R avtogost:avtogost /opt/avtogost77

# 12. Настройка systemd для бота
cat > /etc/systemd/system/father_bot.service << 'EOF'
[Unit]
Description=AvtoGOST77 Telegram Bot
After=network.target

[Service]
Type=simple
User=avtogost
WorkingDirectory=/opt/avtogost77/bot
ExecStart=/usr/bin/python3 /opt/avtogost77/bot/father_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 13. Создание скрипта бэкапа
echo -e "\n${YELLOW}💾 Создаем скрипт бэкапа...${NC}"
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
# Ежедневный бэкап
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Бэкап сайта
tar -czf $BACKUP_DIR/avtogost77-$DATE.tar.gz /var/www/avtogost77/

# Бэкап конфигов
tar -czf $BACKUP_DIR/configs-$DATE.tar.gz /etc/nginx/ /opt/avtogost77/

# Удаляем старые бэкапы (старше 7 дней)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF
chmod +x /opt/backup.sh

# Добавляем в cron
echo "0 3 * * * /opt/backup.sh" | crontab -

# 14. Перезапуск сервисов
echo -e "\n${YELLOW}🔄 Перезапускаем сервисы...${NC}"
nginx -t && systemctl restart nginx
systemctl enable redis-server
systemctl enable fail2ban

# 15. Финальная информация
echo -e "\n${GREEN}✅ БАЗОВАЯ НАСТРОЙКА ЗАВЕРШЕНА!${NC}"
echo -e "\n${YELLOW}📋 ЧТО ДАЛЬШЕ:${NC}"
echo "1. Перенесите файлы сайта в /var/www/avtogost77/"
echo "2. Настройте DNS записи на IP этого сервера"
echo "3. Запустите certbot для получения SSL:"
echo "   certbot --nginx -d avtogost77.ru -d www.avtogost77.ru"
echo "4. Скопируйте father_bot.py в /opt/avtogost77/bot/"
echo "5. Установите зависимости бота и запустите его"

echo -e "\n${GREEN}🚀 Сервер готов к работе!${NC}"

# Показываем IP адрес
IP=$(curl -s ifconfig.me)
echo -e "\n${YELLOW}IP адрес сервера: ${GREEN}$IP${NC}"