from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

# Shared properties
class TemplateBase(BaseModel):
    name: str = Field(..., description="Nom logique du modèle")
    version: str = Field(..., description="Version du modèle")
    drive_file_id: str = Field(..., description="ID du fichier sur Google Drive")
    thumbnail_url: Optional[str] = None

# Properties to receive via API on creation
class TemplateCreate(BaseModel):
    name: str
    file_name: str

# Properties in DB (read)
class TemplateInDBBase(TemplateBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Template(TemplateInDBBase):
    pass

class TemplateInDB(TemplateInDBBase):
    pass 