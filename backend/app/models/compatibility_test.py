from sqlalchemy import Column, String, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship, backref
from app.db.base import Base
from sqlalchemy.sql import func

class CompatibilityTest(Base):
    __tablename__ = "compatibility_tests"

    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    test_type = Column(String, nullable=False)
    test_date = Column(DateTime(timezone=True), nullable=False)
    result = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    product = relationship(
        "Product",
        backref=backref("compatibility_tests", passive_deletes=True),
        passive_deletes=True,
    ) 