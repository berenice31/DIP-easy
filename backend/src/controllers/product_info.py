from sqlalchemy.orm import Session
from src.entities.product_info import ProductInfo
from src.schemas.product_info import ProductInfoCreate, ProductInfo as ProductInfoSchema

def create_product_info(db: Session, product_info: ProductInfoCreate):
    db_product_info = ProductInfo(**product_info.dict())
    db.add(db_product_info)
    db.commit()
    db.refresh(db_product_info)
    return db_product_info

def get_product_info(db: Session, product_info_id: int):
    return db.query(ProductInfo).filter(ProductInfo.id == product_info_id).first()

def get_all_product_infos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProductInfo).offset(skip).limit(limit).all() 