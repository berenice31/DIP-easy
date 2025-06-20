from sqlalchemy import Column, String, Float, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from app.models.ingredient import Ingredient
from app.models.stabilite import Stabilite
from app.models.compatibilite import Compatibilite

class Product(Base):
    __tablename__ = "products"
    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(PGUUID, ForeignKey('users.id'), nullable=True)
    nom_commercial = Column(String, nullable=False)
    ref_formule = Column(String, nullable=False)
    ref_produit = Column(String, nullable=True)
    date_mise_marche = Column(Date, nullable=False)
    resp_mise_marche = Column(String, nullable=False)
    faconnerie = Column(String, nullable=False)
    pc_ph = Column(Float, nullable=True)
    pc_densite = Column(Float, nullable=True)
    pc_organoleptiques = Column(String, nullable=True)
    pao_theorique = Column(String, nullable=True)
    pao_valide = Column(String, nullable=True)
    util_descr = Column(String, nullable=True)
    util_precaution = Column(String, nullable=True)
    tox_nanomaterials = Column(Boolean, nullable=False, default=False)
    ei_signalements = Column(String, nullable=True)
    autres_tests = Column(String, nullable=True)
    effets_revendiques = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    # Relations
    ingredients = relationship("Ingredient", back_populates="product", cascade="all, delete-orphan")
    stabilites = relationship("Stabilite", back_populates="product", cascade="all, delete-orphan")
    compatibilites = relationship("Compatibilite", back_populates="product", cascade="all, delete-orphan")

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey('products.id', ondelete='CASCADE'))
    ingr_nom_inci = Column(String, nullable=True)
    ingr_fonction = Column(String, nullable=True)
    ingr_pourcent_min = Column(Float, nullable=True)
    ingr_pourcent_max = Column(Float, nullable=True)
    ingr_cas = Column(String, nullable=True)
    ingr_provenance = Column(String, nullable=True)
    ingr_specif = Column(String, nullable=True)
    product = relationship("Product", back_populates="ingredients")

class Stabilite(Base):
    __tablename__ = "stabilites"
    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey('products.id', ondelete='CASCADE'))
    stab_temperature = Column(String, nullable=True)
    stab_duree = Column(String, nullable=True)
    stab_observation = Column(String, nullable=True)
    stab_rapport = Column(String, nullable=True)  # lien ou ID de fichier
    product = relationship("Product", back_populates="stabilites")

class Compatibilite(Base):
    __tablename__ = "compatibilites"
    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    product_id = Column(PGUUID, ForeignKey('products.id', ondelete='CASCADE'))
    comp_temp = Column(String, nullable=True)
    comp_duree = Column(String, nullable=True)
    comp_rapport = Column(String, nullable=True)  # lien ou ID de fichier
    product = relationship("Product", back_populates="compatibilites") 