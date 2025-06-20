from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    ingr_nom_inci = Column(String, nullable=False)
    ingr_fonction = Column(String, nullable=False)
    ingr_pourcent_min = Column(Float, nullable=True)
    ingr_pourcent_max = Column(Float, nullable=True)
    ingr_cas = Column(String, nullable=True)
    ingr_provenance = Column(String, nullable=True)
    ingr_specif = Column(String, nullable=True)

    product = relationship("Product", backref="ingredients") 