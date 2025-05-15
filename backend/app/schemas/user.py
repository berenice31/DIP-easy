from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    role: constr(regex='^(admin|editor|viewer)$')
    two_factor_enabled: bool = False
    is_active: bool = True

class UserCreate(UserBase):
    password: constr(min_length=8)
    password_confirm: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[constr(regex='^(admin|editor|viewer)$')] = None
    two_factor_enabled: Optional[bool] = None
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    id: UUID
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class User(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None 