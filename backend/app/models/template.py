from sqlalchemy import Column, String, DateTime, JSON, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.sql import func
from app.db.base import Base

class Template(Base):
    __tablename__ = "templates"
    __table_args__ = (UniqueConstraint("name", "version", name="uq_template_name_version"),)

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    toc = Column(JSON, nullable=False, default=list)
    style_config = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()) 