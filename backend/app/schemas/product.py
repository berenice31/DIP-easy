from datetime import date, datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, root_validator
from enum import Enum
from app.core.config import settings

# Shared properties
class ProductStatus(str, Enum):
    DRAFT = "DRAFT"
    VALIDATED = "VALIDATED"

class ProductBase(BaseModel):
    nom_client: Optional[str] = None
    marque: Optional[str] = None
    gamme: Optional[str] = None
    nom_produit: Optional[str] = None
    format: Optional[str] = None
    version: Optional[str] = None
    nom_commercial: Optional[str] = None
    fournisseur: Optional[str] = None
    ref_formule: Optional[str] = None
    ref_produit: Optional[str] = None
    date_mise_marche: Optional[date] = None
    resp_mise_marche: Optional[str] = None
    faconnerie: Optional[str] = None
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
    progression: int = 0
    status: ProductStatus = ProductStatus.DRAFT

    ingredients: Optional[List["IngredientCreate"]] = []
    stability_tests: Optional[List["StabilityTestCreate"]] = []
    compatibility_tests: Optional[List["CompatibilityTestCreate"]] = []

    @root_validator
    def validate_required_if_validated(cls, values):
        if not settings.STRICT_PRODUCT_VALIDATION:
            return values

        if values.get("status") == ProductStatus.VALIDATED:
            required = [
                "nom_commercial",
                "fournisseur",
                "ref_formule",
                "date_mise_marche",
                "resp_mise_marche",
                "faconnerie",
            ]
            missing = [f for f in required if not values.get(f)]
            if missing:
                raise ValueError(f"Missing required fields for validated product: {', '.join(missing)}")
        return values

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
    status: ProductStatus

    ingredients: List["Ingredient"] = []
    stability_tests: List["StabilityTest"] = []
    compatibility_tests: List["CompatibilityTest"] = []

    class Config:
        orm_mode = True

# Additional properties to return via API
class Product(ProductInDBBase):
    pass

# Additional properties stored in DB
class ProductInDB(ProductInDBBase):
    pass

# Forward references
from .ingredient import Ingredient, IngredientCreate
from .stability_test import StabilityTest, StabilityTestCreate
from .compatibility_test import CompatibilityTest, CompatibilityTestCreate

ProductBase.update_forward_refs()
ProductInDBBase.update_forward_refs()
ProductCreate.update_forward_refs()
ProductUpdate.update_forward_refs()
Product.update_forward_refs()
ProductInDB.update_forward_refs() 