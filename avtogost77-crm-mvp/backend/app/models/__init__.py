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
from .document import Document, DocumentTemplate, DocumentBlock, DocumentHistory
from .contract import Contract, ContractTemplate, ContractCondition, ContractHistory
from .legal import LegalDocument, LegalArticle, LegalSearchIndex, UserFavorite, LegalCategory

__all__ = [
    "Lead", "Partner", "PartnerRating", "PartnerLocation", "ManagementRecord",
    "Document", "DocumentTemplate", "DocumentBlock", "DocumentHistory",
    "Contract", "ContractTemplate", "ContractCondition", "ContractHistory",
    "LegalDocument", "LegalArticle", "LegalSearchIndex", "UserFavorite", "LegalCategory"
]
