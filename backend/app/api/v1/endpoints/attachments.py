from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import pathlib

from app import schemas, models, crud
from app.api import deps
from app.services.google_drive import google_drive_service

router = APIRouter()


@router.post("/", response_model=schemas.Attachment)
async def upload_attachment(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID = Form(...),
    field_key: str = Form(...),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Upload d'une pièce jointe et création du modèle Attachment."""
    product = crud.product.get(db, id=str(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Map fixed alias based on field_key
    ALIAS_BY_FIELD = {
        "formula": "ingredients",
        "spf": "test_spf",
    }

    effective_alias = ALIAS_BY_FIELD.get(field_key, field_key)

    # Chemin Drive: <Client>/<Produit>/<Ref_formule>/Annexes
    client_folder = (product.nom_client or "SansClient").strip() or "SansClient"
    product_folder = (product.nom_produit or str(product.id)).strip() or str(product.id)
    ref_folder = (product.ref_formule or "REF").strip() or "REF"
    formula_drive_id = google_drive_service.ensure_folder([
        client_folder,
        product_folder,
        ref_folder,
        "Annexes",
    ])

    # Renomme le fichier selon l'alias avec l'extension d'origine
    ext = pathlib.Path(file.filename).suffix or ""
    stored_filename = f"{effective_alias}{ext}"

    drive_file_id = google_drive_service.upload(
        file.file,
        stored_filename,
        mime_type=file.content_type or "application/octet-stream",
        parent_id=formula_drive_id,
    )

    url = google_drive_service.get_thumbnail_url(drive_file_id)

    attachment_in = schemas.AttachmentCreate(
        product_id=product_id,
        field_key=field_key,
        alias=effective_alias,
        drive_file_id=drive_file_id,
        file_name=stored_filename,
        mime_type=file.content_type,
        url=url,
    )

    attachment = crud.attachment.create(db, obj_in=attachment_in)
    return attachment


@router.get("/product/{product_id}", response_model=list[schemas.Attachment])
async def list_attachments(
    *,
    db: Session = Depends(deps.get_db),
    product_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    return crud.attachment.get_multi_by_product(db, product_id=product_id)


@router.delete("/{attachment_id}", status_code=204)
async def delete_attachment(
    *,
    db: Session = Depends(deps.get_db),
    attachment_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    attachment = crud.attachment.get(db, id=str(attachment_id))
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    # Delete file on Drive (silently if fails)
    try:
        if attachment.drive_file_id:
            google_drive_service.delete(attachment.drive_file_id)
    except Exception:
        pass

    crud.attachment.remove(db, id=str(attachment_id))
    return 