from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database.session import get_db
from src.controllers.product_info import create_product_info, get_product_info, get_all_product_infos
from src.schemas.product_info import ProductInfoCreate, ProductInfo as ProductInfoSchema

router = APIRouter()

@router.post("/", response_model=ProductInfoSchema)
def create_product_info_route(product_info: ProductInfoCreate, db: Session = Depends(get_db)):
    try:
        return create_product_info(db=db, product_info=product_info)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{product_info_id}", response_model=ProductInfoSchema)
def read_product_info(product_info_id: int, db: Session = Depends(get_db)):
    db_product_info = get_product_info(db, product_info_id=product_info_id)
    if db_product_info is None:
        raise HTTPException(status_code=404, detail="Product info not found")
    return db_product_info

@router.get("/", response_model=List[ProductInfoSchema])
def read_product_infos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_product_infos(db, skip=skip, limit=limit) 