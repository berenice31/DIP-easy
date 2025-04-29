from sqlalchemy.orm import Session
from src.database.session import engine, Base
from src.entities.user import User
from src.controllers.auth import get_password_hash

def init_db():
    # Créer les tables
    Base.metadata.create_all(bind=engine)

    # Créer un utilisateur admin par défaut
    db = Session(engine)
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@dipeasy.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrateur",
                disabled=False
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 