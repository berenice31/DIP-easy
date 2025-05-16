from sqlalchemy import create_engine, text
from app.core.config import settings

# Création de la connexion à la base de données
engine = create_engine(settings.get_database_url)

# Exécution de la requête
with engine.connect() as connection:
    result = connection.execute(text("SELECT * FROM users"))
    users = result.fetchall()
    
    # Affichage des résultats
    print("\nListe des utilisateurs :")
    print("-" * 50)
    for user in users:
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Rôle: {user.role}")
        print("-" * 50) 