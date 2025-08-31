"""
Настройки приложения
"""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        raise ImportError("Neither pydantic_settings nor pydantic is installed. Please install pydantic-settings: pip install pydantic-settings")

from typing import List
import os

class Settings(BaseSettings):
    # Основные настройки приложения
    APP_NAME: str = "АвтоГОСТ77 CRM"
    API_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "CRM система для управления заявками логистической компании"
    DEBUG: bool = True
    
    # Настройки базы данных
    DATABASE_URL: str = "postgresql://avtogost77:avtogost77_password@postgres:5432/avtogost77_crm"
    
    # Настройки Redis
    REDIS_URL: str = "redis://redis:6379"
    
    # Настройки безопасности
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Настройки CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Настройки Telegram
    TELEGRAM_BOT_TOKEN: str = "79162720932:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8"
    TELEGRAM_CHAT_ID: str = "@avtogost77"
    
    # Настройки файлов
    UPLOAD_DIR: str = "/app/uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Настройки логирования
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "/app/logs/crm.log"
    
    # Настройки кэширования
    CACHE_TTL: int = 3600  # 1 час
    
    # Настройки резервного копирования
    BACKUP_DIR: str = "/app/backups"
    BACKUP_RETENTION_DAYS: int = 30
    
    # Настройки email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "avtogost77@gmail.com"
    SMTP_PASSWORD: str = ""
    
    class Config:
        env_file = ".env"

# Создание экземпляра настроек
settings = Settings()

# Константы для статусов
LEAD_STATUSES = [
    "new",           # Новая
    "processing",    # В обработке
    "calculated",    # Расчет готов
    "confirmed",     # Подтверждена
    "in_progress",   # В работе
    "completed",     # Завершена
    "cancelled"      # Отменена
]

CLIENT_TYPES = [
    "individual",    # Физическое лицо
    "entrepreneur",  # ИП
    "company"        # ООО/ОАО
]

CONTRACT_STATUSES = [
    "draft",         # Черновик
    "sent",          # Отправлен
    "signed",        # Подписан
    "in_progress",   # В работе
    "completed",     # Завершен
    "cancelled"      # Отменен
]

# Константы для цен
BASE_PRICE_PER_KM = 25.0  # Базовая цена за км
MIN_PRICE = 1500.0        # Минимальная цена
URGENT_MULTIPLIER = 1.5   # Множитель для срочных заказов
CONSOLIDATED_DISCOUNT = 0.25  # Скидка 25% для сборных грузов
