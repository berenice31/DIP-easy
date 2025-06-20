import io

from app.services.google_drive import google_drive_service


def test_google_drive_upload_invokes_api(monkeypatch):
    """Vérifie que l'appel upload utilise le client Drive et renvoie l'ID retourné."""
    calls = {}

    class _FakeFiles:
        def create(self, *, body, media_body, fields):
            # Enregistre paramètres pour assertions
            calls['metadata'] = body
            calls['fields'] = fields
            return self

        def execute(self):
            calls['executed'] = True
            return {"id": "fake-drive-id"}

    class _FakeService:
        def files(self):
            return _FakeFiles()

    # Patch internal _get_service pour qu'il renvoie notre fake
    monkeypatch.setattr(
        google_drive_service,
        "_get_service",
        lambda: _FakeService(),
        raising=True,
    )

    file_obj = io.BytesIO(b"dummy")
    returned_id = google_drive_service.upload(file_obj, "test.docx")

    assert returned_id == "fake-drive-id"
    assert calls.get('executed') is True
    assert calls['metadata']['name'] == "test.docx"