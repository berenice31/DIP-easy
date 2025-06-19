from typing import List, Optional, Dict, Any, Union
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.models import Ingredient, StabilityTest, CompatibilityTest

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def create(self, db: Session, *, obj_in: ProductCreate, user_id: UUID) -> Product:
        obj_in_data = jsonable_encoder(obj_in)
        # Séparer les repeaters
        ingredients_data = obj_in_data.pop("ingredients", [])
        stabilites_data = obj_in_data.pop("stabilites", [])
        compatibilites_data = obj_in_data.pop("compatibilites", [])
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.flush()  # Pour obtenir l'id du produit
        # Ajout des enfants
        for ingr in ingredients_data:
            ingr_obj = Ingredient(**ingr, product_id=db_obj.id)
            db.add(ingr_obj)
        for stab in stabilites_data:
            stab_obj = StabilityTest(**stab, product_id=db_obj.id)
            db.add(stab_obj)
        for comp in compatibilites_data:
            comp_obj = CompatibilityTest(**comp, product_id=db_obj.id)
            db.add(comp_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: Product,
        obj_in: Union[ProductUpdate, Dict[str, Any]]
    ) -> Product:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        # Gestion des repeaters
        ingredients_data = update_data.pop("ingredients", None)
        stabilites_data = update_data.pop("stabilites", None)
        compatibilites_data = update_data.pop("compatibilites", None)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.flush()
        # Synchronisation des enfants (ici simplifiée : suppression et recréation)
        if ingredients_data is not None:
            db.query(Ingredient).filter_by(product_id=db_obj.id).delete()
            for ingr in ingredients_data:
                ingr_obj = Ingredient(**ingr, product_id=db_obj.id)
                db.add(ingr_obj)
        if stabilites_data is not None:
            db.query(StabilityTest).filter_by(product_id=db_obj.id).delete()
            for stab in stabilites_data:
                stab_obj = StabilityTest(**stab, product_id=db_obj.id)
                db.add(stab_obj)
        if compatibilites_data is not None:
            db.query(CompatibilityTest).filter_by(product_id=db_obj.id).delete()
            for comp in compatibilites_data:
                comp_obj = CompatibilityTest(**comp, product_id=db_obj.id)
                db.add(comp_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

product = CRUDProduct(Product) 