from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import cast, String

from app import schemas, crud, models
from app.api import deps
from app.services.google_drive import google_drive_service
from app.services.docx_service import docx_service
from app.schemas.product import ProductStatus

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
    # Téléchargement du modèle depuis Google Drive
    template_bytes = google_drive_service.download(template.drive_file_id)
    if not template_bytes:
        raise HTTPException(
            status_code=424,
            detail="Template file unavailable on Google Drive (id may be deleted)",
        )

    # Préparation du contexte : on sérialise le produit et le template
    from app.schemas.product import Product as ProductSchema
    product_data = ProductSchema.from_orm(product).dict()

    # Récupère les pièces jointes
    attachment_objs = crud.attachment.get_multi_by_product(db, product_id=product_id)
    attachments = [schemas.Attachment.from_orm(a).dict() for a in attachment_objs]
    annexes = {
        (a.alias or a.file_name): schemas.Attachment.from_orm(a).dict() for a in attachment_objs if (a.alias or a.file_name)
    }

    # Contexte pour docxtpl
    rendered_bytes = docx_service.render(
        template_bytes,
        context={
            "product": product_data,
            "attachments": attachments,
            "annexes": annexes,
        },
    )
    if not rendered_bytes:
        raise HTTPException(status_code=500, detail="Failed to render DOCX document")

    def _clean(s: str | None) -> str:
        return (s or "").strip().replace(" ", "_")

    filename_parts = [
        _clean(product.nom_client),
        _clean(product.marque),
        _clean(product.nom_produit or "document"),
    ]
    filename = "-".join(filter(None, filename_parts)) + ".docx"

    # Détermine le dossier Drive cible : <Client>/<Produit>/<Ref_formule>
    client_folder = (product.nom_client or "SansClient").strip() or "SansClient"
    product_folder = (product.nom_produit or str(product.id)).strip() or str(product.id)
    ref_folder = (product.ref_formule or "REF").strip() or "REF"
    formula_drive_id = google_drive_service.ensure_folder([client_folder, product_folder, ref_folder])

    drive_file_id = google_drive_service.upload(rendered_bytes, filename, parent_id=formula_drive_id)

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
    # Upload dans le dossier ref_formule
    product = crud.product.get(db, id=str(generation.product_id))
    client_folder = (product.nom_client or "SansClient").strip() or "SansClient"
    product_folder = (product.nom_produit or str(product.id)).strip() or str(product.id)
    ref_folder = (product.ref_formule or "REF").strip() or "REF"
    formula_drive_id = google_drive_service.ensure_folder([client_folder, product_folder, ref_folder])

    drive_file_id = google_drive_service.upload(file.file, file.filename, parent_id=formula_drive_id)
    generation = crud.generation.update(
        db,
        db_obj=generation,
        obj_in={"drive_file_id": drive_file_id, "status": "success", "completed_at": datetime.utcnow()},
    )
    return generation

@router.get("/", response_model=list[schemas.Generation])
async def list_generations(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    gens = (
        db.query(models.Generation)
        .join(models.Product, models.Generation.product_id == models.Product.id)
        .filter(cast(models.Product.user_id, String) == str(current_user.id))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return gens

@router.delete("/{generation_id}", status_code=204)
async def delete_generation(
    *,
    db: Session = Depends(deps.get_db),
    generation_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    generation = crud.generation.get(db, id=str(generation_id))
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    # Optionally delete file from Drive
    if generation.drive_file_id:
        try:
            google_drive_service.delete(generation.drive_file_id)
        except Exception:
            pass
    crud.generation.remove(db, id=str(generation_id))
    return

# ---------------------------------------------------------------------------
# Validation -> PDF
# ---------------------------------------------------------------------------

@router.patch("/{generation_id}/validate", response_model=schemas.Generation)
async def validate_generation(
    *,
    db: Session = Depends(deps.get_db),
    generation_id: UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Convertit la génération DOCX en PDF et marque le produit VALIDATED."""
    generation = crud.generation.get(db, id=str(generation_id))
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    if generation.status == "success":
        return generation  # déjà validé

    # Télécharge / convertit via Google Drive
    pdf_bytes = google_drive_service.convert_to_pdf(generation.drive_file_id)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="Cannot convert document to PDF")

    # Fusionne les annexes PDF
    try:
        from io import BytesIO
        from pypdf import PdfReader, PdfWriter  # type: ignore

        attachment_objs = [
            a for a in crud.attachment.get_multi_by_product(db, product_id=generation.product_id)
            if a.mime_type == "application/pdf"
        ]
        if attachment_objs:
            # Prépare dict alias -> annex PdfReader
            annex_readers: dict[str, PdfReader] = {}
            for a in attachment_objs:
                alias = a.alias or a.file_name
                annex_bytes = google_drive_service.download(a.drive_file_id)
                if annex_bytes:
                    annex_readers[alias] = PdfReader(BytesIO(annex_bytes))

            # Parcours du document principal
            main_reader = PdfReader(BytesIO(pdf_bytes))
            writer = PdfWriter()

            for page_idx, page in enumerate(main_reader.pages):
                text = page.extract_text() or ""
                writer.add_page(page)

                # Recherche marqueurs dans cette page
                for alias, annex_reader in annex_readers.items():
                    marker = f"[[ANNEXE:{alias}]]"
                    if marker in text:
                        # Insère toutes les pages de l'annexe juste après la page courante
                        for annex_page in annex_reader.pages:
                            writer.add_page(annex_page)

            out_buf = BytesIO()
            writer.write(out_buf)
            pdf_bytes = out_buf.getvalue()
    except Exception:
        # En cas d'erreur de fusion, on conserve le PDF original
        import logging
        logging.exception("Erreur fusion PDF annexes")
        pass

    # Upload PDF dans le même dossier que la génération initiale
    product = crud.product.get(db, id=str(generation.product_id))
    client_folder = (product.nom_client or "SansClient").strip() or "SansClient"
    product_folder = (product.nom_produit or str(product.id)).strip() or str(product.id)
    ref_folder = (product.ref_formule or "REF").strip() or "REF"
    formula_drive_id = google_drive_service.ensure_folder([client_folder, product_folder, ref_folder])

    # Construit le même nom que le DOCX initial
    def _clean(s: str | None) -> str:
        return (s or "").strip().replace(" ", "_")

    filename_parts = [
        _clean(product.nom_client),
        _clean(product.marque),
        _clean(product.nom_produit or "document"),
    ]
    filename = "-".join(filter(None, filename_parts)) + ".pdf"

    pdf_drive_id = google_drive_service.upload(
        pdf_bytes,
        filename,
        mime_type="application/pdf",
        parent_id=formula_drive_id,
    )

    generation = crud.generation.update(
        db,
        db_obj=generation,
        obj_in={
            "drive_file_id": pdf_drive_id,
            "format": "pdf",
            "status": "success",
            "completed_at": datetime.utcnow(),
        },
    )

    # Mise à jour du produit associé uniquement si complet
    if product:
        required = [
            "nom_commercial",
            "fournisseur",
            "ref_formule",
            "date_mise_marche",
            "resp_mise_marche",
            "faconnerie",
        ]
        if all(getattr(product, f) for f in required):
            try:
                crud.product.update(db, db_obj=product, obj_in={"status": ProductStatus.VALIDATED})
            except Exception:
                pass

    return generation 