"""Fix inconsistent products with status VALIDATED but missing required fields.

Usage:
    python -m scripts.fix_invalid_products

The script will:
1. Scan the `products` table for rows where `status = 'VALIDATED'` but one of the
   mandatory fields is NULL or empty string.
2. Display the list of offending product IDs.
3. Update their status back to 'DRAFT' so that API listing no longer fails.

This keeps the invariant enforced by the Pydantic `root_validator` while
preventing 500 errors on `GET /products`.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import List

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Result

# Ensure we can import app.core.config regardless of current working directory
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.config import settings  # noqa: E402

REQUIRED_FIELDS: List[str] = [
    "nom_commercial",
    "fournisseur",
    "ref_formule",
    "date_mise_marche",
    "resp_mise_marche",
    "faconnerie",
]


def find_invalid_products() -> List[str]:
    """Return list of product IDs that are VALIDATED but have missing fields."""
    engine = create_engine(settings.get_database_url)
    # Build per-field predicate, avoiding invalid comparison for DATE columns
    predicates = []
    for field in REQUIRED_FIELDS:
        if field == "date_mise_marche":
            predicates.append(f"{field} IS NULL")
        else:
            predicates.append(f"{field} IS NULL OR {field} = ''")
    placeholders = " OR ".join(predicates)
    query = text(
        f"""
        SELECT id
        FROM products
        WHERE status = 'VALIDATED' AND ({placeholders});
        """
    )
    with engine.connect() as conn:
        result: Result = conn.execute(query)
        return [str(row.id) for row in result.fetchall()]


def downgrade_products(ids: List[str]) -> None:
    """Set `status = 'DRAFT'` for given product IDs."""
    if not ids:
        return
    engine = create_engine(settings.get_database_url)
    # Build IN clause safely using bind params
    in_clause = ", ".join([f":id{i}" for i in range(len(ids))])
    params = {f"id{i}": pid for i, pid in enumerate(ids)}
    update_query = text(
        f"UPDATE products SET status = 'DRAFT' WHERE id IN ({in_clause});"
    )
    with engine.begin() as conn:
        conn.execute(update_query, params)


def main() -> None:
    invalid_ids = find_invalid_products()
    if not invalid_ids:
        print("✅ No inconsistent VALIDATED products found. Database is clean.")
        return

    print("🚧 Found the following inconsistent product IDs:")
    for pid in invalid_ids:
        print(f"  - {pid}")

    downgrade_products(invalid_ids)
    print(f"⏩ Reverted {len(invalid_ids)} products back to 'DRAFT'.")
    print("Done! You can now restart the backend and reload /products without 500 errors.")


if __name__ == "__main__":
    main() 