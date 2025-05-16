import psycopg2
from app.core.config import settings

def test_connection():
    try:
        # Tenter de se connecter à la base de données
        conn = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB
        )
        print("Connexion à la base de données réussie!")
        
        # Créer un curseur
        cur = conn.cursor()
        
        # Tester la création de l'extension uuid-ossp
        cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        conn.commit()
        print("Extension uuid-ossp créée avec succès!")
        
        # Fermer la connexion
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Erreur lors de la connexion à la base de données: {str(e)}")

def drop_tasks_table():
    try:
        conn = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB
        )
        cur = conn.cursor()
        cur.execute('DROP TABLE IF EXISTS tasks CASCADE;')
        conn.commit()
        print("Table 'tasks' supprimée avec succès!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Erreur lors de la suppression de la table tasks: {str(e)}")

def reset_database():
    try:
        # Connexion à la base postgres pour pouvoir supprimer la base de données
        conn = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database='postgres'
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Terminer toutes les connexions à la base de données
        cur.execute(f"""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '{settings.POSTGRES_DB}'
            AND pid <> pg_backend_pid();
        """)
        
        # Supprimer la base de données si elle existe
        cur.execute(f'DROP DATABASE IF EXISTS {settings.POSTGRES_DB};')
        print(f"Base de données {settings.POSTGRES_DB} supprimée avec succès!")
        
        # Créer une nouvelle base de données
        cur.execute(f'CREATE DATABASE {settings.POSTGRES_DB};')
        print(f"Base de données {settings.POSTGRES_DB} créée avec succès!")
        
        cur.close()
        conn.close()
        
        # Se connecter à la nouvelle base pour créer l'extension uuid-ossp
        conn = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB
        )
        cur = conn.cursor()
        cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        conn.commit()
        print("Extension uuid-ossp créée avec succès!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Erreur lors de la réinitialisation de la base de données: {str(e)}")

if __name__ == "__main__":
    reset_database() 