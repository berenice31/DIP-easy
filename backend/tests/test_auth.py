import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database.session import SessionLocal, engine
from src.entities.user import Base

@pytest.fixture(autouse=True)
def setup_database():
    # Recréer les tables avant chaque test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Nettoyer après chaque test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

def test_register_success(client):
    """Test l'inscription réussie d'un nouvel utilisateur"""
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"

def test_register_duplicate_email(client):
    """Test l'inscription avec un email déjà utilisé"""
    # Premier enregistrement
    client.post(
        "/auth/register",
        json={
            "username": "testuser1",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User 1"
        }
    )
    
    # Tentative avec le même email
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser2",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User 2"
        }
    )
    assert response.status_code == 409
    assert "Email already registered" in response.json()["detail"]

def test_register_invalid_data(client):
    """Test l'inscription avec des données invalides"""
    # Email invalide
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "invalid-email",
            "password": "Password123!",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 422  # FastAPI validation error

def test_login_success(client):
    """Test la connexion réussie"""
    # Créer un utilisateur
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
    )

    # Tenter de se connecter
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",  # FastAPI OAuth2PasswordRequestForm utilise 'username' pour l'email
            "password": "Password123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert "email" in data
    assert data["email"] == "test@example.com"

def test_login_invalid_credentials(client):
    """Test la connexion avec des identifiants invalides"""
    # Créer un utilisateur
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
    )

    # Tentative de connexion avec mot de passe incorrect
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "WrongPassword123!"
        }
    )
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"] 