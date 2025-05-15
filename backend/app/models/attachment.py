from sqlalchemy import Column, String, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.sql import func

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    product_id = Column(PGUUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    field_key = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    mime_type = Column(String, nullable=True)
    url = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    product = relationship("Product", backref="attachments") 