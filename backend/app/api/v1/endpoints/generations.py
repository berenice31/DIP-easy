from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.api import deps
from app.services.google_drive import google_drive_service
from app.services.docx_service import docx_service

router = APIRouter()

@router.post("/", response_model=schemas.Generation)
async def generate_document(
    *,
    db: Session = Depends(deps.get_db),
    template_id: UUID = Form(...),
    product_id: UUID = Form(...),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    template = crud.template.get(db, id=str(template_id))
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    product = crud.product.get(db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Téléchargement du modèle (stub)
    template_bytes = b"dummy"  # would be google_drive_service.download(template.drive_file_id)
    rendered_bytes = docx_service.render(template_bytes, context={"product": {}})
    drive_file_id = google_drive_service.upload(rendered_bytes, f"{product.nom_produit or 'document'}.docx")

    generation_in = schemas.GenerationCreate(product_id=product_id, template_id=template_id)
    generation = crud.generation.create_generation(db, obj_in=generation_in, drive_file_id=drive_file_id)
    return generation

@router.patch("/{generation_id}/finalize", response_model=schemas.Generation)
async def finalize_document(
    *,
    db: Session = Depends(deps.get_db),
    generation_id: UUID,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    generation = crud.generation.get(db, id=str(generation_id))
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    # Upload final file
    drive_file_id = google_drive_service.upload(file.file, file.filename)
    generation = crud.generation.update(db, db_obj=generation, obj_in={"drive_file_id": drive_file_id})
    # Passer le produit au statut VALIDATED
    product = crud.product.get(db, id=str(generation.product_id))
    if product:
        crud.product.update(db, db_obj=product, obj_in={"status": "VALIDATED"})
    return generation 