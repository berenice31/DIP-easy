from pydantic import BaseModel
from datetime import date
from typing import Optional

class ProductInfoBase(BaseModel):
    nom_commercial: str
    ref_formule: Optional[str] = None
    ref_produit: str
    date_mise_marche: Optional[date] = None
    resp_mise_marche: Optional[str] = None
    faconnerie: Optional[str] = None

class ProductInfoCreate(ProductInfoBase):
    pass

class ProductInfo(ProductInfoBase):
    id: int

    class Config:
        from_attributes = True 