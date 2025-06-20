from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class IngredientBase(BaseModel):
    ingr_nom_inci: str
    ingr_fonction: str
    ingr_pourcent_min: Optional[float] = None
    ingr_pourcent_max: Optional[float] = None
    ingr_cas: Optional[str] = None
    ingr_provenance: Optional[str] = None
    ingr_specif: Optional[str] = None

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(IngredientBase):
    ingr_nom_inci: Optional[str] = None
    ingr_fonction: Optional[str] = None

class IngredientInDBBase(IngredientBase):
    id: UUID
    product_id: UUID
    class Config:
        orm_mode = True

class Ingredient(IngredientInDBBase):
    pass

class IngredientInDB(IngredientInDBBase):
    created_at: datetime = None
    updated_at: datetime = None 