# 🔒 Установка SSL сертификата Let's Encrypt

## Быстрая установка на VPS:

```bash
# 1. Подключись к VPS
ssh root@193.160.208.183

# 2. Установи Certbot
apt update
apt install certbot python3-certbot-nginx -y

# 3. Получи сертификат
certbot --nginx -d avtogost77.ru -d www.avtogost77.ru

# При запросе укажи:
# - Email для уведомлений
# - Согласись с условиями (A)
# - Можешь отказаться от рассылки (N)
# - Выбери redirect HTTP to HTTPS (2)

# 4. Проверь автообновление
certbot renew --dry-run

# 5. Готово! Проверь:
# https://avtogost77.ru
```

## Что произойдет:
- ✅ Certbot автоматически настроит nginx
- ✅ Добавит redirect с HTTP на HTTPS  
- ✅ Сертификат будет обновляться автоматически
- ✅ Сайт получит зеленый замочек

## Альтернатива (если DNS еще не обновился):
```bash
# Используй опцию --standalone
systemctl stop nginx
certbot certonly --standalone -d avtogost77.ru -d www.avtogost77.ru
systemctl start nginx

# Затем вручную добавь в nginx конфиг:
nano /etc/nginx/sites-available/avtogost77
```

Добавь в server блок:
```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/avtogost77.ru/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/avtogost77.ru/privkey.pem;
include /etc/letsencrypt/options-ssl-nginx.conf;
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name avtogost77.ru www.avtogost77.ru;
    return 301 https://$server_name$request_uri;
}
```

## Проверка SSL:
- https://www.ssllabs.com/ssltest/analyze.html?d=avtogost77.ru
- Должна быть оценка A или A+

## 🎯 Это займет 5 минут и сайт станет безопасным!