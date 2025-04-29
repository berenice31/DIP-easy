from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import auth
from src.routes import product_info
from dotenv import load_dotenv
import os

# Chargement des variables d'environnement
load_dotenv()

app = FastAPI(
    title="DIP'Easy API",
    description="API pour la gestion des Dossiers d'Information Produit",
    version="1.0.0"
)

# Configuration CORS basée sur l'environnement
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["Content-Length", "X-Total-Count"],
    max_age=600,  # Cache des pré-requêtes CORS pendant 10 minutes
)

# Montage des routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(product_info.router, prefix="/api/collection/product-info", tags=["product_info"])

@app.get("/")
async def root():
    return {"message": "Welcome to DIP'Easy API"} 