from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Body
from sqlalchemy.orm import Session
import json

from app.api import deps
from app import crud, models

router = APIRouter()

SETTINGS_CREDENTIALS = "drive_credentials"
SETTINGS_FOLDER = "drive_root_folder_id"

@router.get("/", tags=["admin"], summary="Get Drive configuration")
def get_drive_config(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
):
    creds = crud.setting.get_value(db, SETTINGS_CREDENTIALS)
    folder_id = crud.setting.get_value(db, SETTINGS_FOLDER)
    return {
        "configured": creds is not None,
        "root_folder_id": folder_id,
    }

@router.post("/credentials", tags=["admin"], summary="Upload service account JSON")
async def upload_credentials(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_admin_user),
):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un JSON")
    content = await file.read()
    try:
        json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON invalide")

    crud.setting.set_value(db, SETTINGS_CREDENTIALS, content.decode("utf-8"), "Google Drive service account JSON")
    return {"detail": "Credentials saved"}

@router.post("/folder", tags=["admin"], summary="Set Drive root folder ID")
async def set_drive_folder(
    *,
    db: Session = Depends(deps.get_db),
    folder_id: str = Body(..., embed=True),
    current_user: models.User = Depends(deps.get_current_admin_user),
):
    crud.setting.set_value(db, SETTINGS_FOLDER, folder_id, "Google Drive root folder")
    return {"detail": "Folder ID saved"} 