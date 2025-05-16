from sqlalchemy import Column, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid

class Menu(Base):
    __tablename__ = "menus"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Relations
    items = relationship("MenuItem", back_populates="menu", cascade="all, delete-orphan")
    user = relationship("User", back_populates="menus")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    menu_id = Column(String, ForeignKey("menus.id"), nullable=False)

    # Relations
    menu = relationship("Menu", back_populates="items") 