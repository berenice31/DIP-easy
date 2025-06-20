from typing import List, Optional
from uuid import UUID

class Ingredient(BaseModel):
    id: Optional[UUID]
    ingr_nom_inci: Optional[str]
    ingr_fonction: Optional[str]
    ingr_pourcent_min: Optional[float]
    ingr_pourcent_max: Optional[float]
    ingr_cas: Optional[str]
    ingr_provenance: Optional[str]
    ingr_specif: Optional[str]

class Stabilite(BaseModel):
    id: Optional[UUID]
    stab_temperature: Optional[str]
    stab_duree: Optional[str]
    stab_observation: Optional[str]
    stab_rapport: Optional[str]

class Compatibilite(BaseModel):
    id: Optional[UUID]
    comp_temp: Optional[str]
    comp_duree: Optional[str]
    comp_rapport: Optional[str]

class ProductBase(BaseModel):
    user_id: Optional[UUID]
    nom_commercial: str
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
    ingredients: List[Ingredient] = []
    stabilites: List[Stabilite] = []
    compatibilites: List[Compatibilite] = [] 