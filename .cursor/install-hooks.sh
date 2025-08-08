#!/bin/bash

# Установка git hooks для Cursor Sync

echo "📦 Установка git hooks для автоматической синхронизации..."

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Не найден git репозиторий!"
    echo "   Запустите этот скрипт из корня вашего проекта"
    exit 1
fi

# Создаем символическую ссылку на pre-commit hook
if [ -f ".git/hooks/pre-commit" ]; then
    echo "⚠️  pre-commit hook уже существует. Создаю резервную копию..."
    mv .git/hooks/pre-commit .git/hooks/pre-commit.backup
fi

ln -s ../../.cursor/git-hooks/pre-commit .git/hooks/pre-commit

echo "✅ Git hooks успешно установлены!"
echo ""
echo "Теперь перед каждым коммитом будет автоматически запускаться синхронизация."
echo "Чтобы отключить, удалите файл .git/hooks/pre-commit"