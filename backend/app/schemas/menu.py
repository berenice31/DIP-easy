from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MenuItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=50)

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(MenuItemBase):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=50)

class MenuItemInDB(MenuItemBase):
    id: str
    menu_id: str

    class Config:
        from_attributes = True

class MenuItem(MenuItemInDB):
    pass

class MenuBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class MenuCreate(MenuBase):
    items: Optional[List[MenuItemCreate]] = None

class MenuUpdate(MenuBase):
    name: Optional[str] = Field(None, min_length=1, max_length=100)

class MenuInDB(MenuBase):
    id: str
    user_id: str
    items: List[MenuItemInDB] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Menu(MenuInDB):
    pass 