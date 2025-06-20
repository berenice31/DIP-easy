# Cahier des Charges - DIP-easy

## 1. Introduction

### 1.1 Contexte

DIP-easy est une application web moderne conçue pour simplifier et accélérer la création et la gestion des Dossiers d'Information Produit (DIP) dans l'industrie cosmétique. L'application vise à remplacer les processus manuels et les documents Excel par une solution numérique intégrée.

### 1.2 Objectifs

- Automatiser la création et la gestion des DIP
- Standardiser le format des documents
- Faciliter la collaboration entre les équipes
- Assurer la conformité réglementaire
- Réduire les erreurs humaines
- Améliorer la traçabilité

## ✅ État d'avancement (19 juin 2025)

### 19/06/2025 – Sprint « Progression & Édition »

| Domaine  | Avancement                                                                                                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend  | • Ajout colonne `progression` (migration Alembic `a1b2c3d4e5f6`) <br>• Mise à jour du modèle `Product` & schéma Pydantic <br>• `crud_product.update()` maintenant suivi d'un `db.refresh()` pour renvoyer les valeurs à jour                                                                                     |
| Frontend | • Calcul dynamique du pourcentage de complétude dans `NewDip.tsx` <br>• Ajout barre MUI `LinearProgress` dans le formulaire <br>• Colonne « Progression » persistante dans `Products.tsx` (affichage `%`) <br>• Flux d'édition : route `/products/:id/edit`, récupération des données et réaffectation au wizard |
| Tests    | • Tests unitaires back mis à jour pour vérifier la persistance de `progression` <br>• Ajustements Jest pour la colonne DataGrid                                                                                                                                                                                  |
| UX       | • Désactivation du débordement gauche (Navigation fixe 240 px) <br>• Feedback toast succès/erreur unifiés                                                                                                                                                                                                        |

> Résultat : la complétude de chaque produit est maintenant calculée, stockée et affichée dans la liste des produits.

### 20/06/2025 – Sprint « Template & Génération »

| Domaine  | Avancement                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend  | • Nouvelles tables & schémas : `templates`, `generations` <br>• CRUD `crud_template`, `crud_generation` <br>• Endpoints REST : `/templates` (upload, list, delete, versioning) et `/generations` (generate, finalize) <br>• Services : stub `google_drive_service`, `docx_service` <br>• Tests d'intégration Pytest : `test_templates.py`, `test_generations.py` <br>• Mise à jour du routeur FastAPI et du `openapi.yaml` (à générer) |
| Frontend | • Service API `templateService.uploadTemplate`, `generationService` <br>• Page `/templates` : upload .docx, listing, suppression, aperçu nom de fichier <br>• Page `/generate` : sélection modèle & produit, génération, upload final, validation <br>• Routing ajouté dans `App.tsx`                                                                                                                                                  |
| Tests    | • Couverture Jest/React Testing Library pour les nouvelles pages (à compléter)                                                                                                                                                                                                                                                                                                                                                         |
| UX       | • Affichage immédiat du nom du fichier importé <br>• Confirmation de suppression de modèle                                                                                                                                                                                                                                                                                                                                             |

> Résultat : les utilisateurs peuvent importer des modèles Word (.docx), gérer les versions, générer un document prérempli à partir d'un produit puis téléverser la version finale – le produit passe automatiquement au statut « VALIDATED ».

### 21/06/2025 – Sprint « Google Drive & Refactor UI »

| Domaine  | Avancement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend  | • Intégration réelle de Google Drive : upload, permissions publiques, suppression silencieuse <br>• Service `google_drive_service` finalisé + dépendances `google-api-python-client`, `google-auth*` <br>• Endpoint `/templates` : miniature récupérée via Drive, suppression supprime aussi le fichier <br>• Modèle `Generation` : renommage colonne SQL `format` + alias Python `file_format` (suppression erreur Postgres) <br>• `SessionLocal` avec `expire_on_commit=False` pour éviter LazyLoad sur objets supprimés <br>• Correctifs CORS & erreurs 500 lors des DELETE <br>• Ajustements tests SQLite (UUID default, server_default neutralisés) |
| Frontend | • Unification de la gestion JWT via util `storage` (intercepteurs Axios + Login) <br>• Navigation latérale ajoutée aux pages Templates & Administration <br>• Suppression du décalage gauche (marge supprimée dans `Layout.tsx`) <br>• Upload template : preview récupérée, fallback à implémenter <br>• Icône de document rollback (placeholder repoussé)                                                                                                                                                                                                                                                                                               |
| Tests    | • Nouveau test `test_google_drive.py` couvrant l'appel upload (monkeypatch Drive) <br>• Toute la suite Pytest repasse en vert sous SQLite                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| DevOps   | • Ajout des libs Google dans `backend/requirements.txt`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

> Résultat : les fichiers .docx sont réellement stockés sur Drive, les modèles peuvent être supprimés sans erreur et l'interface présente désormais toutes les pages dans le layout unifié.

## 2. Architecture Technique

### 2.1 Stack Technologique

- **Frontend**: React 18 avec TypeScript
- **Backend**: Node.js avec Express
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **UI Framework**: Material-UI (MUI)
- **Authentification**: JWT
- **API**: RESTful

### 2.2 Structure du Projet

```
dip-easy/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── types/        # Types TypeScript
│   │   └── utils/        # Utilitaires
│   └── public/           # Assets statiques
└── backend/              # Serveur Node.js
    ├── src/
    │   ├── controllers/  # Contrôleurs
    │   ├── models/      # Modèles Prisma
    │   ├── routes/      # Routes API
    │   ├── services/    # Logique métier
    │   └── utils/       # Utilitaires
    └── prisma/          # Schéma et migrations
```

## 3. Fonctionnalités Principales

### 3.1 Gestion des DIP

- Création de nouveaux DIP
- Édition des DIP existants
- Versionnement des DIP
- Historique des modifications
- Export PDF
- Validation et approbation

### 3.2 Interface Utilisateur

- Dashboard personnalisé
- Navigation intuitive
- Formulaires dynamiques
- Grilles de données interactives
- Notifications en temps réel
- Thème sombre/clair

### 3.3 Gestion des Utilisateurs

- Authentification sécurisée
- Rôles et permissions
- Profils utilisateurs
- Historique des connexions
- Gestion des sessions

### 3.4 Fonctionnalités Avancées

- Templates personnalisables
- Génération automatique de contenu
- Import/Export de données
- Recherche avancée
- Filtres et tri
- Rapports et statistiques

## 4. Modèles de Données

### 4.1 DIP (Dossier d'Information Produit)

```typescript
interface DipForm {
  id: string;
  version: number;
  status: "draft" | "pending" | "approved" | "rejected";
  lastSaved: Date;
  steps: {
    productInfo: {
      completed: boolean;
      data: ProductInfo;
    };
    formula: {
      completed: boolean;
      data: Formula;
    };
    // ... autres étapes
  };
}
```

### 4.2 Utilisateur

```typescript
interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "viewer";
  profile: UserProfile;
  preferences: UserPreferences;
}
```

## 5. API Endpoints

### 5.1 DIP

- `GET /api/dips` - Liste des DIP
- `GET /api/dips/:id` - Détails d'un DIP
- `POST /api/dips` - Création d'un DIP
- `PUT /api/dips/:id` - Mise à jour d'un DIP
- `DELETE /api/dips/:id` - Suppression d'un DIP

### 5.2 Utilisateurs

- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Mise à jour du profil

## 6. Sécurité

### 6.1 Authentification

- JWT avec refresh tokens
- Sessions sécurisées
- Protection CSRF
- Rate limiting

### 6.2 Autorisation

- RBAC (Role-Based Access Control)
- Permissions granulaire
- Validation des données
- Sanitization des entrées

## 7. Performance

### 7.1 Optimisations

- Lazy loading des composants
- Code splitting
- Caching des données
- Pagination des résultats
- Compression des assets

### 7.2 Monitoring

- Logs d'erreurs
- Métriques de performance
- Alertes automatiques
- Tableaux de bord

## 8. Déploiement

### 8.1 Environnements

- Développement
- Staging
- Production

### 8.2 CI/CD

- Tests automatisés
- Build automatique
- Déploiement continu
- Rollback automatique

## 9. Maintenance

### 9.1 Documentation

- Documentation technique
- Guide utilisateur
- API documentation
- Changelog

### 9.2 Support

- Système de tickets
- FAQ
- Base de connaissances
- Support technique

## 10. Évolutions Futures

### 10.1 Fonctionnalités Planifiées

- Application mobile
- API publique
- Intégrations tierces
- IA/ML pour suggestions

### 10.2 Améliorations

- Performance
- UX/UI
- Sécurité
- Scalabilité

## 11. Notes Techniques

### 11.1 Bonnes Pratiques

- Code propre et maintenable
- Tests unitaires et d'intégration
- Documentation à jour
- Revue de code

### 11.2 Standards

- ESLint
- Prettier
- Git Flow
- Semantic Versioning

## 12. Dernières Modifications

### 12.1 Corrections de Bugs

- Correction de l'affichage des données dans la grille des produits
  - Mapping à plat des champs pour la DataGrid
  - Suppression des valueGetters redondants
  - Conversion des IDs en string pour la compatibilité MUI

### 12.2 Améliorations

- Optimisation des performances de la grille
- Meilleure gestion des données nulles/undefined
- Amélioration de l'expérience utilisateur

### 12.3 Prochaines Étapes

- Implémentation de la pagination côté serveur
- Ajout de filtres avancés
- Optimisation des requêtes API
- Amélioration de la gestion du cache
