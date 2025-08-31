"""
AVTOGOST77 CRM MVP - Модели базы данных
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Импорт всех моделей для удобства использования
"""

from .lead import Lead
from .partner import Partner
from .partner_rating import PartnerRating
from .partner_location import PartnerLocation
from .management_record import ManagementRecord

__all__ = [
    "Lead",
    "Partner", 
    "PartnerRating",
    "PartnerLocation",
    "ManagementRecord"
]
