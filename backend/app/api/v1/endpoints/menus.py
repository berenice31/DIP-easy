from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Menu])
def read_menus(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Récupérer tous les menus de l'utilisateur.
    """
    menus = crud.menu.get_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return menus

@router.post("/", response_model=schemas.Menu)
def create_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_in: schemas.MenuCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Créer un nouveau menu.
    """
    menu = crud.menu.create_with_items(
        db=db, obj_in=menu_in, user_id=current_user.id
    )
    return menu

@router.get("/{menu_id}", response_model=schemas.Menu)
def read_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: str,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Récupérer un menu par son ID.
    """
    menu = crud.menu.get(db=db, id=menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menu non trouvé")
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return menu

@router.put("/{menu_id}", response_model=schemas.Menu)
def update_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: str,
    menu_in: schemas.MenuUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Mettre à jour un menu.
    """
    menu = crud.menu.get(db=db, id=menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menu non trouvé")
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    menu = crud.menu.update_with_items(db=db, db_obj=menu, obj_in=menu_in)
    return menu

@router.delete("/{menu_id}", response_model=schemas.Menu)
def delete_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: str,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Supprimer un menu.
    """
    menu = crud.menu.get(db=db, id=menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menu non trouvé")
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    menu = crud.menu.remove(db=db, id=menu_id)
    return menu

@router.post("/{menu_id}/items", response_model=schemas.MenuItemInDB)
def create_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: str,
    item_in: schemas.MenuItemCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Ajouter un élément au menu.
    """
    menu = crud.menu.get(db=db, id=menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menu non trouvé")
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    item = crud.menu.add_menu_item(db=db, menu_id=menu_id, item_in=item_in)
    return item

@router.put("/items/{item_id}", response_model=schemas.MenuItemInDB)
def update_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: str,
    item_in: schemas.MenuItemUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Mettre à jour un élément du menu.
    """
    item = crud.menu.update_menu_item(db=db, item_id=item_id, item_in=item_in)
    if not item:
        raise HTTPException(status_code=404, detail="Élément non trouvé")
    menu = crud.menu.get(db=db, id=item.menu_id)
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return item

@router.delete("/items/{item_id}", response_model=bool)
def delete_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: str,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Supprimer un élément du menu.
    """
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Élément non trouvé")
    menu = crud.menu.get(db=db, id=item.menu_id)
    if menu.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return crud.menu.delete_menu_item(db=db, item_id=item_id) 