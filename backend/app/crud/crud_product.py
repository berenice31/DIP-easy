from typing import List, Optional, Dict, Any, Union
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductStatus
from app.models import Ingredient, StabilityTest, CompatibilityTest
from app.services.google_drive import google_drive_service

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def create(self, db: Session, *, obj_in: ProductCreate, user_id: UUID) -> Product:
        # Utiliser dict() pour conserver les objets date/datetime
        obj_in_data = obj_in.dict()
        # Séparer les repeaters
        ingredients_data = obj_in_data.pop("ingredients", [])
        stabilites_data = obj_in_data.pop("stability_tests", obj_in_data.pop("stabilites", []))
        compatibilites_data = obj_in_data.pop("compatibility_tests", obj_in_data.pop("compatibilites", []))
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.flush()  # Pour obtenir l'id du produit
        # --------------------------------------------------------------
        # Création des dossiers Google Drive correspondants (avant commit)
        # --------------------------------------------------------------
        try:
            client_folder = (obj_in.nom_client or "SansClient").strip() or "SansClient"
            product_folder = (obj_in.nom_produit or str(db_obj.id)).strip() or str(db_obj.id)
            ref_formule_folder = (obj_in.ref_formule or "REF").strip() or "REF"

            # 1. Client/Produit  → on stocke cet ID dans la colonne drive_folder_id
            product_drive_id = google_drive_service.ensure_folder([client_folder, product_folder])

            # 2. Produit/Ref_formule
            formula_drive_id = google_drive_service.ensure_folder([client_folder, product_folder, ref_formule_folder])

            # 3. Produit/Ref_formule/Annexes
            _ = google_drive_service.ensure_folder([client_folder, product_folder, ref_formule_folder, "Annexes"])

            # Sauvegarde sur l'objet avant commit final
            db_obj.drive_folder_id = product_drive_id
        except Exception:
            # On ignore silencieusement les erreurs Drive afin de ne pas bloquer la création
            pass

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
        # Rafraîchir l'objet pour récupérer les nouvelles valeurs (ex. progression + drive_folder_id)
        db.refresh(db_obj)
        # Pas besoin de refresh sous SQLite, l'objet est déjà à jour
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
        stabilites_data = update_data.pop("stability_tests", update_data.pop("stabilites", None))
        compatibilites_data = update_data.pop("compatibility_tests", update_data.pop("compatibilites", None))
        # Mise à jour directe via requête pour compatibilité SQLite/UUID
        if update_data:
            from sqlalchemy import cast, String
            db.query(self.model).filter(cast(self.model.id, String) == str(db_obj.id)).update(update_data)
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
        # Rafraîchir l'objet pour récupérer les nouvelles valeurs (ex. progression)
        db.refresh(db_obj)
        # Pas besoin de refresh sous SQLite, l'objet est déjà à jour
        return db_obj

    def submit(self, db: Session, *, db_obj: Product) -> Product:
        """Validate and set product status to VALIDATED"""
        from fastapi.encoders import jsonable_encoder
        data = jsonable_encoder(db_obj)
        data["status"] = ProductStatus.VALIDATED
        # Validation via Pydantic; will raise ValueError if missing fields
        from app.schemas.product import Product as ProductSchema
        ProductSchema(**data)
        db_obj.status = ProductStatus.VALIDATED
        db.add(db_obj)
        db.commit()
        return db_obj

product = CRUDProduct(Product) 