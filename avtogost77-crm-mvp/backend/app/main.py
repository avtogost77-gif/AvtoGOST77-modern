"""
AVTOGOST77 CRM MVP - Главное приложение FastAPI
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Основное приложение CRM с API роутерами
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .database import engine, Base
from .api import (
    leads_router, partners_router, ratings_router, management_router,
    documents_router, contracts_router, legal_router
)

# ============================================
# ЖИЗНЕННЫЙ ЦИКЛ ПРИЛОЖЕНИЯ
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    
    # Создаем таблицы при запуске
    print("🔄 Создание таблиц базы данных...")
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы созданы успешно!")
    
    yield
    
    # Очистка при завершении
    print("🔄 Завершение работы приложения...")

# ============================================
# СОЗДАНИЕ ПРИЛОЖЕНИЯ
# ============================================

app = FastAPI(
    title="AVTOGOST77 CRM MVP",
    description="CRM система для транспортной компании AVTOGOST77",
    version="2.0.0",
    lifespan=lifespan
)

# ============================================
# НАСТРОЙКА CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене ограничить конкретными доменами
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# ПОДКЛЮЧЕНИЕ API РОУТЕРОВ
# ============================================

# Основные роутеры MVP
app.include_router(leads_router, prefix="/api/v1")
app.include_router(partners_router, prefix="/api/v1")
app.include_router(ratings_router, prefix="/api/v1")
app.include_router(management_router, prefix="/api/v1")

# Новые роутеры для расширенной версии
app.include_router(documents_router, prefix="/api/v1")
app.include_router(contracts_router, prefix="/api/v1")
app.include_router(legal_router, prefix="/api/v1")

# ============================================
# СТАТИЧЕСКИЕ ФАЙЛЫ
# ============================================

# Подключаем статические файлы фронтенда
frontend_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
    print(f"✅ Фронтенд подключен: {frontend_path}")
else:
    print(f"⚠️  Фронтенд не найден: {frontend_path}")

# ============================================
# КОРНЕВЫЕ ЭНДПОИНТЫ
# ============================================

@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {
        "message": "AVTOGOST77 CRM MVP v2.0.0",
        "status": "running",
        "api_docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Проверка состояния приложения"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": "2025-08-31T00:00:00Z"
    }

@app.get("/api/info")
async def api_info():
    """Информация об API"""
    return {
        "name": "AVTOGOST77 CRM MVP API",
        "version": "2.0.0",
        "description": "API для управления заявками, партнерами, документами и правовой базой",
        "endpoints": {
            "leads": "/api/v1/leads",
            "partners": "/api/v1/partners",
            "ratings": "/api/v1/ratings",
            "management": "/api/v1/management",
            "documents": "/api/v1/documents",
            "contracts": "/api/v1/contracts",
            "legal": "/api/v1/legal"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
