from sqlalchemy import Column, String, DateTime, ForeignKey, CheckConstraint, JSON, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.sql import func
from app.db.base import Base
from sqlalchemy.orm import relationship

class Log(Base):
    __tablename__ = "logs"
    __table_args__ = (
        CheckConstraint("level IN ('info','success','warning','error')", name="chk_log_level"),
    )

    id = Column(PGUUID, primary_key=True, server_default=text("uuid_generate_v4()"))
    task_id = Column(PGUUID, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=True)
    event_type = Column(String, nullable=False)
    entity_type = Column(String, nullable=True)
    entity_id = Column(PGUUID, nullable=True)
    user_id = Column(PGUUID, ForeignKey("users.id"), nullable=True)
    level = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    task = relationship("Task", back_populates="logs") 