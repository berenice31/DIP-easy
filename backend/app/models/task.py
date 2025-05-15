from sqlalchemy import Column, String, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.sql import func

class Task(Base):
    __tablename__ = "tasks"

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    generation_id = Column(PGUUID, ForeignKey("generations.id", ondelete="CASCADE"), nullable=False)
    task_type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    result = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    generation = relationship("Generation", back_populates="tasks")
    logs = relationship("Log", back_populates="task") 