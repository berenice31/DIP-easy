"""Generate OpenAPI spec as YAML file from FastAPI app.
Run:  python -m scripts.generate_openapi
"""
from pathlib import Path
import sys, yaml

# Ajoute le dossier parent (backend/) au PYTHONPATH pour permettre l'import de app.main
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.main import app

def main():
    spec = app.openapi()
    out_path = Path(__file__).resolve().parent.parent / "openapi.yaml"
    with out_path.open("w", encoding="utf-8") as f:
        yaml.dump(spec, f, sort_keys=False, allow_unicode=True)
    print(f"✅ OpenAPI spec written to {out_path.relative_to(Path.cwd())}")

if __name__ == "__main__":
    main() 