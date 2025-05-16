from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Product])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> List[schemas.Product]:
    """
    Retrieve products.
    """
    products = crud.product.get_multi(db, skip=skip, limit=limit)
    return products

@router.post("/", response_model=schemas.Product)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.ProductCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Product:
    """
    Create new product.
    """
    product = crud.product.create(db=db, obj_in=product_in)
    return product

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID,
    product_in: schemas.ProductUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Product:
    """
    Update a product.
    """
    product = crud.product.get(db=db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.update(db=db, db_obj=product, obj_in=product_in)
    return product

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Product:
    """
    Get product by ID.
    """
    product = crud.product.get(db=db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}", response_model=schemas.Product)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Product:
    """
    Delete a product.
    """
    product = crud.product.get(db=db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.remove(db=db, id=product_id)
    return product 