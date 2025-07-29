#!/usr/bin/env python3
"""
🤖 УМНЫЙ ТЕЛЕГРАМ БОТ ДЛЯ АВТОГОСТ77
Превращаем простую ссылку в генератор лидов!
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Optional
import json

from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton

# Настройки
BOT_TOKEN = "7999458907:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es"  # Из BROTHERS-COORDINATION.md
MANAGER_CHAT_ID = 399711407  # Из BROTHERS-COORDINATION.md

# Логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Состояния для FSM
class CalculatorStates(StatesGroup):
    cargo_type = State()
    weight = State()
    volume = State()
    city_from = State()
    city_to = State()
    contact = State()

# Создаем бота и диспетчер
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Данные о транспорте (из CALCULATOR-LOGIC.md)
TRANSPORT_TYPES = {
    'gazelle': {
        'max_weight': 1500, 'max_volume': 16, 'density': 94, 
        'name': 'Газель', 'min_price': 10000, 'min_price_region': 7500,
        'coefficient': 0.36
    },
    'three_ton': {
        'max_weight': 3000, 'max_volume': 18, 'density': 167, 
        'name': '3-тонник', 'min_price': 13000, 'min_price_region': 9750,
        'coefficient': 0.46
    },
    'five_ton': {
        'max_weight': 5000, 'max_volume': 36, 'density': 139, 
        'name': '5-тонник', 'min_price': 20000, 'min_price_region': 15000,
        'coefficient': 0.71
    },
    'ten_ton': {
        'max_weight': 10000, 'max_volume': 50, 'density': 200, 
        'name': '10-тонник', 'min_price': 24000, 'min_price_region': 18000,
        'coefficient': 0.86
    },
    'truck': {
        'max_weight': 20000, 'max_volume': 82, 'density': 244, 
        'name': 'Фура 20т', 'min_price': 28000, 'min_price_region': 21000,
        'coefficient': 1.0
    }
}

# Примеры цен (из CALCULATOR-LOGIC.md)
PRICE_EXAMPLES = {
    ('Голицыно', 'Поварово', 40): 28000,
    ('Голицыно', 'Тверь', 170): 35000,
    ('Одинцово', 'Санкт-Петербург', 700): 70000
}

def get_optimal_transport(weight: float, volume: float) -> str:
    """Определяет оптимальный транспорт"""
    for transport_id, params in TRANSPORT_TYPES.items():
        if weight <= params['max_weight'] and volume <= params['max_volume']:
            return transport_id
    return 'truck'

def calculate_price(weight: float, volume: float, distance: int, from_city: str = '', to_city: str = '') -> int:
    """Расчет цены по логике из CALCULATOR-LOGIC.md"""
    # Определяем транспорт
    transport = get_optimal_transport(weight, volume)
    transport_data = TRANSPORT_TYPES[transport]
    
    # Базовая цена для фуры
    if distance < 50:
        price_per_km = 700
    elif distance < 100:
        price_per_km = 280
    elif distance < 200:
        price_per_km = 200
    elif distance < 500:
        price_per_km = 150
    else:
        price_per_km = 100
    
    base_price = distance * price_per_km
    
    # Применяем коэффициент для транспорта меньше фуры
    if transport != 'truck':
        base_price = base_price * transport_data['coefficient']
    
    # Определяем минималку (Москва или регион)
    is_moscow = 'Москв' in from_city or 'Москв' in to_city
    min_price = transport_data['min_price'] if is_moscow else transport_data['min_price_region']
    
    # Применяем минимальную цену
    final_price = max(base_price, min_price)
    
    # Округляем до сотен
    return int(round(final_price / 100) * 100)

# Клавиатуры
def get_cargo_keyboard():
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📦 Сборный груз")],
            [KeyboardButton(text="🏭 Негабарит")],
            [KeyboardButton(text="🚗 Автомобиль")],
            [KeyboardButton(text="📋 Другое")]
        ],
        resize_keyboard=True
    )
    return keyboard

def get_contact_keyboard():
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📞 Поделиться контактом", request_contact=True)],
            [KeyboardButton(text="⏭ Пропустить")]
        ],
        resize_keyboard=True
    )
    return keyboard

def get_action_keyboard(price: int):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Оформить заказ", callback_data="order")],
        [InlineKeyboardButton(text="📞 Позвонить менеджеру", callback_data="call")],
        [InlineKeyboardButton(text="💬 Задать вопрос", callback_data="question")],
        [InlineKeyboardButton(text="🌐 На сайт", url="https://avtogost77.ru/calculator")]
    ])
    return keyboard

# Обработчики команд
@dp.message(Command("start"))
async def start_handler(message: types.Message, state: FSMContext):
    """Приветствие и начало работы"""
    await state.clear()
    
    text = (
        "🚛 Здравствуйте! Я помощник АвтоГОСТ\n"
        "Помогу рассчитать стоимость грузоперевозки за 30 секунд!\n\n"
        "Что везем?"
    )
    
    await message.answer(text, reply_markup=get_cargo_keyboard())
    await state.set_state(CalculatorStates.cargo_type)

@dp.message(CalculatorStates.cargo_type)
async def cargo_type_handler(message: types.Message, state: FSMContext):
    """Обработка типа груза"""
    cargo_type = message.text
    await state.update_data(cargo_type=cargo_type)
    
    text = (
        "Отлично! Укажите параметры груза:\n\n"
        "Вес в килограммах (например: 500):"
    )
    
    await message.answer(text, reply_markup=types.ReplyKeyboardRemove())
    await state.set_state(CalculatorStates.weight)

@dp.message(CalculatorStates.weight)
async def weight_handler(message: types.Message, state: FSMContext):
    """Обработка веса"""
    try:
        weight = float(message.text.replace(',', '.'))
        await state.update_data(weight=weight)
        
        text = "Объем в кубических метрах (например: 2.5):\n💡 Подсказка: 1 паллет ≈ 1.2 м³"
        await message.answer(text)
        await state.set_state(CalculatorStates.volume)
    except ValueError:
        await message.answer("❌ Пожалуйста, введите число. Например: 500")

@dp.message(CalculatorStates.volume)
async def volume_handler(message: types.Message, state: FSMContext):
    """Обработка объема"""
    try:
        volume = float(message.text.replace(',', '.'))
        await state.update_data(volume=volume)
        
        text = "📍 Откуда везем? Введите город:"
        await message.answer(text)
        await state.set_state(CalculatorStates.city_from)
    except ValueError:
        await message.answer("❌ Пожалуйста, введите число. Например: 2.5")

@dp.message(CalculatorStates.city_from)
async def city_from_handler(message: types.Message, state: FSMContext):
    """Обработка города отправления"""
    city_from = message.text
    await state.update_data(city_from=city_from)
    
    text = "📍 Куда доставить? Введите город:"
    await message.answer(text)
    await state.set_state(CalculatorStates.city_to)

@dp.message(CalculatorStates.city_to)
async def city_to_handler(message: types.Message, state: FSMContext):
    """Обработка города назначения и расчет"""
    city_to = message.text
    await state.update_data(city_to=city_to)
    
    # Получаем все данные
    data = await state.get_data()
    
    # Расчет (упрощенный)
    distance = 500  # В реальности нужно считать через API
    price = calculate_price(data['weight'], data['volume'], distance, data['from_city'], data['to_city'])
    transport = get_optimal_transport(data['weight'], data['volume'])
    transport_name = TRANSPORT_TYPES[transport]['name']
    
    # Сохраняем результат
    await state.update_data(price=price, transport=transport, distance=distance)
    
    # Формируем ответ
    text = (
        f"🎯 Расчет готов!\n\n"
        f"Маршрут: {data['city_from']} → {city_to}\n"
        f"Груз: {data['weight']} кг / {data['volume']} м³\n"
        f"Транспорт: {transport_name}\n\n"
        f"💰 Стоимость: {price:,} ₽\n"
        f"⏱ Срок: 1-2 дня\n\n"
        f"Хотите оставить контакт для уточнения деталей?"
    )
    
    await message.answer(text, reply_markup=get_contact_keyboard())
    await state.set_state(CalculatorStates.contact)

@dp.message(CalculatorStates.contact)
async def contact_handler(message: types.Message, state: FSMContext):
    """Обработка контакта"""
    data = await state.get_data()
    
    # Сохраняем контакт если есть
    if message.contact:
        phone = message.contact.phone_number
        await state.update_data(phone=phone)
    else:
        phone = None
    
    # Формируем финальное сообщение
    text = (
        f"✅ Спасибо за обращение!\n\n"
        f"Ваш расчет сохранен. Что делаем дальше?"
    )
    
    await message.answer(
        text, 
        reply_markup=types.ReplyKeyboardRemove()
    )
    await message.answer(
        "Выберите действие:",
        reply_markup=get_action_keyboard(data['price'])
    )
    
    # Отправляем уведомление менеджеру
    await notify_manager(message.from_user, data, phone)
    
    # Очищаем состояние
    await state.clear()

async def notify_manager(user: types.User, data: Dict, phone: Optional[str]):
    """Отправка уведомления менеджеру"""
    text = (
        f"🆕 НОВЫЙ РАСЧЕТ В БОТЕ!\n\n"
        f"👤 Пользователь: {user.full_name}\n"
        f"🆔 Telegram: @{user.username or 'нет'}\n"
        f"📞 Телефон: {phone or 'не указан'}\n\n"
        f"📦 Тип груза: {data['cargo_type']}\n"
        f"⚖️ Вес: {data['weight']} кг\n"
        f"📏 Объем: {data['volume']} м³\n"
        f"🚛 Транспорт: {TRANSPORT_TYPES[data['transport']]['name']}\n\n"
        f"📍 Маршрут: {data['city_from']} → {data['city_to']}\n"
        f"💰 Рассчитанная цена: {data['price']:,} ₽\n\n"
        f"⏰ Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}"
    )
    
    try:
        await bot.send_message(MANAGER_CHAT_ID, text)
    except Exception as e:
        logger.error(f"Ошибка отправки менеджеру: {e}")

# Обработчики callback
@dp.callback_query(F.data == "order")
async def order_callback(callback: types.CallbackQuery):
    """Обработка заказа"""
    await callback.answer("Менеджер свяжется с вами в течение 5 минут!", show_alert=True)
    await callback.message.answer(
        "📞 Наш менеджер свяжется с вами в ближайшее время!\n"
        "Или позвоните сами: +7 (916) 272-09-32"
    )

@dp.callback_query(F.data == "call")
async def call_callback(callback: types.CallbackQuery):
    """Обработка звонка"""
    await callback.answer()
    await callback.message.answer(
        "📞 Звоните прямо сейчас:\n"
        "+7 (916) 272-09-32\n\n"
        "График работы: 24/7"
    )

@dp.callback_query(F.data == "question")
async def question_callback(callback: types.CallbackQuery):
    """Обработка вопроса"""
    await callback.answer()
    await callback.message.answer(
        "💬 Задайте ваш вопрос, и я передам его менеджеру.\n"
        "Или пишите в WhatsApp: wa.me/79162720932"
    )

# Обработчик всех остальных сообщений
@dp.message()
async def echo_handler(message: types.Message):
    """Обработка неизвестных сообщений"""
    await message.answer(
        "Не понял вас 🤔\n"
        "Используйте /start для нового расчета или /help для помощи"
    )

async def main():
    """Запуск бота"""
    logger.info("🚀 Запускаем умного @father_bot!")
    
    # Удаляем webhook если был
    await bot.delete_webhook(drop_pending_updates=True)
    
    # Запускаем polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())