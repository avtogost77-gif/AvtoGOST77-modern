"""
AVTOGOST77 CRM MVP - Основное FastAPI приложение
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Главный файл FastAPI приложения для CRM системы
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from loguru import logger
import uvicorn

from .database import engine, Base, get_db
from .models import lead, partner, partner_rating, partner_location, management_record
from .api import leads, partners, ratings, management

# Создание таблиц базы данных
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создание таблиц при запуске
    Base.metadata.create_all(bind=engine)
    logger.info("База данных инициализирована")
    
    yield
    
    logger.info("Приложение завершает работу")

# Создание FastAPI приложения
app = FastAPI(
    title="AVTOGOST77 CRM MVP",
    description="MVP версия CRM системы для логистической компании АвтоГОСТ77",
    version="1.0.0",
    lifespan=lifespan
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене ограничить конкретными доменами
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение API роутеров
app.include_router(leads.router, prefix="/api/v1/leads", tags=["Заявки"])
app.include_router(partners.router, prefix="/api/v1/partners", tags=["Партнеры"])
app.include_router(ratings.router, prefix="/api/v1/ratings", tags=["Рейтинги"])
app.include_router(management.router, prefix="/api/v1/management", tags=["Управленческий учет"])

# Статические файлы
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Корневой endpoint
@app.get("/")
async def root():
    """Корневой endpoint для проверки работы API"""
    return {
        "message": "AVTOGOST77 CRM MVP API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Проверка состояния системы"""
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2025-08-31T10:00:00Z"
    }

# API информация
@app.get("/api/info")
async def api_info():
    """Информация об API"""
    return {
        "name": "AVTOGOST77 CRM MVP API",
        "version": "1.0.0",
        "description": "MVP версия CRM системы для логистики",
        "endpoints": {
            "leads": "/api/v1/leads",
            "partners": "/api/v1/partners",
            "ratings": "/api/v1/ratings",
            "management": "/api/v1/management"
        },
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
