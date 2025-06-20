import sys, os, pathlib
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR  # backend folder
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.compiler import compiles

# Patch : rendre le type UUID compatible SQLite
@compiles(UUID, "sqlite")
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

@pytest.fixture(scope="function")
def db():
    # Création uniquement des tables nécessaires à ces tests
    Base.metadata.create_all(bind=engine, tables=[User.__table__, Product.__table__, Ingredient.__table__, StabilityTest.__table__, CompatibilityTest.__table__, Template.__table__, Generation.__table__])
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine, tables=[User.__table__, Product.__table__, Ingredient.__table__, StabilityTest.__table__, CompatibilityTest.__table__, Template.__table__, Generation.__table__])

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db):
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        role="admin",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user 