from sqlalchemy import Column, String, DateTime, ForeignKey, CheckConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Generation(Base):
    __tablename__ = "generations"
    __table_args__ = (
        CheckConstraint("format IN ('docx','pdf')", name="chk_generation_format"),
        CheckConstraint("status IN ('pending','success','error')", name="chk_generation_status"),
    )

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    product_id = Column(PGUUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    template_id = Column(PGUUID, ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    format = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=True)
    status = Column(String, nullable=False)
    error_message = Column(String, nullable=True)
    initiated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    result = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    product = relationship("Product", backref="generations")
    template = relationship("Template", backref="generations")
    tasks = relationship("Task", back_populates="generation") 