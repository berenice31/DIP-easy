from .user import User, UserCreate, UserInDB, UserUpdate
from .product import Product, ProductCreate, ProductInDB, ProductUpdate, ProductBase, ProductInDBBase
from .menu import Menu, MenuCreate, MenuUpdate, MenuItem, MenuItemCreate, MenuItemUpdate, MenuItemInDB
from .ingredient import Ingredient, IngredientCreate, IngredientUpdate, IngredientInDB
from .stability_test import StabilityTest, StabilityTestCreate, StabilityTestUpdate, StabilityTestInDB
from .compatibility_test import CompatibilityTest, CompatibilityTestCreate, CompatibilityTestUpdate, CompatibilityTestInDB
from .template import Template, TemplateCreate
from .generation import Generation, GenerationCreate
from .attachment import Attachment, AttachmentCreate, AttachmentUpdate

# Mettre à jour les forward refs Pydantic
ProductBase.update_forward_refs()
ProductCreate.update_forward_refs()
ProductUpdate.update_forward_refs()
ProductInDBBase.update_forward_refs()
Product.update_forward_refs()
ProductInDB.update_forward_refs()
Attachment.update_forward_refs() 