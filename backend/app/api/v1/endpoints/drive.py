from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Body
from sqlalchemy.orm import Session
import json
from app.api import deps
from app import crud, models

router = APIRouter()


@router.get("/", summary="Get current user's Drive configuration")
def get_drive_config(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Retourne l'état de configuration Drive pour l'utilisateur courant."""
    key_credentials = f"drive_credentials_{current_user.id}"
    key_folder = f"drive_root_folder_id_{current_user.id}"

    creds = crud.setting.get_value(db, key_credentials)
    folder_id = crud.setting.get_value(db, key_folder)
    return {
        "configured": creds is not None,
        "root_folder_id": folder_id,
    }


@router.post("/credentials", summary="Upload service account JSON (user scope)")
async def upload_credentials(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Enregistre le JSON de credentials pour l'utilisateur courant."""
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un JSON")
    content = await file.read()
    try:
        json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON invalide")

    key_credentials = f"drive_credentials_{current_user.id}"
    crud.setting.set_value(
        db,
        key_credentials,
        content.decode("utf-8"),
        f"Google Drive service account JSON for user {current_user.id}",
    )
    return {"detail": "Credentials enregistrés"}


@router.post("/folder", summary="Set Drive root folder ID (user scope)")
async def set_drive_folder(
    *,
    db: Session = Depends(deps.get_db),
    folder_id: str = Body(..., embed=True),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Définit le dossier Drive racine pour l'utilisateur courant."""
    key_folder = f"drive_root_folder_id_{current_user.id}"
    crud.setting.set_value(
        db,
        key_folder,
        folder_id,
        f"Google Drive root folder for user {current_user.id}",
    )
    return {"detail": "Folder ID enregistré"} 