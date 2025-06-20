from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app import schemas, models, crud
from app.api import deps
from app.services.google_drive import google_drive_service

router = APIRouter()

@router.post("/", response_model=schemas.Template)
async def upload_template(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    name: str = Form(...),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Upload d'un fichier .docx comme nouveau modèle."""
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers .docx sont acceptés")
    drive_file_id = google_drive_service.upload(file.file, file.filename)
    thumb_url = google_drive_service.get_thumbnail_url(drive_file_id)
    template_in = schemas.TemplateCreate(name=name, file_name=file.filename)
    try:
        template = crud.template.create_with_file(
            db, obj_in=template_in, drive_file_id=drive_file_id
        )
        template.thumbnail_url = thumb_url
        db.add(template)
        db.commit()
        db.refresh(template)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return template

@router.get("/", response_model=List[schemas.Template])
def list_templates(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    templates = crud.template.get_multi(db, skip=skip, limit=limit)
    return templates

@router.delete("/{template_id}", response_model=schemas.Template)
def delete_template(
    *,
    db: Session = Depends(deps.get_db),
    template_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    template = crud.template.get(db, id=str(template_id))
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    # Supprimer le fichier sur Google Drive (silencieux si Drive non configuré)
    google_drive_service.delete(template.drive_file_id)
    template = crud.template.remove(db, id=str(template_id))
    return template 