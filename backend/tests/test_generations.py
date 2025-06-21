import io
from fastapi.testclient import TestClient
from app.core.security import create_access_token
DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

def _auth_headers(user):
    token = create_access_token(data={"sub": user.email})
    return {"Authorization": f"Bearer {token}"}

def _upload_template(client, headers, monkeypatch):
    from app.services import google_drive
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda *args, **kwargs: "drive-tpl")
    files = {"file": ("model.docx", io.BytesIO(b"dummy"), DOCX_MIME)}
    resp = client.post("/api/v1/templates/", files=files, data={"name": "Model"}, headers=headers)
    return resp.json()

def test_generate_and_finalize(client: TestClient, test_user, monkeypatch):
    headers = _auth_headers(test_user)
    tpl = _upload_template(client, headers, monkeypatch)
    from app.services import google_drive
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda *args, **kwargs: "drive-gen")

    # créer un produit minimal
    product_resp = client.post(
        "/api/v1/products/",
        json={"nom_client": "X"},
        headers=headers,
    )
    product = product_resp.json()

    # Generate
    gen_resp = client.post(
        "/api/v1/generations/",
        headers=headers,
        data={"template_id": tpl["id"], "product_id": product["id"]},
    )
    assert gen_resp.status_code == 200
    gen = gen_resp.json()
    assert gen["drive_file_id"] == "drive-gen"

    # Finalize
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda *args, **kwargs: "drive-final")
    final_resp = client.patch(
        f"/api/v1/generations/{gen['id']}/finalize",
        headers=headers,
        files={"file": ("final.docx", io.BytesIO(b"done"), DOCX_MIME)},
    )
    assert final_resp.status_code == 200
    final_gen = final_resp.json()
    assert final_gen["drive_file_id"] == "drive-final"

def test_validate_generation(client: TestClient, test_user, monkeypatch):
    headers = _auth_headers(test_user)

    # patch Drive upload & download
    from app.services import google_drive

    # upload template (upload patched inside helper)
    tpl = _upload_template(client, headers, monkeypatch)

    # patch upload again for generation docx
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda *a, **k: "drive-docx")

    # create product
    product = client.post("/api/v1/products/", json={}, headers=headers).json()

    # generate (draft)
    gen = client.post(
        "/api/v1/generations/", data={"template_id": tpl["id"], "product_id": product["id"]}, headers=headers
    ).json()

    # patch convert_to_pdf to return bytes and upload to return pdf id for PDF upload
    monkeypatch.setattr(google_drive.google_drive_service, "convert_to_pdf", lambda fid: b"%PDF-1.4 dummy")
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda bytes_, name, **kw: "drive-pdf")

    resp = client.patch(f"/api/v1/generations/{gen['id']}/validate", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["format"] == "pdf"
    assert data["drive_file_id"] == "drive-pdf" 