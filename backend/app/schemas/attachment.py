from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AttachmentBase(BaseModel):
    product_id: UUID
    field_key: str
    alias: Optional[str] = None
    drive_file_id: str
    file_name: str
    mime_type: Optional[str] = None
    url: Optional[str] = None


class AttachmentCreate(AttachmentBase):
    pass


class AttachmentUpdate(BaseModel):
    alias: Optional[str] = None
    url: Optional[str] = None


class AttachmentInDBBase(AttachmentBase):
    id: UUID
    uploaded_at: datetime

    class Config:
        orm_mode = True


class Attachment(AttachmentInDBBase):
    pass


class AttachmentInDB(AttachmentInDBBase):
    pass 