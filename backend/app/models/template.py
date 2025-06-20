from sqlalchemy import Column, String, DateTime, JSON, Text, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.sql import func
from app.db.base import Base

class Template(Base):
    __tablename__ = "templates"
    __table_args__ = (UniqueConstraint("name", "version", name="uq_template_name_version"),)

    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    toc = Column(Text, nullable=False, default="[]")
    style_config = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()) 