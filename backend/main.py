from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import auth
from src.routes import product_info

app = FastAPI(
    title="DIP'Easy API",
    description="API pour la gestion des Dossiers d'Information Produit",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Spécifier l'origine exacte
    allow_credentials=True,  # Permettre les credentials
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montage des routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(product_info.router, prefix="/api/collection/product-info", tags=["product_info"])

@app.get("/")
async def root():
    return {"message": "Welcome to DIP'Easy API"} 