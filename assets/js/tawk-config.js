// 🚛 КОНФИГУРАЦИЯ TAWK.TO ЧАТА
// Автоматические сообщения и настройки

// Ждем загрузки Tawk API
window.Tawk_API = window.Tawk_API || {};

// Конфигурация после загрузки
window.Tawk_API.onLoad = function(){
    // Настройки виджета
    Tawk_API.setAttributes({
        'name': 'Гость',
        'source': 'АвтоГОСТ сайт'
    }, function(error){});

    // Кастомизация внешнего вида (если доступно в вашем плане)
    if (typeof Tawk_API.customStyle !== 'undefined') {
        Tawk_API.customStyle({
            zIndex: 999999,
            visibility: {
                desktop: {
                    position: 'br', // bottom-right
                    xOffset: '20px',
                    yOffset: '20px'
                },
                mobile: {
                    position: 'br',
                    xOffset: '10px', 
                    yOffset: '10px'
                }
            }
        });
    }
};

// Автоматические сообщения
window.Tawk_API.onChatStarted = function(){
    // Отправляем цель в Метрику
    if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'chat_started');
    }
};

// Когда посетитель отправляет сообщение
window.Tawk_API.onChatMessageVisitor = function(message){
    const lowerMessage = message.toLowerCase();
    
    // Анализируем сообщение и предлагаем быстрые ответы
    if (lowerMessage.includes('калькулятор') || lowerMessage.includes('стоимость') || lowerMessage.includes('цена')) {
        // Предлагаем использовать калькулятор
        setTimeout(() => {
            if (typeof Tawk_API.addEvent !== 'undefined') {
                Tawk_API.addEvent('Расчет стоимости', {
                    'action': 'calculator_suggested'
                });
            }
        }, 1000);
    }
    
    if (lowerMessage.includes('срочн') || lowerMessage.includes('сегодня') || lowerMessage.includes('быстро')) {
        // Отмечаем срочный запрос
        if (typeof Tawk_API.addTags !== 'undefined') {
            Tawk_API.addTags(['срочная-доставка']);
        }
    }
    
    // Цель в Метрике
    if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'chat_message_sent', {
            message_type: detectMessageType(lowerMessage)
        });
    }
};

// Определяем тип сообщения
function detectMessageType(message) {
    if (message.includes('калькулятор') || message.includes('стоимость')) return 'price_request';
    if (message.includes('срочн') || message.includes('быстро')) return 'urgent_delivery';
    if (message.includes('проблем') || message.includes('жалоб')) return 'complaint';
    if (message.includes('консультац')) return 'consultation';
    return 'general';
}

// Быстрые ответы для оператора
const QUICK_RESPONSES = {
    greeting: `🚛 Добро пожаловать в АвтоГОСТ!

Здравствуйте! Я готов помочь вам с грузоперевозками по России.

• Рассчитать стоимость доставки
• Узнать сроки перевозки  
• Получить консультацию специалиста
• Оформить заявку

Что вас интересует?`,

    calculator: `📋 КАЛЬКУЛЯТОР СТОИМОСТИ:
Перейдите на главную страницу и воспользуйтесь нашим калькулятором. Он покажет точную стоимость за 30 секунд!

Или я могу помочь рассчитать прямо сейчас. Укажите:
- Откуда везем
- Куда доставляем  
- Вес груза`,

    timing: `⏰ СРОКИ ДОСТАВКИ:
• Москва → Регионы: 1-3 дня
• Регионы → Москва: 1-3 дня  
• Между регионами: 2-5 дней
• Срочная доставка: от 12 часов

Для точного расчета укажите маршрут.`,

    special: `💰 СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ:
• Скидка 10% на первую перевозку (промокод: WELCOME10)
• Бесплатная консультация
• Подача транспорта за 2 часа
• Страхование груза включено`,

    contact: `📞 СВЯЗАТЬСЯ С МЕНЕДЖЕРОМ:
Телефон: +7 916 272-09-32
WhatsApp: https://wa.me/79162720932

Работаем 24/7, звоните в любое время!`,

    urgent: `⚡ ЭКСПРЕСС-ДОСТАВКА:
• Подача транспорта: 2-4 часа
• Стоимость: +30% к базовому тарифу
• Гарантия доставки в срок

📞 СРОЧНЫЙ ЗВОНОК:
Позвоните прямо сейчас: +7 916 272-09-32
Менеджер подберет оптимальный вариант!`,

    problem: `🔧 РЕШЕНИЕ ПРОБЛЕМ:
Приношу извинения за неудобства!

1. Опишите ситуацию подробнее
2. Укажите номер заявки (если есть)
3. Я передам информацию менеджеру

📞 СРОЧНАЯ СВЯЗЬ:
Телефон: +7 916 272-09-32
Мы решим проблему в кратчайшие сроки!`
};

// Сохраняем для использования операторами
window.TAWK_QUICK_RESPONSES = QUICK_RESPONSES;

// Показываем в консоли для операторов
console.log('🚛 Tawk.to настроен для АвтоГОСТ');
console.log('Быстрые ответы доступны в window.TAWK_QUICK_RESPONSES');

// ИНСТРУКЦИЯ ДЛЯ НАСТРОЙКИ В TAWK.TO DASHBOARD:
/*
1. Зайдите в Dashboard Tawk.to
2. Выберите виджет АвтоГОСТ
3. Настройте:

ВНЕШНИЙ ВИД:
- Primary Color: #2c5aa0
- Secondary Color: #1e3a6f
- Text Color: #ffffff
- Position: Bottom Right
- Offset: 20px

АВТОМАТИЧЕСКИЕ СООБЩЕНИЯ:
- Welcome Message: Скопируйте QUICK_RESPONSES.greeting
- Wait Time: 3 секунды
- Offline Message: "Оставьте заявку, мы свяжемся в течение 30 минут"

ТРИГГЕРЫ:
- Page Time Trigger: 30 секунд
- Message: "Нужна помощь с расчетом стоимости доставки?"

SHORTCUTS (быстрые ответы):
/calc - QUICK_RESPONSES.calculator
/time - QUICK_RESPONSES.timing
/spec - QUICK_RESPONSES.special
/call - QUICK_RESPONSES.contact
/urg - QUICK_RESPONSES.urgent
/help - QUICK_RESPONSES.problem

TAGS (теги для сортировки):
- срочная-доставка
- расчет-стоимости
- жалоба
- новый-клиент
- повторный-клиент

РАБОЧИЕ ЧАСЫ:
- 24/7 (круглосуточно)
- Время ответа: до 30 секунд

УВЕДОМЛЕНИЯ:
- Email: avtogost77@gmail.com
- Sound: Enabled
- Desktop Notifications: Enabled
*/