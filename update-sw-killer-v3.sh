#!/bin/bash

# Скрипт для обновления service worker на всех страницах до v3.0 KILLER

echo "💀 Обновление до Service Worker KILLER v3.0..."

for file in $(find . -maxdepth 1 -name "*.html"); do
    echo "Обновляем SW в $file..."

    # Заменяем старую регистрацию на новую v3.0 KILLER
    sed -i '/Service Worker/,/<\/script>/c\
    <!-- PWA Service Worker Registration -->\
    <script>\
        // Service Worker v3.0 KILLER - принудительная очистка старого кэша\
        if ("serviceWorker" in navigator) {\
            window.addEventListener("load", () => {\
                // Принудительно очищаем старый кэш - AGGRESSIVE MODE\
                if ('\''caches'\'' in window) {\
                    caches.keys().then(names => {\
                        names.forEach(name => {\
                            if (name !== '\''avtogost77-v3.0-killer'\'') {\
                                console.log('\''💀 Уничтожаем старый кэш:'\'', name);\
                                caches.delete(name);\
                            }\
                        });\
                    });\
                }\
\
                // Регистрируем новый service worker KILLER v3.0\
                navigator.serviceWorker.register("/sw.js")\
                    .then((registration) => {\
                        console.log('\''💀 SW KILLER v3.0 зарегистрирован'\'');\
                        // Принудительное обновление\
                        registration.update();\
                    })\
                    .catch((registrationError) => {\
                        console.log('\''❌ SW KILLER v3.0 регистрация не удалась:'\'', registrationError);\
                    });\
            });\
        }\
    </script>' "$file"
        echo "✅ Обновлено в $file"
done

echo "💀 Service Worker KILLER v3.0 обновлен на всех страницах!"

