#!/bin/bash
echo "🚀   LFTP deploy full repo"

lftp -c "
  set ftp:ssl-allow no
  set net:timeout 30
  set net:max-retries 3
  set net:reconnect-interval-base 5
  open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
  cd /www/avtogost77.ru
  echo '🧹 Clean remote...'
  rm -rf *
  echo '📤 Mirror local → remote...'
  mirror -R \
         --exclude-glob .git* \
         --exclude-glob node_modules \
         --exclude-glob .github \
         --exclude-glob *.yml \
         ./ ./
  echo '✅  Upload done!'
  bye
"