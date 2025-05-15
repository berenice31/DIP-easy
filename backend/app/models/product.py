from datetime import datetime
from uuid import UUID
from sqlalchemy import Column, String, Float, Boolean, Date, DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    
    # Étape 1 : Informations produit
    nom_commercial = Column(String, nullable=False)
    fournisseur = Column(String, nullable=False)
    ref_formule = Column(String, nullable=False)
    ref_produit = Column(String, nullable=True)
    date_mise_marche = Column(Date, nullable=False)
    resp_mise_marche = Column(String, nullable=False)
    faconnerie = Column(String, nullable=False)

    # Étape 3 : Caractéristiques physico-chimiques & PAO
    pc_ph = Column(Float, nullable=True)
    pc_densite = Column(Float, nullable=True)
    pc_organoleptiques = Column(String, nullable=True)
    pao_theorique = Column(String, nullable=True)
    pao_valide = Column(String, nullable=True)

    # Étape 6 : Utilisation normale
    util_descr = Column(String, nullable=True)
    util_precaution = Column(String, nullable=True)

    # Étape 8 : Toxicologie (usage simple)
    tox_nanomaterials = Column(Boolean, nullable=False, default=False)

    # Étape 9 : Effets indésirables
    ei_signalements = Column(String, nullable=True)

    # Étape 10 : Autres tests & effets revendiqués
    autres_tests = Column(String, nullable=True)
    effets_revendiques = Column(String, nullable=True)

    # Audit
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()) 