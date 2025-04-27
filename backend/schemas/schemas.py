from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    reference: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    status: str
    completeness: float
    created_at: datetime
    updated_at: datetime
    last_generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 