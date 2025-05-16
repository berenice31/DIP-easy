# Définir le chemin absolu du projet
$projectPath = $PSScriptRoot

# Activer l'environnement virtuel
& "$projectPath\venv\Scripts\Activate.ps1"

# Installer les dépendances nécessaires
pip install bcrypt==4.0.1 passlib[bcrypt] email-validator pydantic[email]

# Définir le PYTHONPATH
$env:PYTHONPATH = "$projectPath"

# Démarrer le serveur
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug 