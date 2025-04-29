# DIP-easy

Application de gestion des DIP (Déclaration d'Intention de Paiement)

## 🚀 Getting Started

### Prérequis

- Python 3.11+
- Node.js 18+
- PostgreSQL

### Installation

1. Cloner le repository

```bash
git clone https://github.com/votre-org/dip-easy.git
cd dip-easy
```

2. Installer les dépendances backend

```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

3. Installer les dépendances frontend

```bash
cd frontend
npm install
```

## 🧪 Tests

### Backend

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm test
npm run cypress:test
```

## 📝 Processus de Contribution

### Règles de développement

1. **TDD (Test Driven Development)**

   - Écrire d'abord les tests
   - Implémenter le code minimal pour faire passer les tests
   - Refactorer si nécessaire

2. **Branches et PR**

   - Créer une branche depuis `develop` pour chaque feature/bugfix
   - Nommer les branches selon le format : `feature/nom-de-la-feature` ou `fix/nom-du-bug`
   - Soumettre une PR vers `develop` avec :
     - Description claire des changements
     - Tests associés
     - Mise à jour du spec OpenAPI si nécessaire

3. **Revue de code**

   - Au moins une approbation requise
   - Tous les tests doivent passer
   - Conformité avec le spec OpenAPI

4. **Documentation**
   - Mettre à jour la documentation si nécessaire
   - Documenter les nouvelles fonctionnalités
   - Mettre à jour le spec OpenAPI pour les changements d'API

### Workflow CI/CD

- Les tests sont exécutés automatiquement sur chaque push/PR
- Le pipeline doit passer pour pouvoir merger
- Les règles de protection de branche sont activées sur `main`

## 📚 Documentation

- [Documentation API](docs/openapi.yaml)
- [Cahier des charges](CDC.md)
- [Journal de développement](DEVBOOK.md)

## 🔒 Sécurité

- Ne jamais commiter de données sensibles
- Utiliser les variables d'environnement pour les secrets
- Suivre les bonnes pratiques de sécurité

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails de notre code de conduite et le processus de soumission des PR.
