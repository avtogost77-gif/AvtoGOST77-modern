"""
API v1 роутеры
"""

from fastapi import APIRouter
from .clients import router as clients_router
from .leads import router as leads_router
from .contracts import router as contracts_router

router = APIRouter(prefix="/v1")

router.include_router(clients_router, prefix="/clients", tags=["Клиенты"])
router.include_router(leads_router, prefix="/leads", tags=["Заявки"])
router.include_router(contracts_router, prefix="/contracts", tags=["Договоры"])
