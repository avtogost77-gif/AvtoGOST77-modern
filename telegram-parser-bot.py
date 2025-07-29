#!/usr/bin/env python3
"""
🤖 TELEGRAM ПАРСЕР ДЛЯ ТРЭШ-МАРКЕТИНГА
Парсит целевую аудиторию из чатов/каналов
"""

import asyncio
import random
import json
import time
from datetime import datetime
from telethon import TelegramClient, functions, types
from telethon.errors import FloodWaitError, UserPrivacyRestrictedError
import logging

# Настройки
API_ID = 123456  # Получить на my.telegram.org
API_HASH = 'your_api_hash'
PHONE = '+7916XXXXXXX'
TARGET_CHANNEL = '@your_trash_channel'

# Логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrashMarketingBot:
    def __init__(self):
        self.client = TelegramClient('trash_marketing_session', API_ID, API_HASH)
        self.parsed_users = set()
        self.invited_count = 0
        
    async def start(self):
        """Запуск клиента"""
        await self.client.start(PHONE)
        logger.info("✅ Клиент запущен")
        
    async def parse_channel_members(self, channel_username, limit=200):
        """Парсим участников канала/чата"""
        logger.info(f"🔍 Парсим участников {channel_username}")
        
        try:
            channel = await self.client.get_entity(channel_username)
            users = []
            
            async for user in self.client.iter_participants(channel, limit=limit):
                # Пропускаем ботов и юзеров без username
                if user.bot or not user.username:
                    continue
                    
                # Пропускаем уже спарсенных
                if user.id in self.parsed_users:
                    continue
                    
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or '',
                    'phone': user.phone if hasattr(user, 'phone') else None,
                    'parsed_from': channel_username,
                    'parsed_at': datetime.now().isoformat()
                }
                
                users.append(user_data)
                self.parsed_users.add(user.id)
                
            logger.info(f"✅ Спарсено {len(users)} пользователей")
            return users
            
        except Exception as e:
            logger.error(f"❌ Ошибка парсинга: {e}")
            return []
    
    async def smart_invite_users(self, users, max_per_day=40):
        """Умный инвайт с защитой от бана"""
        logger.info(f"📨 Начинаем инвайт {len(users)} пользователей")
        
        invited_today = 0
        
        for user in users:
            if invited_today >= max_per_day:
                logger.info(f"⏸️ Достигнут дневной лимит ({max_per_day})")
                break
                
            try:
                # Добавляем в канал
                await self.client(functions.channels.InviteToChannelRequest(
                    TARGET_CHANNEL,
                    [user['username']]
                ))
                
                invited_today += 1
                self.invited_count += 1
                logger.info(f"✅ Приглашен @{user['username']} ({invited_today}/{max_per_day})")
                
                # Рандомная задержка 30-90 секунд
                delay = random.randint(30, 90)
                await asyncio.sleep(delay)
                
            except UserPrivacyRestrictedError:
                logger.warning(f"🔒 Приватность: @{user['username']}")
                
            except FloodWaitError as e:
                logger.warning(f"⏰ Flood wait: {e.seconds} секунд")
                await asyncio.sleep(e.seconds)
                
            except Exception as e:
                logger.error(f"❌ Ошибка инвайта @{user['username']}: {e}")
                
        return invited_today
    
    async def send_content_post(self, post_type='price'):
        """Отправка автоматического контента"""
        posts = {
            'price': self.generate_price_post(),
            'traffic': self.generate_traffic_post(),
            'lifehack': self.generate_lifehack_post(),
            'case': self.generate_case_post()
        }
        
        post = posts.get(post_type, posts['price'])
        
        try:
            await self.client.send_message(TARGET_CHANNEL, post)
            logger.info(f"📝 Опубликован пост: {post_type}")
        except Exception as e:
            logger.error(f"❌ Ошибка публикации: {e}")
    
    def generate_price_post(self):
        """Генерация поста с ценами"""
        date = datetime.now().strftime('%d.%m')
        
        # Добавляем рандом для реалистичности
        prices = {
            'msk_spb_gazel': random.randint(3200, 3800),
            'moscow_gazel': random.randint(500, 600),
            'mkad_price': random.randint(30, 40),
            'msk_spb_fura': random.randint(25000, 30000),
            'msk_ekb_fura': random.randint(45000, 55000)
        }
        
        return f"""🚛 **АКТУАЛЬНЫЕ ЦЕНЫ НА {date}**

**Газель (до 1.5т):**
📍 Москва - СПб: {prices['msk_spb_gazel']}₽
📍 По Москве: {prices['moscow_gazel']}₽/час
📍 За МКАД: +{prices['mkad_price']}₽/км

**Фура 20т:**
📍 Москва - СПб: {prices['msk_spb_fura']}₽
📍 Москва - Екб: {prices['msk_ekb_fura']}₽

💡 **Лайфхак:** Заказывайте на будни - дешевле на 15%!

⚡ **Быстрый расчет:** @father_bot
☎️ **Горячая линия:** +7 (916) 272-09-32

#цены #грузоперевозки #москва"""
    
    def generate_traffic_post(self):
        """Пост про пробки"""
        traffic_level = random.randint(3, 9)
        
        if traffic_level <= 4:
            status = "🟢 Дороги свободны!"
            advice = "Отличное время для перевозки"
        elif traffic_level <= 7:
            status = "🟡 Умеренные пробки"
            advice = "Планируйте +30 минут к поездке"
        else:
            status = "🔴 АДСКИЕ ПРОБКИ!"
            advice = "Перенесите доставку на вечер"
            
        return f"""🚦 **ПРОБКИ В МОСКВЕ СЕЙЧАС**

{status}
Уровень загрузки: {traffic_level}/10

📍 **Проблемные участки:**
• ТТК: стоит наглухо
• МКАД север: 5 км/ч
• Ленинградка: встала

💡 **Совет дня:** {advice}

🚛 Наши водители знают объезды!
📱 Отслеживание груза: @father_bot

#пробки #москва #доставка"""
    
    def generate_lifehack_post(self):
        """Генерация лайфхака"""
        lifehacks = [
            "Заказывайте газель с грузчиками заранее - экономия до 30%",
            "Фотографируйте груз перед отправкой - защита от споров",
            "Упаковывайте хрупкое в центр кузова - меньше тряски",
            "Грузите тяжелое вниз - машина устойчивее",
            "Страхуйте ценные грузы - спокойнее спится"
        ]
        
        return f"""💡 **ЛАЙФХАК ДНЯ**

{random.choice(lifehacks)}

Больше советов в нашем боте: @father_bot

#лайфхак #совет #грузоперевозки"""
    
    def generate_case_post(self):
        """Генерация кейса"""
        cases = [
            {
                'title': 'Переезд офиса за 1 ночь',
                'problem': 'IT-компания, 50 рабочих мест, дедлайн',
                'solution': '3 газели, ночная смена, всё успели',
                'result': 'Клиент в восторге, получили контракт на год'
            },
            {
                'title': 'Доставка оборудования в регион',
                'problem': 'Станок 5 тонн, срочно в Казань',
                'solution': 'Спецтранспорт, опытный водитель',
                'result': 'Доставили за 12 часов, без повреждений'
            }
        ]
        
        case = random.choice(cases)
        
        return f"""📋 **КЕЙС: {case['title']}**

**Задача:** {case['problem']}
**Решение:** {case['solution']}
**Результат:** {case['result']}

🚛 Доверьте сложные задачи профессионалам!
📞 +7 (916) 272-09-32

#кейс #отзыв #опыт"""
    
    async def run_daily_routine(self):
        """Ежедневная рутина"""
        # Источники для парсинга
        sources = [
            '@gruzoperevozki_moscow',
            '@gazel_msk_chat',
            '@stroyka_remont_moscow',
            '@moscow_business_chat'
        ]
        
        # Парсим по очереди
        all_users = []
        for source in sources:
            users = await self.parse_channel_members(source, limit=50)
            all_users.extend(users)
            
            # Задержка между парсингом разных источников
            await asyncio.sleep(random.randint(300, 600))
        
        # Сохраняем спарсенных юзеров
        with open('parsed_users.json', 'w', encoding='utf-8') as f:
            json.dump(all_users, f, ensure_ascii=False, indent=2)
        
        # Инвайтим
        await self.smart_invite_users(all_users)
        
        # Публикуем контент
        await self.send_content_post('price')
        await asyncio.sleep(3600)  # Час между постами
        await self.send_content_post('traffic')
        
        logger.info(f"📊 Статистика дня: спарсено {len(all_users)}, приглашено {self.invited_count}")


async def main():
    """Основная функция"""
    bot = TrashMarketingBot()
    await bot.start()
    
    # Запускаем ежедневную рутину
    while True:
        try:
            await bot.run_daily_routine()
            
            # Ждем до следующего дня
            await asyncio.sleep(86400)  # 24 часа
            
        except Exception as e:
            logger.error(f"❌ Критическая ошибка: {e}")
            await asyncio.sleep(3600)  # Пауза час при ошибке


if __name__ == '__main__':
    asyncio.run(main())