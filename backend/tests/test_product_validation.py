import datetime
from fastapi.testclient import TestClient
from app.core.security import create_access_token

PAYLOAD_MINIMAL = {
    "nom_commercial": "DraftProd"
}

REQUIRED_EXTRAS = {
    "fournisseur": "LabCos",
    "ref_formule": "F-002",
    "date_mise_marche": datetime.date.today().isoformat(),
    "resp_mise_marche": "Dr Skin",
    "faconnerie": "Flacon 100ml"
}


def _auth_headers(test_user):
    token = create_access_token({"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}


def test_draft_creation_partial(client: TestClient, test_user):
    resp = client.post("/api/v1/products/", json=PAYLOAD_MINIMAL, headers=_auth_headers(test_user))
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "DRAFT"
    assert data["date_mise_marche"] is None
    global PROD_ID
    PROD_ID = data["id"]


def test_submit_fails_on_missing_fields(client: TestClient, test_user):
    # utilise PROD_ID du test précédent
    resp = client.put(f"/api/v1/products/{PROD_ID}/submit", headers=_auth_headers(test_user))
    assert resp.status_code == 422


def test_submit_success_after_update(client: TestClient, test_user):
    # complétion des champs requis
    upd = client.put(f"/api/v1/products/{PROD_ID}", json=REQUIRED_EXTRAS, headers=_auth_headers(test_user))
    assert upd.status_code == 200
    # submit
    sub = client.put(f"/api/v1/products/{PROD_ID}/submit", headers=_auth_headers(test_user))
    assert sub.status_code == 200, sub.text
    assert sub.json()["status"] == "VALIDATED" 