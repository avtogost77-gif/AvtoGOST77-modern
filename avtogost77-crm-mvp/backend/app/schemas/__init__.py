"""
AVTOGOST77 CRM MVP - Pydantic схемы
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Импорт всех Pydantic схем для валидации данных
"""

from .lead import LeadCreate, LeadUpdate, LeadResponse
from .partner import PartnerCreate, PartnerUpdate, PartnerResponse
from .rating import RatingCreate, RatingResponse
from .management import ManagementCreate, ManagementResponse

__all__ = [
    "LeadCreate", "LeadUpdate", "LeadResponse",
    "PartnerCreate", "PartnerUpdate", "PartnerResponse", 
    "RatingCreate", "RatingResponse",
    "ManagementCreate", "ManagementResponse"
]
