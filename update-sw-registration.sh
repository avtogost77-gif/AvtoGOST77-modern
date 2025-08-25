#!/bin/bash

# Скрипт для обновления service worker регистрации на всех страницах

echo "🔄 Обновление service worker регистрации..."

for file in $(find . -maxdepth 1 -name "*.html"); do
    echo "Обновляем $file..."

    # Проверяем, есть ли уже новая регистрация
    if ! grep -q "SW v2.0" "$file"; then
        # Заменяем старую регистрацию на новую
        sed -i '/PWA Service Worker Registration/,/<\/script>/c\
    <!-- PWA Service Worker Registration -->\
    <script>\
        // Service Worker v2.0 - принудительная очистка старого кэша\
        if ("serviceWorker" in navigator) {\
            window.addEventListener("load", () => {\
                // Принудительно очищаем старый кэш\
                if ('\''caches'\'' in window) {\
                    caches.keys().then(names => {\
                        names.forEach(name => {\
                            if (name !== '\''avtogost77-v2.0-fixed'\'') {\
                                console.log('\''💀 Уничтожаем старый кэш:'\'', name);\
                                caches.delete(name);\
                            }\
                        });\
                    });\
                }\
\
                // Регистрируем новый service worker\
                navigator.serviceWorker.register("/sw.js")\
                    .then((registration) => {\
                        console.log('\''✅ SW v2.0 зарегистрирован'\'');\
                        // Принудительное обновление\
                        registration.update();\
                    })\
                    .catch((registrationError) => {\
                        console.log('\''❌ SW v2.0 регистрация не удалась:'\'', registrationError);\
                    });\
            });\
        }\
    </script>' "$file"
        echo "✅ Обновлено в $file"
    else
        echo "⚠️  Уже обновлено в $file"
    fi
done

echo "🎉 Service Worker регистрация обновлена на всех страницах!"

