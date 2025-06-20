from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.setting import Setting

class CRUDSetting(CRUDBase[Setting, dict, dict]):
    def get_value(self, db: Session, key: str):
        setting = db.query(Setting).filter(Setting.key == key).first()
        return setting.value if setting else None

    def set_value(self, db: Session, key: str, value: str, description: str | None = None):
        setting = db.query(Setting).filter(Setting.key == key).first()
        if setting:
            setting.value = value
            if description is not None:
                setting.description = description
            db.add(setting)
        else:
            setting = Setting(key=key, value=value, description=description)
            db.add(setting)
        db.commit()
        db.refresh(setting)
        return setting

setting = CRUDSetting(Setting) 