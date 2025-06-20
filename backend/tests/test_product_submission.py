import datetime
from fastapi.testclient import TestClient
from app.core.security import create_access_token

DRAFT_PAYLOAD = {
    # Deliberately incomplete
    "nom_commercial": "Test Draft",
}

REQUIRED_UPDATE = {
    "fournisseur": "Lab",
    "ref_formule": "F-101",
    "date_mise_marche": datetime.date.today().isoformat(),
    "resp_mise_marche": "Dr Test",
    "faconnerie": "Tube",
}


def _auth_headers(user):
    token = create_access_token({"sub": user.email})
    return {"Authorization": f"Bearer {token}"}


def test_draft_creation_without_required_fields(client: TestClient, test_user):
    resp = client.post("/api/v1/products/", json=DRAFT_PAYLOAD, headers=_auth_headers(test_user))
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "DRAFT"
    prod_id = data["id"]

    # Attempt to submit without required fields -> 422
    submit = client.put(f"/api/v1/products/{prod_id}/submit", headers=_auth_headers(test_user))
    assert submit.status_code == 422

    # Update with required fields
    up = client.put(f"/api/v1/products/{prod_id}", json=REQUIRED_UPDATE, headers=_auth_headers(test_user))
    assert up.status_code == 200

    # Submit again -> should succeed
    submit2 = client.put(f"/api/v1/products/{prod_id}/submit", headers=_auth_headers(test_user))
    assert submit2.status_code == 200
    assert submit2.json()["status"] == "VALIDATED" 