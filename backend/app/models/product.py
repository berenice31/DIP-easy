from datetime import datetime
from uuid import UUID
from sqlalchemy import Column, String, Float, Boolean, Date, DateTime, func, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from enum import Enum
import sqlalchemy as sa

from app.db.base import Base

class ProductStatus(str, Enum):
    DRAFT = "DRAFT"
    VALIDATED = "VALIDATED"

class Product(Base):
    __tablename__ = "products"

    id = Column(PGUUID, primary_key=True, server_default=func.gen_random_uuid())
    
    # Étape 0 : Infos client
    nom_client = Column(String, nullable=True)
    marque = Column(String, nullable=True)
    gamme = Column(String, nullable=True)
    # Étape 1 : Informations produit
    nom_commercial = Column(String, nullable=True)
    nom_produit = Column(String, nullable=True)
    format = Column(String, nullable=True)
    version = Column(String, nullable=True)
    fournisseur = Column(String, nullable=True)
    ref_formule = Column(String, nullable=True)
    ref_produit = Column(String, nullable=True)
    date_mise_marche = Column(Date, nullable=True)
    resp_mise_marche = Column(String, nullable=True)
    faconnerie = Column(String, nullable=True)

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

    # Progression globale (%)
    progression = Column(sa.Integer(), nullable=False, server_default="0")

    # Lien propriétaire
    user_id = Column(PGUUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Google Drive – dossier racine du produit (ex : « Client/Produit »)
    drive_folder_id = Column(String, nullable=True)

    # Audit
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    status = Column(SAEnum("DRAFT", "VALIDATED", name="product_status", native_enum=False), nullable=False, server_default="DRAFT")

    # Relations
    # attachments = relationship(
    #     "Attachment",
    #     backref="product",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True,
    # ) 