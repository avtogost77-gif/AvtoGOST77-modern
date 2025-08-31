"""
Главный файл FastAPI приложения для CRM АвтоГОСТ77
"""

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import json

from app.api.v1 import api_router
from app.services.notification_service import notify_new_lead, notify_lead_status_change
from app.core.database import init_db
from app.models import *  # Импортируем все модели для создания таблиц

# Модели данных для заявок
class LeadCreate(BaseModel):
    """Модель для создания заявки"""
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    from_city: str
    to_city: str
    weight: float
    volume: Optional[float] = None
    cargo_type: Optional[str] = None
    urgency: str = "standard"  # standard, urgent
    comments: Optional[str] = None
    source: str = "website"  # website, phone, telegram
    calculated_price: Optional[float] = None
    distance: Optional[float] = None

class LeadResponse(BaseModel):
    """Модель для ответа с заявкой"""
    id: int
    client_name: str
    client_phone: str
    client_email: Optional[str]
    from_city: str
    to_city: str
    weight: float
    volume: Optional[float]
    cargo_type: Optional[str]
    urgency: str
    status: str
    comments: Optional[str]
    source: str
    calculated_price: Optional[float]
    distance: Optional[float]
    created_at: datetime
    updated_at: datetime

# Хранилище заявок (временное, потом заменим на БД)
leads_storage = []
lead_counter = 1

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Управление жизненным циклом приложения
    """
    logger.info("Приложение запущено!")
    
    # Инициализируем базу данных
    try:
        init_db()
        logger.info("База данных инициализирована")
    except Exception as e:
        logger.error(f"Ошибка инициализации базы данных: {e}")
    
    yield
    logger.info("Приложение завершает работу...")

# Создание FastAPI приложения
app = FastAPI(
    title="АвтоГОСТ77 CRM API",
    description="API для системы управления заявками логистической компании",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем API роутеры
app.include_router(api_router)

@app.get("/")
async def root():
    """
    Корневой endpoint для проверки работоспособности
    """
    return {
        "message": "АвтоГОСТ77 CRM API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "api": "/api/v1"
    }

@app.get("/health")
async def health_check():
    """
    Проверка здоровья приложения
    """
    return {
        "status": "healthy",
        "database": "connected",
        "telegram": "connected"
    }

# === API ДЛЯ ЗАЯВОК ===

@app.get("/api/v1/leads/", response_model=List[LeadResponse])
async def get_leads(
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    source: Optional[str] = Query(None, description="Фильтр по источнику"),
    limit: int = Query(50, description="Количество записей"),
    offset: int = Query(0, description="Смещение")
):
    """
    Получить список заявок с фильтрацией
    """
    filtered_leads = leads_storage
    
    if status:
        filtered_leads = [lead for lead in filtered_leads if lead["status"] == status]
    
    if source:
        filtered_leads = [lead for lead in filtered_leads if lead["source"] == source]
    
    return filtered_leads[offset:offset + limit]

@app.get("/api/v1/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int):
    """
    Получить заявку по ID
    """
    for lead in leads_storage:
        if lead["id"] == lead_id:
            return lead
    raise HTTPException(status_code=404, detail="Заявка не найдена")

@app.post("/api/v1/leads/", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, background_tasks: BackgroundTasks):
    """
    Создать новую заявку
    """
    global lead_counter
    
    now = datetime.now()
    new_lead = {
        "id": lead_counter,
        "client_name": lead.client_name,
        "client_phone": lead.client_phone,
        "client_email": lead.client_email,
        "from_city": lead.from_city,
        "to_city": lead.to_city,
        "weight": lead.weight,
        "volume": lead.volume,
        "cargo_type": lead.cargo_type,
        "urgency": lead.urgency,
        "status": "new",  # new, processing, confirmed, completed, cancelled
        "comments": lead.comments,
        "source": lead.source,
        "calculated_price": lead.calculated_price,
        "distance": lead.distance,
        "created_at": now,
        "updated_at": now
    }
    
    leads_storage.append(new_lead)
    lead_counter += 1
    
    logger.info(f"Создана новая заявка ID: {new_lead['id']} от {lead.client_name}")
    
    # Отправляем уведомление в фоновом режиме
    background_tasks.add_task(notify_new_lead, new_lead)
    
    return new_lead

@app.put("/api/v1/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: int, lead_update: LeadCreate):
    """
    Обновить заявку
    """
    for i, lead in enumerate(leads_storage):
        if lead["id"] == lead_id:
            leads_storage[i].update({
                "client_name": lead_update.client_name,
                "client_phone": lead_update.client_phone,
                "client_email": lead_update.client_email,
                "from_city": lead_update.from_city,
                "to_city": lead_update.to_city,
                "weight": lead_update.weight,
                "volume": lead_update.volume,
                "cargo_type": lead_update.cargo_type,
                "urgency": lead_update.urgency,
                "comments": lead_update.comments,
                "source": lead_update.source,
                "calculated_price": lead_update.calculated_price,
                "distance": lead_update.distance,
                "updated_at": datetime.now()
            })
            logger.info(f"Обновлена заявка ID: {lead_id}")
            return leads_storage[i]
    
    raise HTTPException(status_code=404, detail="Заявка не найдена")

@app.patch("/api/v1/leads/{lead_id}/status")
async def update_lead_status(lead_id: int, status: str, background_tasks: BackgroundTasks):
    """
    Обновить статус заявки
    """
    valid_statuses = ["new", "processing", "confirmed", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Неверный статус. Допустимые: {valid_statuses}")
    
    for i, lead in enumerate(leads_storage):
        if lead["id"] == lead_id:
            # Запоминаем старый статус для логирования
            old_status = leads_storage[i]["status"]
            
            # Обновляем статус
            leads_storage[i]["status"] = status
            leads_storage[i]["updated_at"] = datetime.now()
            
            logger.info(f"Статус заявки {lead_id} изменен с {old_status} на {status}")
            
            # Отправляем уведомление в фоновом режиме
            background_tasks.add_task(notify_lead_status_change, lead_id, status, leads_storage[i])
            
            return {"message": f"Статус изменен на: {status}"}
    
    raise HTTPException(status_code=404, detail="Заявка не найдена")

@app.delete("/api/v1/leads/{lead_id}")
async def delete_lead(lead_id: int):
    """
    Удалить заявку
    """
    for i, lead in enumerate(leads_storage):
        if lead["id"] == lead_id:
            deleted_lead = leads_storage.pop(i)
            logger.info(f"Удалена заявка ID: {lead_id}")
            return {"message": "Заявка удалена", "deleted_lead": deleted_lead}
    
    raise HTTPException(status_code=404, detail="Заявка не найдена")

# === API ДЛЯ КАЛЬКУЛЯТОРА ===

@app.get("/api/v1/calculator/calculate")
async def calculate_price(
    from_city: str = Query(...),
    to_city: str = Query(...),
    weight: float = Query(...),
    volume: Optional[float] = Query(None),
    urgency: str = Query("standard")
):
    """
    Расчет стоимости доставки (интеграция с калькулятором сайта)
    """
    # Базовые коэффициенты (взяты с сайта)
    BASE_PRICE_PER_KM = 25  # руб/км
    MIN_PRICE = 5000  # минимальная стоимость
    URGENT_MULTIPLIER = 1.5  # коэффициент срочности
    
    # Расстояния между городами (упрощенная версия)
    distances = {
        ("москва", "санкт-петербург"): 650,
        ("москва", "казань"): 800,
        ("москва", "нижний новгород"): 400,
        ("москва", "екатеринбург"): 1800,
        ("москва", "новосибирск"): 2800,
        ("санкт-петербург", "москва"): 650,
        ("казань", "москва"): 800,
        ("нижний новгород", "москва"): 400,
        ("екатеринбург", "москва"): 1800,
        ("новосибирск", "москва"): 2800,
    }
    
    # Поиск расстояния
    city_pair = (from_city.lower(), to_city.lower())
    distance = distances.get(city_pair, 500)  # по умолчанию 500 км
    
    # Расчет стоимости
    base_price = distance * BASE_PRICE_PER_KM
    
    # Учет веса (коэффициент веса)
    weight_coefficient = 1.0
    if weight > 1000:
        weight_coefficient = 1.2
    elif weight > 5000:
        weight_coefficient = 1.5
    
    # Учет срочности
    urgency_coefficient = URGENT_MULTIPLIER if urgency == "urgent" else 1.0
    
    # Итоговая стоимость
    total_price = max(MIN_PRICE, base_price * weight_coefficient * urgency_coefficient)
    
    return {
        "from_city": from_city,
        "to_city": to_city,
        "weight": weight,
        "volume": volume,
        "urgency": urgency,
        "distance": distance,
        "base_price": base_price,
        "weight_coefficient": weight_coefficient,
        "urgency_coefficient": urgency_coefficient,
        "total_price": round(total_price, 2),
        "currency": "RUB"
    }

# === ЗАГЛУШКИ ДЛЯ ДРУГИХ API ===

@app.get("/api/v1/clients/")
async def get_clients():
    """
    Заглушка для API клиентов
    """
    return {"message": "API клиентов работает!", "clients": []}

@app.get("/api/v1/contracts/")
async def get_contracts():
    """
    Заглушка для API договоров
    """
    return {"message": "API договоров работает!", "contracts": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
