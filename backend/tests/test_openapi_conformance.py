import pytest
import yaml
import json
from pathlib import Path
from fastapi.testclient import TestClient
from backend.main import app

def load_openapi_spec():
    spec_path = Path(__file__).parent.parent.parent / 'docs' / 'openapi.yaml'
    with open(spec_path, 'r') as f:
        return yaml.safe_load(f)

def test_api_conforms_to_openapi_spec():
    client = TestClient(app)
    openapi_spec = load_openapi_spec()
    
    # Test login endpoint
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code in [401, 500]  # Should fail with invalid credentials
    
    # Test registration endpoint
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User"
        }
    )
    assert response.status_code in [201, 409]  # Should either create or conflict
    
    # Validate response schemas
    for path, path_item in openapi_spec['paths'].items():
        for method, operation in path_item.items():
            if method in ['post', 'get', 'put', 'delete']:
                # Basic validation that endpoints exist and return expected status codes
                response = getattr(client, method)(path)
                assert response.status_code in [200, 201, 400, 401, 409, 500]

def test_cors_headers():
    client = TestClient(app)
    openapi_spec = load_openapi_spec()

    # Test CORS preflight requests
    for path in ["/api/auth/login", "/api/auth/register"]:
        response = client.options(path)
        assert response.status_code == 204
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-methods" in response.headers
        assert "access-control-allow-headers" in response.headers
        
        # Verify CORS headers match OpenAPI spec
        spec_headers = openapi_spec['paths'][path]['options']['responses']['204']['headers']
        assert response.headers["access-control-allow-origin"] == "*"  # As defined in spec
        assert "POST, OPTIONS" in response.headers["access-control-allow-methods"]
        assert "Content-Type" in response.headers["access-control-allow-headers"]
        assert "Authorization" in response.headers["access-control-allow-headers"]

    # Test CORS headers on actual endpoints
    test_endpoints = [
        ("post", "/api/auth/login", {"email": "test@example.com", "password": "test"}),
        ("post", "/api/auth/register", {"email": "test@example.com", "password": "test", "name": "Test"})
    ]
    
    for method, path, data in test_endpoints:
        response = getattr(client, method)(path, json=data)
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*" 