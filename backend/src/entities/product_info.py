from sqlalchemy import Column, Integer, String, Date
from src.database.base import Base

class ProductInfo(Base):
    __tablename__ = "product_info"

    id = Column(Integer, primary_key=True, index=True)
    nom_commercial = Column(String, nullable=False)
    ref_formule = Column(String)
    ref_produit = Column(String, nullable=False)
    date_mise_marche = Column(Date)
    resp_mise_marche = Column(String)
    faconnerie = Column(String) 