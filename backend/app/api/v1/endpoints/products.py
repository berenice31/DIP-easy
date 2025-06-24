from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import cast, String

from app import crud, models, schemas
from app.api import deps
from app.schemas.product import ProductStatus

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
    products = (
        db.query(models.Product)
        .filter(cast(models.Product.user_id, String) == str(current_user.id))
        .offset(skip)
        .limit(limit)
        .all()
    )
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
    product = crud.product.create(db=db, obj_in=product_in, user_id=current_user.id)
    return schemas.Product.from_orm(product)

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
    product = crud.product.get(db=db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    product = crud.product.update(db=db, db_obj=product, obj_in=product_in)
    return schemas.Product.from_orm(product)

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
    product = crud.product.get(db=db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
    product = crud.product.get(db=db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Convert to schema BEFORE deleting to avoid SQLAlchemy "deleted instance" errors
    product_data = schemas.Product.from_orm(product)

    crud.product.remove(db=db, id=str(product_id))
    return product_data

@router.put("/{product_id}/submit", response_model=schemas.Product)
def submit_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Product:
    """Validate and mark product as VALIDATED"""
    product = crud.product.get(db=db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    if product.status == ProductStatus.VALIDATED:
        return product
    try:
        product = crud.product.submit(db=db, db_obj=product)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return schemas.Product.from_orm(product) 