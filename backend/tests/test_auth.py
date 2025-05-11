from fastapi.testclient import TestClient
from app.core.security import create_access_token

def test_create_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "newuser@example.com",
            "password": "testpassword",
            "password_confirm": "testpassword",
            "role": "editor",
            "two_factor_enabled": False,
            "is_active": True
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data

def test_create_user_existing_email(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "password_confirm": "testpassword",
            "role": "editor",
            "two_factor_enabled": False,
            "is_active": True
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/token",
        data={
            "username": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/token",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_read_users_me(client: TestClient, test_user):
    access_token = create_access_token(data={"sub": test_user.email})
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert "hashed_password" not in data 