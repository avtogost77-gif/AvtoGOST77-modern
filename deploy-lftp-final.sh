#!/bin/bash

set -e

echo "🚀 Начинаю деплой АвтоГОСТ…"

# ────────────────────────────────────────────────
# 1.  Выбираем самый свежий ZIP-архив
# ────────────────────────────────────────────────
ARCHIVE=$(ls -t AVTOGOST-CLEAN-DEPLOY-*.zip 2>/dev/null | head -n1)
if [[ -z "$ARCHIVE" ]]; then
  echo "❌ Архив AVTOGOST-CLEAN-DEPLOY-*.zip не найден. Останавливаю деплой."
  exit 1
fi

echo "📦 Распаковка архива $ARCHIVE…"
rm -rf temp_deploy
unzip -q "$ARCHIVE" -d temp_deploy

# ────────────────────────────────────────────────
# 2.  Проверяем FTP-подключение до любых операций
# ────────────────────────────────────────────────
FTP_CHECK_CMD="open -u \"$FTP_USER\",\"$FTP_PASS\" \"$FTP_HOST\"; cls; bye"

echo "🔌 Проверка FTP-соединения…"
if ! lftp -e "set net:max-retries 1; set net:timeout 5; $FTP_CHECK_CMD" >/dev/null 2>&1; then
  echo "❌ Не удалось подключиться к FTP ($FTP_HOST). Деплой прерван."
  rm -rf temp_deploy
  exit 1
fi

echo "✅ Соединение установлено. Загружаем файлы…"

# ────────────────────────────────────────────────
# 3.  Основная загрузка через lftp mirror
# ────────────────────────────────────────────────
lftp -e "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 2
set net:reconnect-interval-base 5
open -u \"$FTP_USER\",\"$FTP_PASS\" \"$FTP_HOST\"
cd /www/avtogost77.ru
echo '🧹 Очистка удалённого каталога…'
rm -rf *
echo '📤 Загрузка локального mirror…'
mirror -R temp_deploy/ ./
bye
"

echo "🎉 Деплой завершён успешно!"

# ────────────────────────────────────────────────
# 4.  Очистка локального временного каталога
# ────────────────────────────────────────────────
rm -rf temp_deploy