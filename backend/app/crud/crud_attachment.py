from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.attachment import Attachment
from app.schemas.attachment import AttachmentCreate, AttachmentUpdate


class CRUDAttachment(CRUDBase[Attachment, AttachmentCreate, AttachmentUpdate]):
    def get_multi_by_product(self, db: Session, *, product_id: UUID) -> List[Attachment]:
        return db.query(self.model).filter(self.model.product_id == str(product_id)).all()


attachment = CRUDAttachment(Attachment) 