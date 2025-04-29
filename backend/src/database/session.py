from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/dip_easy")
logger.debug(f"Connexion à la base de données avec l'URL: {SQLALCHEMY_DATABASE_URL}")

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    logger.debug("Connexion à la base de données établie")
except Exception as e:
    logger.error(f"Erreur lors de la connexion à la base de données: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        logger.debug("Session de base de données créée")
        yield db
    except Exception as e:
        logger.error(f"Erreur lors de la création de la session: {str(e)}")
        raise
    finally:
        db.close()
        logger.debug("Session de base de données fermée") 