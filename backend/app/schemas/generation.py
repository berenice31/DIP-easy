from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field

class GenerationStatus(str):
    PENDING = "pending"
    SUCCESS = "success"
    ERROR = "error"

class GenerationBase(BaseModel):
    product_id: UUID
    template_id: UUID
    format: str = Field("docx", description="Format de sortie")
    status: str = Field(GenerationStatus.PENDING, description="Statut de la génération")

class GenerationCreate(BaseModel):
    product_id: UUID
    template_id: UUID

class GenerationInDBBase(GenerationBase):
    id: UUID
    drive_file_id: Optional[str] = None
    error_message: Optional[str] = None
    initiated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True

class Generation(GenerationInDBBase):
    pass 