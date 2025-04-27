# Cahier des Charges (CDC) – Plateforme DIP’Easy

## 1. Contexte & Objectifs

**Contexte**  
Une PME de cosmétique souhaite automatiser et industrialiser la création de ses Dossiers d’Information Produit (DIP) afin de gagner en rapidité, traçabilité et conformité réglementaire.

**Objectif principal**  
Développer une application web interne (DIP’Easy) qui guide le Responsable Qualité pas à pas :
1. Collecte structurée des données et des documents bruts  
2. Configuration centralisée des modèles Word et chartes de style  
3. Génération automatisée de DIP (Word/PDF)  
4. Pilotage des workflows récurrents (tâches planifiées, intégrations)  
5. Traçabilité complète via journaux et historique  

---

## 2. Périmètre fonctionnel

### 2.1 Authentification & Sécurité
- Page de connexion : identifiants + mot de passe  
- 2FA optionnel  
- Gestion des sessions (timeout, rôles utilisateurs)  

### 2.2 Dashboard
- Cartes KPI :  
  - Nombre de DIP générés (période configurable)  
  - Erreurs en cours  
  - Temps moyen de génération  
- Liste « Derniers produits » (avec bouton « Nouveau DIP »)  
- Alertes / notifications (pièces manquantes, tâches échouées)  

### 2.3 Produits
- Tableau listant tous les produits (nom, réf., statut, % complétude, date dernière génération)  
- Filtre & recherche (texte libre, statut, date, tags)  
- Fiche produit : métadonnées éditables, historique des versions, accès direct aux actions (collecte, génération)  

### 2.4 Collecte de données
- Formulaire multi-étapes :  
  1. Informations produit  
  2. Formule quali-quantitative  
  3. Physico-chimie & stabilité  
  4. Microbiologie  
  5. Annexes (drag & drop file upload)  
- Navigation : onglets avec codes couleur (done/active/todo)  
- Checklist de complétude (jauge %, liste pièces manquantes)  
- Sauvegarde automatique à chaque étape  

### 2.5 Templates & Style
- Import de modèle Word (.dotx/.docx)  
- Gestion de versions (v1, v2, …)  
- Éditeur visuel de table des matières (drag & drop des chapitres)  
- Style guide : sélection de polices, tailles, couleurs pour titres, corps, légendes  
- Aperçu miniature du template  

### 2.6 Génération de DIP
- Sélecteurs : produit, template, type de fichier (Word/PDF)  
- Bouton « Générer »  
- Aperçu dynamique (PDF viewer)  
- Historique des générations (date, produit, template, statut, lien de téléchargement)  
- Téléchargement immédiat ou ultérieur  

### 2.7 Automatisation & Tâches planifiées
- Tableau des tâches (titre, type, planification, statut, actions edit/delete)  
- Création de tâche (titre, prompt, fréquence via RRULE, destinataires notif.)  
- Intégrations :  
  - Typeform (webhook)  
  - Google Drive API  
  - Système de fichiers local / FTP  
- Activation / désactivation en un clic  

### 2.8 Journaux & Traçabilité (Logs)
- Timeline verticale d’événements (connexion, upload, génération, erreur…)  
- Filtres par période et type d’événement  
- Export CSV/XLSX  
- Icônes et codes couleurs (info/succès/alerte/erreur)  

### 2.9 Administration & Sécurité
- Gestion des utilisateurs (création, modification rôle, suppression)  
- Paramètres globaux :  
  - Authentification (2FA, mode maintenance)  
  - Fréquence sauvegardes (quotidienne, hebdo, mensuelle)  
  - Quotas, journaux d’accès  
- Backups & restore (base + templates)  

### 2.10 Aide & Documentation
- FAQ (accordéons) + barre de recherche  
- Tutoriels (liens vers vidéos/PDF)  
- Chatbot intégré pour assistance en temps réel  
- Signaler un bug (formulaire ou lien)  

---

## 3. Exigences non fonctionnelles

| Critère               | Détail                                                                                 |
|-----------------------|----------------------------------------------------------------------------------------|
| **Technologie**       | Front : React/TypeScript + Chakra UI + Vite <br> Back : FastAPI (Python) ou Node.js (Express) |
| **Base de données**   | SQLite en dev, PostgreSQL en prod                                                      |
| **Stockage fichiers** | Métadonnées en DB, annexes sur Google Drive via API                                     |
| **Sécurité**          | HTTPS, JWT/OAuth2, CSP, XSS/CSRF                                                       |
| **Performance**       | Chargement Dashboard <2s, Formulaire <1s                                               |
| **Scalabilité**       | API stateless, conteneurs Docker                                                      |
| **Accessibilité**      | WCAG AA (contraste, navigation clavier)                                               |
| **I18n**              | FR / EN                                                                                |
| **Tests**             | Unitaires ≥80%, E2E (Cypress/Playwright)                                                |
| **CI/CD**             | GitHub Actions (lint, tests, build, déploiement)                                       |

---

## 4. Architecture technique

```
Frontend (React/Vite) ⇄ Backend API (FastAPI) ⇄ DB (PostgreSQL) + Google Drive API
```

- **Frontend** : composants UI réutilisables (tableaux, forms, modals, timeline, uploader)  
- **Backend** : API REST/GraphQL, Auth JWT/OAuth2, intégrations (Drive, Typeform)  
- **DB** : tables `users`, `products`, `responses`, `files`, `templates`, `tasks`, `logs`, `settings`  
- **CI/CD** : Docker Compose, GitHub Actions, tests automatisés  

