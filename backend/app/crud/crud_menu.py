from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.menu import Menu, MenuItem
from app.schemas.menu import MenuCreate, MenuUpdate, MenuItemCreate, MenuItemUpdate

class CRUDMenu(CRUDBase[Menu, MenuCreate, MenuUpdate]):
    def create_with_items(
        self, db: Session, *, obj_in: MenuCreate, user_id: str
    ) -> Menu:
        db_obj = Menu(
            name=obj_in.name,
            user_id=user_id,
        )
        db.add(db_obj)
        db.flush()  # Pour obtenir l'ID du menu

        if obj_in.items:
            for item in obj_in.items:
                db_item = MenuItem(
                    **item.model_dump(),
                    menu_id=db_obj.id
                )
                db.add(db_item)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: str, skip: int = 0, limit: int = 100
    ) -> List[Menu]:
        return (
            db.query(self.model)
            .filter(Menu.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_with_items(
        self, db: Session, *, db_obj: Menu, obj_in: MenuUpdate
    ) -> Menu:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field != "items":
                setattr(db_obj, field, value)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def add_menu_item(
        self, db: Session, *, menu_id: str, item_in: MenuItemCreate
    ) -> MenuItem:
        db_item = MenuItem(**item_in.model_dump(), menu_id=menu_id)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    def update_menu_item(
        self, db: Session, *, item_id: str, item_in: MenuItemUpdate
    ) -> Optional[MenuItem]:
        db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not db_item:
            return None

        update_data = item_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)

        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    def delete_menu_item(self, db: Session, *, item_id: str) -> bool:
        db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not db_item:
            return False

        db.delete(db_item)
        db.commit()
        return True

menu = CRUDMenu(Menu) 