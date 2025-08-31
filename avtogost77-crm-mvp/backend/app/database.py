"""
AVTOGOST77 CRM MVP - Подключение к базе данных
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Настройка подключения к PostgreSQL базе данных
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from loguru import logger
import os

from .config import settings

# Создание движка базы данных
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Логирование SQL запросов в debug режиме
    pool_pre_ping=True,   # Проверка соединения перед использованием
    pool_recycle=300      # Пересоздание соединений каждые 5 минут
)

# Создание сессии
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()

def get_db() -> Session:
    """
    Dependency для получения сессии базы данных
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Ошибка базы данных: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """
    Инициализация базы данных
    """
    try:
        # Создание всех таблиц
        Base.metadata.create_all(bind=engine)
        logger.info("База данных успешно инициализирована")
        
        # Проверка подключения
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            logger.info("Подключение к базе данных установлено")
            
    except Exception as e:
        logger.error(f"Ошибка инициализации базы данных: {e}")
        raise

def test_db_connection():
    """
    Тестирование подключения к базе данных
    """
    try:
        with engine.connect() as connection:
            result = connection.execute("SELECT version()")
            version = result.fetchone()[0]
            logger.info(f"Подключение к PostgreSQL успешно. Версия: {version}")
            return True
    except Exception as e:
        logger.error(f"Ошибка подключения к базе данных: {e}")
        return False

# Проверка подключения при импорте модуля
if __name__ == "__main__":
    test_db_connection()
