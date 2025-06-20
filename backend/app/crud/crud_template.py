from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from app.crud.base import CRUDBase
from app.models.template import Template
from app.schemas.template import TemplateCreate, Template as TemplateSchema

class CRUDTemplate(CRUDBase[Template, TemplateCreate, TemplateCreate]):
    """CRUD spécifique aux modèles de documents (.docx)."""

    def create_with_file(
        self, db: Session, *, obj_in: TemplateCreate, drive_file_id: str
    ) -> Template:
        # Récupérer la version la plus haute pour ce nom
        count_existing = db.query(Template).filter(Template.name == obj_in.name).count()
        next_version = str(count_existing + 1)
        db_obj = Template(
            name=obj_in.name,
            version=next_version,
            drive_file_id=drive_file_id,
            toc="[]",
            style_config="{}",
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_template = CRUDTemplate(Template) 