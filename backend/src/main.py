from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DIP'Easy API",
    description="API pour la gestion des Dossiers d'Information Produit",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend URL en développement
        "https://dipeasy.com",    # URL de production
        "https://www.dipeasy.com" # URL de production avec www
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API DIP'Easy"} 