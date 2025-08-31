"""
Pydantic схемы для валидации данных
"""

from .client import ClientCreate, ClientUpdate, ClientResponse
from .lead import LeadCreate, LeadUpdate, LeadResponse
from .contract import ContractCreate, ContractUpdate, ContractResponse
from .user import UserCreate, UserUpdate, UserResponse

__all__ = [
    "ClientCreate", "ClientUpdate", "ClientResponse",
    "LeadCreate", "LeadUpdate", "LeadResponse", 
    "ContractCreate", "ContractUpdate", "ContractResponse",
    "UserCreate", "UserUpdate", "UserResponse"
]
