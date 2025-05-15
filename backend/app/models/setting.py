from sqlalchemy import Column, String, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.sql import func

class Setting(Base):
    __tablename__ = "settings"

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    key = Column(String, nullable=False, unique=True)
    value = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()) 