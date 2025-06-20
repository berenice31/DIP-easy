import yaml
from fastapi.testclient import TestClient
from app.main import app
from pathlib import Path

def test_openapi_spec_matches_file():
    client = TestClient(app)
    resp = client.get("/api/v1/openapi.json")
    assert resp.status_code == 200
    online = resp.json()

    file_path = Path(__file__).resolve().parent.parent / "openapi.yaml"
    assert file_path.exists(), "openapi.yaml must be generated (run scripts/generate_openapi.py)"
    with file_path.open(encoding="utf-8") as f:
        offline = yaml.safe_load(f)

    # Spot-check: same number of paths and products endpoint exists
    assert online["paths"].keys() == offline["paths"].keys()
    assert "/api/v1/products/" in online["paths"] 