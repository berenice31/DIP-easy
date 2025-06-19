#!/usr/bin/env python3
"""
Script de test simple pour vérifier l'API
"""
import requests
import json
from typing import Dict, Any

def test_api_health():
    """Test de santé de l'API"""
    try:
        # Test de l'endpoint de santé (si il existe)
        response = requests.get("http://localhost:8000/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur. Assurez-vous qu'il est démarré sur http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return False

def test_api_docs():
    """Test de la documentation de l'API"""
    try:
        response = requests.get("http://localhost:8000/docs")
        print(f"Status Code: {response.status_code}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur pour la documentation")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du test de la documentation: {e}")
        return False

def test_openapi_spec():
    """Test de la spécification OpenAPI"""
    try:
        response = requests.get("http://localhost:8000/api/v1/openapi.json")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            spec = response.json()
            print(f"✅ API spec trouvée avec {len(spec.get('paths', {}))} endpoints")
            return True
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur pour la spec OpenAPI")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du test de la spec OpenAPI: {e}")
        return False

def test_api_endpoints():
    """Test des endpoints principaux de l'API"""
    try:
        # Test de l'endpoint de base de l'API
        response = requests.get("http://localhost:8000/api/v1/")
        print(f"API Base Status Code: {response.status_code}")
        
        # Test de l'endpoint auth (sans authentification)
        response = requests.get("http://localhost:8000/api/v1/auth/me")
        print(f"Auth endpoint Status Code: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Erreur lors du test des endpoints: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Test de l'API DIP-easy")
    print("=" * 40)
    
    # Test de santé
    print("\n1. Test de santé de l'API:")
    health_ok = test_api_health()
    
    # Test de la documentation
    print("\n2. Test de la documentation:")
    docs_ok = test_api_docs()
    
    # Test de la spec OpenAPI
    print("\n3. Test de la spécification OpenAPI:")
    spec_ok = test_openapi_spec()
    
    # Test des endpoints
    print("\n4. Test des endpoints API:")
    endpoints_ok = test_api_endpoints()
    
    print("\n" + "=" * 40)
    if health_ok and docs_ok and spec_ok and endpoints_ok:
        print("✅ Tous les tests API sont passés!")
    else:
        print("❌ Certains tests API ont échoué")
        print("💡 Assurez-vous que le serveur backend est démarré avec: python -m uvicorn app.main:app --reload") 