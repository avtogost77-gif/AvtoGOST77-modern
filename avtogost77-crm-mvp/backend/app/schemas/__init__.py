"""
AVTOGOST77 CRM MVP - Pydantic схемы
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Импорты всех Pydantic схем для API
"""

# Основные схемы
from .lead import (
    LeadCreate, LeadUpdate, LeadResponse, LeadList
)

from .partner import (
    PartnerCreate, PartnerUpdate, PartnerResponse, PartnerList,
    PartnerLocationCreate, PartnerLocationUpdate, PartnerLocationResponse
)

from .rating import (
    PartnerRatingCreate, PartnerRatingUpdate, PartnerRatingResponse, PartnerRatingList
)

from .management import (
    ManagementRecordCreate, ManagementRecordUpdate, ManagementRecordResponse, ManagementRecordList
)

# Новые схемы для расширенной версии
from .document import (
    DocumentCreate, DocumentUpdate, DocumentResponse, DocumentList,
    DocumentTemplateCreate, DocumentTemplateUpdate, DocumentTemplateResponse,
    DocumentBlockCreate, DocumentBlockUpdate, DocumentBlockResponse,
    DocumentHistoryResponse, DocumentStats
)

from .contract import (
    ContractCreate, ContractUpdate, ContractResponse, ContractList,
    ContractTemplateCreate, ContractTemplateUpdate, ContractTemplateResponse,
    ContractConditionCreate, ContractConditionUpdate, ContractConditionResponse,
    ContractHistoryResponse, ContractStats, MirrorContractResponse
)

from .legal import (
    LegalDocumentCreate, LegalDocumentUpdate, LegalDocumentResponse, LegalDocumentList,
    LegalArticleCreate, LegalArticleUpdate, LegalArticleResponse, LegalArticleList,
    LegalCategoryCreate, LegalCategoryUpdate, LegalCategoryResponse, LegalCategoryList,
    LegalSearchIndexCreate, LegalSearchIndexResponse,
    UserFavoriteCreate, UserFavoriteUpdate, UserFavoriteResponse,
    LegalSearchResult, LegalStats, LegalDocumentWithArticles, 
    LegalCategoryWithDocuments, LegalSearchSuggestion
)

__all__ = [
    # Основные схемы
    "LeadCreate", "LeadUpdate", "LeadResponse", "LeadList",
    "PartnerCreate", "PartnerUpdate", "PartnerResponse", "PartnerList",
    "PartnerLocationCreate", "PartnerLocationUpdate", "PartnerLocationResponse",
    "PartnerRatingCreate", "PartnerRatingUpdate", "PartnerRatingResponse", "PartnerRatingList",
    "ManagementRecordCreate", "ManagementRecordUpdate", "ManagementRecordResponse", "ManagementRecordList",
    
    # Схемы документов
    "DocumentCreate", "DocumentUpdate", "DocumentResponse", "DocumentList",
    "DocumentTemplateCreate", "DocumentTemplateUpdate", "DocumentTemplateResponse",
    "DocumentBlockCreate", "DocumentBlockUpdate", "DocumentBlockResponse",
    "DocumentHistoryResponse", "DocumentStats",
    
    # Схемы контрактов
    "ContractCreate", "ContractUpdate", "ContractResponse", "ContractList",
    "ContractTemplateCreate", "ContractTemplateUpdate", "ContractTemplateResponse",
    "ContractConditionCreate", "ContractConditionUpdate", "ContractConditionResponse",
    "ContractHistoryResponse", "ContractStats", "MirrorContractResponse",
    
    # Схемы правовой базы
    "LegalDocumentCreate", "LegalDocumentUpdate", "LegalDocumentResponse", "LegalDocumentList",
    "LegalArticleCreate", "LegalArticleUpdate", "LegalArticleResponse", "LegalArticleList",
    "LegalCategoryCreate", "LegalCategoryUpdate", "LegalCategoryResponse", "LegalCategoryList",
    "LegalSearchIndexCreate", "LegalSearchIndexResponse",
    "UserFavoriteCreate", "UserFavoriteUpdate", "UserFavoriteResponse",
    "LegalSearchResult", "LegalStats", "LegalDocumentWithArticles", 
    "LegalCategoryWithDocuments", "LegalSearchSuggestion"
]
