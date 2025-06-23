import sys, os, pathlib, uuid
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR  # backend folder
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.ext.compiler import compiles
from sqlalchemy import DateTime, ColumnDefault, Boolean
from datetime import datetime

# Patch : rendre le type UUID compatible SQLite
@compiles(PGUUID, "sqlite")
def compile_uuid_sqlite(type_, dialect, **kw):
    return "CHAR(36)"

from app.main import app
from app.db.base import Base, get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.models.product import Product
from app.models.ingredient import Ingredient
from app.models.stability_test import StabilityTest
from app.models.compatibility_test import CompatibilityTest
from app.models.template import Template
from app.models.generation import Generation
from app.services.google_drive import google_drive_service
from app.core.config import settings

# Création d'une base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False, bind=engine)

# Stub de fonction SQL pour SQLite afin de remplacer uuid_generate_v4()
@event.listens_for(engine, "connect")
def _register_uuid(conn, record):
    import uuid as _uuid
    conn.create_function("uuid_generate_v4", 0, lambda: str(_uuid.uuid4()))
    conn.create_function("gen_random_uuid", 0, lambda: str(_uuid.uuid4()))

# ---------------------------------------------------------------------------
# Compatibilité SQLite : activer les contraintes FK et ignorer les server_default
# ---------------------------------------------------------------------------

# Active les contraintes ON DELETE CASCADE
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Supprime les server_default (ex: uuid_generate_v4()) non reconnues par SQLite
@event.listens_for(Base.metadata, "before_create")
def _adjust_columns_for_sqlite(metadata, connection, **kw):
    """Neutralise server defaults & onupdate which SQLite ne gère pas, et rendre les colonnes nullable."""
    if connection.dialect.name != "sqlite":
        return
    for table in metadata.tables.values():
        for column in table.columns:
            if column.server_default is not None:
                column.server_default = None
                column.nullable = True

            if column.default is not None:
                column.default = None
                column.nullable = True

            if getattr(column, "onupdate", None):
                column.onupdate = None

            # Ajoute un default Python pour les colonnes timestamp
            if isinstance(column.type, DateTime) and column.name in ("created_at", "updated_at", "initiated_at", "completed_at"):
                column.default = ColumnDefault(datetime.utcnow)
                column.nullable = False

            # Ajoute un default Python pour les clés primaires UUID (évite NULL id)
            if column.primary_key and column.default is None and column.server_default is None:
                from sqlalchemy import ColumnDefault
                column.default = ColumnDefault(lambda _u=uuid: _u.uuid4())
                column.nullable = False

            # Default False pour bool NOT NULL sans default (ex: two_factor_enabled)
            if isinstance(column.type, Boolean) and not column.nullable and column.default is None and column.server_default is None:
                column.default = ColumnDefault(False)
                column.nullable = False

@pytest.fixture(scope="module")
def db():
    # Création uniquement des tables nécessaires à ces tests
    Base.metadata.create_all(bind=engine, tables=[User.__table__, Product.__table__, Ingredient.__table__, StabilityTest.__table__, CompatibilityTest.__table__, Template.__table__, Generation.__table__])
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine, tables=[User.__table__, Product.__table__, Ingredient.__table__, StabilityTest.__table__, CompatibilityTest.__table__, Template.__table__, Generation.__table__])

@pytest.fixture(scope="module")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def test_user(db):
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        role="admin",
        two_factor_enabled=False,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user 

@pytest.fixture(autouse=True)
def _patch_drive(monkeypatch):
    """Fixture automatique : remplace google_drive_service.ensure_folder par un mock."""
    monkeypatch.setattr(
        google_drive_service,
        "ensure_folder",
        lambda path: f"mock-{'/'.join(path)}"
    )
    # Patch download & convert_to_pdf pour éviter appels réseau
    monkeypatch.setattr(google_drive_service, "download", lambda fid: b"docx-bytes")
    monkeypatch.setattr(google_drive_service, "convert_to_pdf", lambda fid: b"%PDF-1.4 mock")
    yield 

# Forcer validation stricte des produits pendant les tests
@pytest.fixture(autouse=True)
def _strict_product_validation(monkeypatch):
    monkeypatch.setattr(settings, "STRICT_PRODUCT_VALIDATION", True)
    yield

# Ajoute un bind processor pour SQLite afin d'accepter str/UUID de manière transparente
PGUUID.cache_ok = True  # évite warnings

def _uuid_sqlite_bindproc(self, dialect):
    if dialect.name != "sqlite":
        return None  # use default for others
    def process(value):
        if value is None:
            return None
        return str(value)
    return process

PGUUID.bind_processor = _uuid_sqlite_bindproc 