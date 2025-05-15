from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

# Shared properties
class ProductBase(BaseModel):
    nom_commercial: str
    fournisseur: str
    ref_formule: str
    ref_produit: Optional[str] = None
    date_mise_marche: date
    resp_mise_marche: str
    faconnerie: str
    pc_ph: Optional[float] = None
    pc_densite: Optional[float] = None
    pc_organoleptiques: Optional[str] = None
    pao_theorique: Optional[str] = None
    pao_valide: Optional[str] = None
    util_descr: Optional[str] = None
    util_precaution: Optional[str] = None
    tox_nanomaterials: bool = False
    ei_signalements: Optional[str] = None
    autres_tests: Optional[str] = None
    effets_revendiques: Optional[str] = None

# Properties to receive via API on creation
class ProductCreate(ProductBase):
    pass

# Properties to receive via API on update
class ProductUpdate(ProductBase):
    nom_commercial: Optional[str] = None
    fournisseur: Optional[str] = None
    ref_formule: Optional[str] = None
    date_mise_marche: Optional[date] = None
    resp_mise_marche: Optional[str] = None
    faconnerie: Optional[str] = None

# Properties shared by models stored in DB
class ProductInDBBase(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Product(ProductInDBBase):
    pass

# Additional properties stored in DB
class ProductInDB(ProductInDBBase):
    pass 