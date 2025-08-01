# 📋 ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TAWK.TO

## 🚀 БЫСТРЫЙ СТАРТ:

1. Войдите в Dashboard: https://dashboard.tawk.to
2. Выберите виджет для avtogost77.ru
3. Следуйте инструкциям ниже

## 🎨 НАСТРОЙКА ВНЕШНЕГО ВИДА:

### Widget Appearance → Theme
- **Primary Color**: `#2c5aa0` (синий АвтоГОСТ)
- **Secondary Color**: `#1e3a6f` (темно-синий)
- **Text Color**: `#ffffff` (белый)

### Widget Appearance → Position
- **Desktop Position**: Bottom Right
- **Mobile Position**: Bottom Right
- **X Offset**: 20px (Desktop), 10px (Mobile)
- **Y Offset**: 20px (Desktop), 10px (Mobile)

### Widget Appearance → Bubble
- **Show Message Preview**: Yes
- **Bubble Icon**: Upload truck emoji 🚛

## 💬 АВТОМАТИЧЕСКИЕ СООБЩЕНИЯ:

### Chat Widget → Greetings
**Welcome Message** (копировать целиком):
```
🚛 Добро пожаловать в АвтоГОСТ!

Здравствуйте! Я готов помочь вам с грузоперевозками по России.

• Рассчитать стоимость доставки
• Узнать сроки перевозки  
• Получить консультацию специалиста
• Оформить заявку

Что вас интересует?
```

**Wait Time**: 3 seconds

### Chat Widget → Offline Form
**Offline Message**:
```
К сожалению, все операторы сейчас заняты.

Оставьте ваши контакты, и мы свяжемся с вами в течение 30 минут!

Или позвоните: +7 916 272-09-32 (24/7)
```

## ⚡ БЫСТРЫЕ ОТВЕТЫ (SHORTCUTS):

Перейдите в **Administration → Shortcuts** и добавьте:

| Shortcut | Название | Текст ответа |
|----------|----------|--------------|
| `/calc` | Калькулятор | Скопировать из tawk-config.js → QUICK_RESPONSES.calculator |
| `/time` | Сроки | Скопировать из tawk-config.js → QUICK_RESPONSES.timing |
| `/spec` | Спецпредложения | Скопировать из tawk-config.js → QUICK_RESPONSES.special |
| `/call` | Контакты | Скопировать из tawk-config.js → QUICK_RESPONSES.contact |
| `/urg` | Срочная доставка | Скопировать из tawk-config.js → QUICK_RESPONSES.urgent |
| `/help` | Решение проблем | Скопировать из tawk-config.js → QUICK_RESPONSES.problem |

## 🏷️ ТЕГИ (TAGS):

**Administration → Tags**, создайте:
- `срочная-доставка` (красный)
- `расчет-стоимости` (синий)
- `жалоба` (оранжевый)
- `новый-клиент` (зеленый)
- `повторный-клиент` (фиолетовый)

## ⏰ ТРИГГЕРЫ:

### Chat Widget → Triggers

**Trigger 1 - Помощь через 30 секунд**:
- **Name**: Помощь с расчетом
- **Conditions**: Time on site > 30 seconds
- **Message**: "Нужна помощь с расчетом стоимости доставки? Я готов помочь!"

**Trigger 2 - На странице калькулятора**:
- **Name**: Помощь с калькулятором  
- **Conditions**: Current page contains "calculator"
- **Message**: "Возникли вопросы по калькулятору? Могу помочь с расчетом!"

## 🔔 УВЕДОМЛЕНИЯ:

### Administration → Notifications
- **Email**: avtogost77@gmail.com
- **Sound Alert**: Enabled
- **Desktop Notifications**: Enabled
- **Mobile Push**: Enabled

## 📊 ОТЧЕТЫ И АНАЛИТИКА:

### Analytics → Goals
Создайте цели:
1. **Завершенный чат** - когда чат длится > 2 минут
2. **Получен контакт** - когда клиент оставил телефон
3. **Срочный запрос** - когда используется тег "срочная-доставка"

## 🤖 АВТООТВЕТЧИК (если доступен в плане):

### Chat Widget → Auto Responder

**Вопрос**: "стоимость|цена|сколько стоит"
**Ответ**: Используйте QUICK_RESPONSES.calculator

**Вопрос**: "срочно|сегодня|быстро"  
**Ответ**: Используйте QUICK_RESPONSES.urgent

**Вопрос**: "время|срок|долго"
**Ответ**: Используйте QUICK_RESPONSES.timing

## 👥 КОМАНДА:

### Administration → Agents
- Добавьте всех менеджеров
- Установите фото и имена
- Настройте график работы

## 📱 МОБИЛЬНОЕ ПРИЛОЖЕНИЕ:

1. Скачайте Tawk.to для iOS/Android
2. Войдите с теми же данными
3. Включите push-уведомления

## ✅ ЧЕКЛИСТ ПРОВЕРКИ:

- [ ] Виджет отображается на сайте
- [ ] Приветственное сообщение работает
- [ ] Цвета соответствуют бренду
- [ ] Shortcuts работают (проверьте /calc)
- [ ] Уведомления приходят на email
- [ ] Мобильное приложение подключено

## 🆘 ПОДДЕРЖКА:

Если что-то не работает:
1. Проверьте консоль браузера (F12)
2. Убедитесь, что скрипт загружается
3. Напишите в поддержку Tawk.to

---

*Инструкция подготовлена для АвтоГОСТ*
*Дата: 1 августа 2025*