from fastapi import APIRouter, Depends, HTTPException, status, Body, Form
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.schemas.auth import Token
from src.controllers.auth import create_access_token, get_password_hash
from src.entities.user import User
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        logger.debug(f"Tentative de connexion avec l'email: {login_data.email}")
        # Vérifier si l'utilisateur existe
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            logger.debug("Utilisateur non trouvé")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Vérifier le mot de passe
        if not user.verify_password(login_data.password):
            logger.debug("Mot de passe incorrect")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.email})
        logger.debug("Connexion réussie")
        return {"access_token": access_token, "token_type": "bearer", "user": {"email": user.email}}
    except HTTPException as e:
        # Propager les exceptions HTTP telles quelles
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la connexion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        logger.debug(f"Tentative d'inscription avec l'email: {user_data.email}")
        # Vérifier si l'utilisateur existe déjà
        db_user = db.query(User).filter(User.email == user_data.email).first()
        if db_user:
            logger.debug("Email déjà utilisé")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        
        # Créer le nouvel utilisateur
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.email,  # Utiliser l'email comme username
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.email  # Utiliser l'email comme nom complet temporairement
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Générer le token
        access_token = create_access_token(data={"sub": user_data.email})
        logger.debug("Inscription réussie")
        return {"access_token": access_token, "token_type": "bearer", "message": "User created successfully"}
    except Exception as e:
        logger.error(f"Erreur lors de l'inscription: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur serveur"
        ) 