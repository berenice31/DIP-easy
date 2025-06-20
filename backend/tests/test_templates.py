import io
from fastapi.testclient import TestClient
from app.core.security import create_access_token

DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

def _auth_headers(test_user):
    token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}


def test_upload_template(client: TestClient, test_user, monkeypatch):
    # Patch Google Drive upload to return predictable ID
    from app.services import google_drive
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda f, filename: "drive-id-1")

    dummy_content = b"PK\x03\x04dummy docx binary"
    files = {"file": ("model.docx", io.BytesIO(dummy_content), DOCX_MIME)}
    response = client.post(
        "/api/v1/templates/",
        headers=_auth_headers(test_user),
        files=files,
        data={"name": "DIP Model"},
    )
    if response.status_code != 200:
        print("DEBUG RESPONSE", response.status_code, response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DIP Model"
    assert data["version"] == "1"
    assert data["drive_file_id"] == "drive-id-1"


def test_list_templates(client: TestClient, test_user, monkeypatch):
    from app.services import google_drive
    monkeypatch.setattr(google_drive.google_drive_service, "upload", lambda f, filename: "drive-id-2")

    # Upload two versions
    for i in range(2):
        dummy_content = b"PK\x03\x04dummy"
        files = {"file": (f"model{i}.docx", io.BytesIO(dummy_content), DOCX_MIME)}
        client.post(
            "/api/v1/templates/",
            headers=_auth_headers(test_user),
            files=files,
            data={"name": "DIP Model"},
        )

    list_resp = client.get(
        "/api/v1/templates/",
        headers=_auth_headers(test_user),
    )
    assert list_resp.status_code == 200
    templates = list_resp.json()
    assert len(templates) == 2
    versions = {tpl["version"] for tpl in templates}
    assert versions == {"1", "2"} 