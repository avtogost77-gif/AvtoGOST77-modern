"""
AVTOGOST77 CRM MVP - Конфигурация приложения
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Настройки и конфигурация для CRM системы
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Настройки приложения"""
    
    # Основные настройки
    app_name: str = "AVTOGOST77 CRM MVP"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # База данных
    database_url: str = "postgresql://avtogost77:avtogost77_password@localhost:5432/avtogost77_crm"
    
    # Безопасность
    secret_key: str = "avtogost77_secret_key_2025"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API настройки
    api_prefix: str = "/api/v1"
    cors_origins: list = ["*"]
    
    # Логирование
    log_level: str = "INFO"
    log_file: str = "logs/crm.log"
    
    # Файлы
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Создание экземпляра настроек
settings = Settings()

# Настройки для разработки
if settings.debug:
    settings.database_url = "postgresql://avtogost77:avtogost77_password@localhost:5432/avtogost77_crm"
    settings.log_level = "DEBUG"
    settings.cors_origins = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

# Настройки для продакшена
if os.getenv("ENVIRONMENT") == "production":
    settings.debug = False
    settings.log_level = "WARNING"
    settings.cors_origins = ["https://avtogost77.ru", "https://crm.avtogost77.ru"]
