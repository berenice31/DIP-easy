# Cahier des Charges (CDC) – Plateforme DIP'Easy

BUT DU PROJET:
--> Ce site internet doit permettre de créer des DIP (dossier d'information produit) raapidement et facilement ! qu'est ce qu'un DIP? c'est un document reglementaire qui doit suivre un produit cosmétique pour que les autorités puissent vérifier que le produit est conforme et sans danger !

Contexte & objectifs
Contexte :
Une PME de cosmétique souhaite automatiser et industrialiser la création de ses Dossiers d'Information Produit (DIP) afin de gagner en rapidité, traçabilité et conformité réglementaire.
Objectif principal :
Développer une application web interne (DIP'Easy) qui guide le Responsable Qualité pas à pas :

1. Collecte structurée des données et des documents bruts
2. Configuration centralisée des modèles Word et chartes de style
3. Génération automatisée de DIP (Word/PDF)
4. Pilotage des workflows récurrents (tâches planifiées, intégrations)
5. Traçabilité complète via journaux et historique

Pour chaque page, on définit :

1. **User Story**
2. **Critères d'acceptation**
3. **Tests à écrire** (unitaires, intégration, E2E)
4. **Étapes TDD**

**Note :**

- Chaque test écrit **en premier** guide l'implémentation minimale.
- **Ne jamais** modifier un test vert sans créer un nouveau test pour l'évolution.
- La même démarche TDD s'applique à chaque micro-fonctionnalité ou fixe de bug.
  > **Rappel** : à chaque étape, n'écrire que le test puis le code minimal, et ne jamais modifier un test déjà vert sans ajouter un nouveau test pour l'évolution.

## 0. Page Inscription / Connexion

### 0.1 User Story

> En tant qu'utilisateur, je veux pouvoir créer un compte et/ou me connecter (login + mot de passe + 2FA si activé) afin d'accéder à l'application en toute sécurité.

### 0.2 Critères d'acceptation

- **CA0.1** : La page d'inscription (`/signup`) permet de saisir email, mot de passe et confirme mot de passe.
- **CA0.2** : Validation client des formats email et cohérence mot de passe / confirmation.
- **CA0.3** : Soumission réussie crée un compte (statut draft) et redirige vers `/login`.
- **CA0.4** : La page de connexion (`/login`) permet de saisir email + mot de passe.
- **CA0.5** : Tentative de login avec identifiants invalides renvoie un message d'erreur ("401 Unauthorized").
- **CA0.6** : Si 2FA désactivé pour l'utilisateur, renvoyer directement un JWT et rediriger vers le Dashboard.
- **CA0.7** : Si 2FA activé, login renvoie état "2FA required" et affiche formulaire de saisie du code.
- **CA0.8** : Validation du code 2FA correct renvoie le JWT et redirige vers le Dashboard.
- **CA0.9** : Toute tentative d'accès aux routes protégées sans JWT renvoie 401.

### 0.3 Tests à écrire

#### Backend (pytest)

- `test_signup_creates_user_and_returns_201()`
- `test_signup_invalid_email_returns_400()`
- `test_login_wrong_password_returns_401()`
- `test_login_without_2fa_returns_jwt()`
- `test_login_with_2fa_requires_code()`
- `test_validate_2fa_code_success_returns_jwt()`
- `test_protected_route_without_token_returns_401()`

#### Frontend (Jest + RTL)

- `SignupForm shows errors for invalid inputs()`
- `LoginForm calls API and handles success()/error()`
- `TwoFactorForm blocks submit until code is 6 digits`

#### E2E (Cypress)

- `should signup, then login and land on dashboard`
- `should login with 2FA flow correctly`

### 0.4 TDD Steps

1. **Test** back `POST /api/signup` (rouge).
2. **Implémenter** route, schéma Pydantic, création user + hash password.
3. **Test** back `POST /api/login` with bad creds (rouge).
4. **Implémenter** vérification mot de passe + JWT generation.
5. **Test** back `POST /api/login` for user with `two_factor_enabled=true` (rouge).
6. **Implémenter** retour `{ status: "2fa_required" }`.
7. **Test** back `POST /api/2fa/validate` with code correct (rouge).
8. **Implémenter** validation via stored secret + émission JWT.
9. **Test** protected endpoint without token (rouge) + implémenter middleware auth.
10. **Test** front `<SignupForm/>` initial render (rouge).
11. **Implémenter** formulaire + validation client + appel API signup.
12. **Test** front `<LoginForm/>` flow (rouge) + implémenter.
13. **Test** front `<TwoFactorForm/>` flow (rouge) + implémenter.
14. **E2E** : écrire le scénario complet signup→login→dashboard, valider la sécurité.

## 1. Page Dashboard

### 1.1 User Story

> En tant que Responsable Qualité, je veux une vue d'ensemble des KPI et un accès rapide aux actions pour piloter mes DIP.

### 1.2 Critères d'acceptation

- CA1.1 : Afficher nombre total de DIP générés sur la période sélectionnée.
- CA1.2 : Afficher nombre d'erreurs en cours.
- CA1.3 : Afficher temps moyen de génération.
- CA1.4 : Afficher une liste paginée des 10 derniers produits créés avec liens « Nouveau DIP » et « Voir logs ».
- CA1.5 : Cliquer sur une carte KPI ouvre un filtre dédié.

### 1.3 Tests à écrire

#### Backend (pytest)

- `test_get_dashboard_kpis_returns_correct_counts()`
- `test_get_recent_products_pagination()`
- `test_permission_denied_without_jwt()`

#### Frontend (Jest + React Testing Library)

- `DashboardKpiCard renders with correct values()`
- `RecentProductsTable navigates on row click()`

#### E2E (Cypress)

- `should display dashboard and allow filtering by KPI card click`

### 1.4 TDD Steps

1. **Écrire** un test back-end pour `GET /api/dashboard/kpis` (échec).
2. **Implémenter** la route et la logique SQL pour calculer les KPI.
3. **Refactor** service/dashboard pour extraire la logique réutilisable.
4. **Écrire** un test front-end qui monte `<Dashboard/>` et simule les données (échec).
5. **Implémenter** le composant et l'API call.
6. **Ajouter** un test E2E Cypress pour le workflow complet.

---

## 2. Page Gestion des Produits

### 2.1 User Story

> En tant que Responsable Qualité, je veux lister, filtrer et créer mes produits.

### 2.2 Critères d'acceptation

- CA2.1 : Afficher un tableau paginé avec colonnes (Nom, Réf., Statut, % compl., Date).
- CA2.2 : Filtres : champ texte (Nom/Ref), statut, date.
- CA2.3 : Bouton « + Nouveau produit » ouvre un modal.
- CA2.4 : Création d'un produit valide met à jour la table et apparaît immédiatement à l'écran.

### 2.3 Tests à écrire

#### Backend

- `test_list_products_with_filters()`
- `test_create_product_valid_data()`
- `test_create_product_missing_required_returns_400()`

#### Frontend

- `ProductsTable applies filters correctly()`
- `NewProductModal submits form and refreshes list()`

#### E2E

- `should create a new product and see it in the table`

### 2.4 TDD Steps

1. **Test** back-end `GET /api/products?filter...` (rouge).
2. **Implémenter** la requête SQL et la route.
3. **Test** front-end du composant `<ProductsTable/>` avec données mock.
4. **Implémenter** l'appel API + affichage.
5. **Test** E2E de bout en bout création de produit.
6. **Refactor** extraction du service product.

---

## 3. Page Collecte de Données

### 3.1 User Story

> En tant que Responsable Qualité, je veux un formulaire multi-étapes pour saisir toutes les données du DIP.

### 3.2 Critères d'acceptation

- CA3.1 : Présenter 5 onglets (Infos, Formule, Physico, Microbio, Annexes).
- CA3.2 : Chaque onglet affiche les champs et mini-uploader correspondants.
- CA3.3 : Jauge de complétude mise à jour à chaque sauvegarde.
- CA3.4 : On ne peut passer à l'onglet suivant qu'avec validation des champs requis.
- CA3.5 : Sauvegarde automatique (debounce 500 ms) en base.

### 3.3 Tests à écrire

#### Backend

- `test_put_step_data_saves_jsonb_and_marks_completed()`
- `test_cannot_complete_step_with_missing_required_fields()`

#### Frontend

- `WizardTabs highlights active/completed steps()`
- `StepForm blocks next when required missing()`
- `ChecklistSidebar shows missing items and percentage()`

#### E2E

- `should navigate through wizard, fill all steps and see 100% completion`

### 3.4 TDD Steps

1. **Test** back `PUT /api/products/{id}/step/informations` (fail).
2. **Implémenter** la sauvegarde JSONB + retour de status.
3. **Test** front `<WizardTabs/>` initial rendering.
4. **Implémenter** styles et logique d'état des onglets.
5. **Test** front `<StepForm/>` validation client (échec).
6. **Implémenter** validation et appel auto-save.
7. **Test** E2E pour le workflow complet de collecte.

---

## 4. Page Templates & Style

### 4.1 User Story

> En tant que Responsable Qualité, je veux importer, configurer et versionner mes modèles DIP.

### 4.2 Critères d'acceptation

- CA4.1 : Liste des templates avec noms, versions, miniatures.
- CA4.2 : Bouton « Importer » ouvre un uploader qui stocke sur Drive et enregistre métadonnées.
- CA4.3 : Éditeur drag-drop de la table des matières (JSONB → Drive).
- CA4.4 : Sélecteur de style (polices, couleurs) avec preview en temps réel.

### 4.3 Tests à écrire

#### Backend

- `test_upload_template_stores_drive_id_and_metadata()`
- `test_update_template_toc_and_style()`

#### Frontend

- `TemplatesList renders items and import button()`
- `TemplateEditor updates toc JSON on drag-and-drop()`

#### E2E

- `should import a template, edit toc, save and see changes`

### 4.4 TDD Steps

1. **Test** back `POST /api/templates` (rouge).
2. **Implémenter** upload Drive + table.
3. **Test** front `<TemplatesList/>` stub data.
4. **Implémenter** fetch + affichage.
5. **Test** front `<TemplateEditor/>` interaction drag-drop.
6. **Implémenter** update call et feedback.

---

## 5. Page Génération de DIP

### 5.1 User Story

> En tant que Responsable Qualité, je veux générer et télécharger mon DIP en Word ou PDF.

### 5.2 Critères d'acceptation

- CA5.1 : Sélecteurs produit, template, format apparaissent.
- CA5.2 : "Générer" lance un job asynchrone, bouton désactivé pendant exécution.
- CA5.3 : À la fin, un aperçu PDF s'affiche et un lien de téléchargement est disponible.
- CA5.4 : Historique listé en bas avec statut, date, lien.
- CA5.5 : Les fichiers .docx et .pdf sont automatiquement enregistrés sur Google Drive dans le dossier
  `<Client>/<Produit>/<Réf_formule>/`, au même niveau que le sous-dossier « Annexes », avec le nom
  `<client>-<marque>-<produit>.<ext>`.

### 5.3 Tests à écrire

#### Backend

- `test_post_generate_creates_job_and_returns_job_id()`
- `test_job_worker_updates_generation_status()`

#### Frontend

- `GenerateForm disables button while pending()`
- `HistoryTable shows new entry after generation()`

#### E2E

- `should generate a DIP and download the PDF`

### 5.4 TDD Steps

1. **Test** back `POST /api/generate` (fail).
2. **Implémenter** job queue + table `generations`.
3. **Test** worker logic (unit).
4. **Test** front `<GenerateForm/>` initial state.
5. **Implémenter** API call + loading state.
6. **Test** E2E génération complete.

---

## 6. Page Automatisation & Tâches

### 6.1 User Story

> En tant que Responsable Qualité, je veux planifier des rappels et tâches récurrentes.

### 6.2 Critères d'acceptation

- CA6.1 : Afficher liste de tâches (titre, fréquence, statut).
- CA6.2 : Bouton « Nouvelle tâche » ouvre un modal de création.
- CA6.3 : Modifier / activer / désactiver / supprimer en un clic.

### 6.3 Tests à écrire

#### Backend

- `test_create_task_with_rrule()`
- `test_toggle_task_enabled()`

#### Frontend

- `TasksTable toggles enable switch()`
- `TaskModalNew submits form and refreshes list()`

#### E2E

- `should create, disable and delete a task`

### 6.4 TDD Steps

1. **Test** back `POST /api/tasks` (rouge).
2. **Implémenter** table `tasks` + route.
3. **Test** front `<TasksTable/>` empty state.
4. **Implémenter** fetch + display.
5. **Test** modal creation.
6. **Implémenter** création + feedback.

---

## 7. Page Logs & Traçabilité

### 7.1 User Story

> En tant que Responsable Qualité, je veux consulter l'historique de toutes les actions.

### 7.2 Critères d'acceptation

- CA7.1 : Timeline verticale chronologique.
- CA7.2 : Filtres par date et type d'événement.
- CA7.3 : Bouton « Export » génère un CSV.

### 7.3 Tests à écrire

#### Backend

- `test_get_logs_with_filters()`
- `test_export_logs_csv()`

#### Frontend

- `LogsTimeline renders events in order()`
- `LogFilters apply filters correctly()`

#### E2E

- `should filter logs and export CSV`

### 7.4 TDD Steps

1. **Test** back `GET /api/logs` with filters.
2. **Implémenter** query SQL + pagination.
3. **Test** front `<LogsTimeline/>` stub data.
4. **Implémenter** fetch + display.
5. **Test** export button calls `GET /api/logs?export=csv`.
6. **Implémenter** route CSV.

---

## 8. Page Administration & Sécurité

### 8.1 User Story

> En tant qu'Admin, je veux gérer les utilisateurs et paramètres globaux.

### 8.2 Critères d'acceptation

- CA8.1 : CRUD complet sur les utilisateurs et leurs rôles.
- CA8.2 : Onglets de paramètres (auth, sauvegardes, quotas).
- CA8.3 : Interface de backup/restore.

### 8.3 Tests à écrire

#### Backend

- `test_user_crud_endpoints()`
- `test_patch_settings_updates_value()`

#### Frontend

- `UsersManagement adds and removes users()`
- `SettingsTabs persists changes()`

#### E2E

- `should create user, change role, and update settings`

### 8.4 TDD Steps

1. **Test** back user CRUD (rouge).
2. **Implémenter** routes + services.
3. **Test** front `<UsersManagement/>`Empty.
4. **Implémenter** fetch + UI.
5. **Test** settings tabs.
6. **Implémenter** patch API + feedback.

---

## 9. Page Aide & Documentation

### 9.1 User Story

> En tant qu'utilisateur, je veux accéder à la FAQ et solliciter un chatbot.

### 9.2 Critères d'acceptation

- CA9.1 : FAQ en accordéons filtrable par mot-clé.
- CA9.2 : Chatbot widget ouvert en bas à droite.
- CA9.3 : Formulaire "Signaler un bug" en bas de page.

### 9.3 Tests à écrire

#### Frontend

- `FaqAccordion filters questions as you type()`
- `ChatbotWidget opens and sends message()`

#### E2E

- `should search FAQ and open chatbot`

### 9.4 TDD Steps

1. **Test** front `<FaqAccordion/>` (rouge).
2. **Implémenter** composant accordéon + search.
3. **Test** front `<ChatbotWidget/>` initial.
4. **Implémenter** intégration Dialogflow/Botpress.
5. **Test** bug report form submission.
