# DIP-easy Frontend

Interface utilisateur pour l'application DIP-easy, un générateur de Dossiers d'Information Produit (DIP) pour les produits cosmétiques.

## Technologies utilisées

- React 18
- TypeScript
- Vite
- React Router
- React Query
- Zustand
- Tailwind CSS
- React Hook Form

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

1. Cloner le dépôt
2. Installer les dépendances :

```bash
npm install
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Build

Pour créer une version de production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist`.

## Tests

Pour lancer les tests :

```bash
npm test
```

## Structure du projet

```
src/
  ├── components/     # Composants réutilisables
  ├── pages/         # Pages de l'application
  ├── stores/        # Stores Zustand
  ├── types/         # Types TypeScript
  ├── utils/         # Fonctions utilitaires
  ├── App.tsx        # Composant principal
  └── main.tsx       # Point d'entrée
```

## Fonctionnalités

- Authentification (connexion/inscription)
- Gestion des sessions
- Interface responsive
- Validation des formulaires
- Gestion des erreurs
- Navigation sécurisée
