import requests
import json

url = "http://localhost:8000/product-info/"
data = {
    "nom_commercial": "Test Product",
    "ref_formule": "TEST-001",
    "ref_produit": "PROD-001",
    "date_mise_marche": "2024-03-20",
    "resp_mise_marche": "John Doe",
    "faconnerie": "Test Faconnerie"
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}") 