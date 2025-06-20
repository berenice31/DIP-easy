from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Stabilite(Base):
    __tablename__ = "stabilites"
    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey('products.id', ondelete='CASCADE'))
    stab_temperature = Column(String, nullable=True)
    stab_duree = Column(String, nullable=True)
    stab_observation = Column(String, nullable=True)
    stab_rapport = Column(String, nullable=True)  # lien ou ID de fichier
    product = relationship("Product", back_populates="stabilites") 