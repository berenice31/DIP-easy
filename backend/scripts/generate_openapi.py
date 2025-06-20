"""Generate OpenAPI spec as YAML file from FastAPI app.
Run:  python -m scripts.generate_openapi
"""
from pathlib import Path
import yaml
from app.main import app

def main():
    spec = app.openapi()
    out_path = Path(__file__).resolve().parent.parent / "openapi.yaml"
    with out_path.open("w", encoding="utf-8") as f:
        yaml.dump(spec, f, sort_keys=False, allow_unicode=True)
    print(f"✅ OpenAPI spec written to {out_path.relative_to(Path.cwd())}")

if __name__ == "__main__":
    main() 