# 🚨 СРОЧНО: Исправление 502 ошибки для robots.txt

## Проблема
robots.txt отдает 502 Bad Gateway

## Решение на VPS:

```bash
# 1. Подключись к VPS
ssh root@193.160.208.183

# 2. Проверь есть ли robots.txt
cd /var/www/avtogost77
ls -la robots.txt

# 3. Если файла нет - создай
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /assets/js/
Disallow: /test/
Disallow: *.json
Disallow: *.md

User-agent: Yandex
Allow: /
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term

Sitemap: https://avtogost77.ru/sitemap.xml
EOF

# 4. Установи правильные права
chmod 644 robots.txt

# 5. Проверь nginx конфиг для robots.txt
nano /etc/nginx/sites-available/avtogost77
```

Добавь в конфиг nginx (если нет):
```nginx
location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
}
```

```bash
# 6. Проверь и перезагрузи nginx
nginx -t
systemctl reload nginx

# 7. Проверь работает ли
curl localhost/robots.txt
```

## Проверка
http://avtogost77.ru/robots.txt - должен открываться!
```

**Это критично исправить!** robots.txt нужен для поисковиков!