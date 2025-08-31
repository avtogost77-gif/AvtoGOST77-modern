"""
AVTOGOST77 CRM MVP - FastAPI API роутеры
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Импорты всех API роутеров
"""

# Основные роутеры MVP
from .leads import router as leads_router
from .partners import router as partners_router
from .ratings import router as ratings_router
from .management import router as management_router

# Новые роутеры для расширенной версии
from .documents import router as documents_router
from .contracts import router as contracts_router
from .legal import router as legal_router

__all__ = [
    "leads_router",
    "partners_router", 
    "ratings_router",
    "management_router",
    "documents_router",
    "contracts_router",
    "legal_router"
]
