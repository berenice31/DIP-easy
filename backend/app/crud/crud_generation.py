from sqlalchemy.orm import Session
from datetime import datetime
from app.crud.base import CRUDBase
from app.models.generation import Generation
from app.schemas.generation import GenerationCreate

class CRUDGeneration(CRUDBase[Generation, GenerationCreate, GenerationCreate]):
    def create_generation(
        self,
        db: Session,
        *,
        obj_in: GenerationCreate,
        drive_file_id: str,
    ) -> Generation:
        db_obj = Generation(
            product_id=obj_in.product_id,
            template_id=obj_in.template_id,
            format="docx",
            drive_file_id=drive_file_id,
            status="pending",
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

generation = CRUDGeneration(Generation) 