# DEVBOOK – DIP'Easy (TDD)

Ce DEVBOOK liste toutes les User Stories, Critères d'acceptation et Tests à écrire pour la méthodologie TDD.  
Cochez les items au fur et à mesure de leur implémentation :

> **Légende**
>
> - [ ] : pas encore réalisé
> - [x] : fait

---

## 1. Authentification & Sécurité

**User Story**

> En tant qu'utilisateur, je veux pouvoir me connecter avec login/mot de passe et, si activé, un code 2FA, pour accéder à l'application.

**Critères d'acceptation**

- [x] Page de connexion créée avec Chakra UI
- [x] Structure de routage mise en place
- [x] Tentative de login avec identifiants incorrects renvoie 401
- [x] Login sans 2FA renvoie un token JWT valide
- [ ] Login sur compte 2FA renvoie un état "2FA required"
- [ ] Validation du code 2FA renvoie le token JWT
- [x] Accès aux routes protégées sans token renvoie 401
- [x] Redirection après login fonctionnelle
- [x] Gestion du token JWT dans le localStorage
- [x] Protection des routes frontend avec contexte d'authentification

**Tests à écrire**

- [x] test_login_wrong_password_returns_401
- [x] test_login_without_2fa_returns_jwt
- [ ] test_login_with_2fa_requires_code
- [ ] test_validate_2fa_code_success
- [x] test_protected_route_without_token_unauthorized

**Prochaines étapes**

1. [x] Implémenter l'API d'authentification côté backend
2. [x] Connecter le frontend à l'API
3. [x] Gérer le stockage du token JWT
4. [x] Implémenter la protection des routes
5. [ ] Ajouter la gestion du 2FA
6. [ ] Ajouter la fonctionnalité de déconnexion
7. [ ] Implémenter le rafraîchissement automatique du token
8. [ ] Ajouter la gestion des sessions multiples

---

## 2. Dashboard

**User Story**

> En tant que Responsable Qualité, je veux voir mes KPI et la liste des derniers produits pour piloter mon activité.

**Critères d'acceptation**

- [ ] GET /dashboard/kpis renvoie `{dips_generated: int, errors: int, avg_time: float}`
- [ ] GET /dashboard/recent-products renvoie un tableau des 5 derniers produits

**Tests à écrire**

- [ ] test_get_kpis_structure_and_types
- [ ] test_get_recent_products_length_and_fields

---

## 3. Gestion des Produits

**User Story**

> Je veux lister, filtrer, créer et éditer des produits pour alimenter mes DIP.

**Critères d'acceptation**

- [ ] GET /products supporte filtres `?q=&status=&date=&tag=`
- [ ] POST /products crée un produit (201 + payload)
- [ ] PUT /products/:id met à jour les métadonnées (200)
- [ ] GET /products/:id renvoie détail du produit et `% completeness`

**Tests à écrire**

- [ ] test_list_products_with_filters
- [ ] test_create_product_missing_field_400
- [ ] test_create_product_success_201_and_payload
- [ ] test_update_product_changes_persisted

---

## 4. Collecte de données

**User Story**

> Je dois renseigner toutes les données réglementaires et importer mes pièces jointes en cinq étapes.

**Critères d'acceptation**

- [ ] GET /products/:id/collection renvoie l'état de complétude par étape
- [ ] PUT /products/:id/collection/step met à jour les données d'une étape et renvoie nouvelle complétude
- [ ] POST /products/:id/collection/annexes accepte des fichiers multipart, stocke sur Drive et renvoie les file IDs

**Tests à écrire**

- [ ] test_get_collection_status_initially_zero
- [ ] test_put_collection_step_updates_status
- [ ] test_upload_annexes_stores_file_and_returns_id

---

## 5. Templates & Style

**User Story**

> Je veux importer un template Word et configurer la table des matières et le style pour mes futurs DIP.

**Critères d'acceptation**

- [ ] POST /templates avec fichier .dotx renvoie 201 + template ID
- [ ] GET /templates/:id renvoie métadonnées + JSON TOC + style guide
- [ ] PUT /templates/:id/style met à jour polices, tailles, couleurs

**Tests à écrire**

- [ ] test_upload_template_dotx_stores_file
- [ ] test_get_template_returns_parsed_toc_and_style
- [ ] test_update_template_style_persists_changes

---

## 6. Génération de DIP

**User Story**

> Je sélectionne un produit, un template et un format (Word/PDF), je génère mon DIP.

**Critères d'acceptation**

- [ ] POST /generation avec `{productId, templateId, format}` renvoie 202 + job ID
- [ ] GET /generation/:jobId renvoie `status` et `download_url` quand `done`
- [ ] Fichier généré est valide (vérifiable par checksum/pages)

**Tests à écrire**

- [ ] test_post_generation_starts_job_and_returns_id
- [ ] test_get_generation_status_changes_to_done_and_url

---

## 7. Automatisation & Tâches planifiées

**User Story**

> Je veux définir et piloter des tâches récurrentes pour générer, collecter et archiver mes DIP.

**Critères d'acceptation**

- [ ] GET /tasks liste toutes les tâches planifiées
- [ ] POST /tasks crée une tâche avec RRULE valide
- [ ] PUT /tasks/:id modifie ou active/désactive une tâche

**Tests à écrire**

- [ ] test_create_task_with_invalid_rrule_400
- [ ] test_create_and_run_task_executes_action

---

## 8. Journaux & Traçabilité (Logs)

**User Story**

> Je veux consulter et exporter l'historique des actions et erreurs pour audit.

**Critères d'acceptation**

- [ ] GET /logs supporte filtres `?from=&to=&type=`
- [ ] GET /logs/export renvoie un CSV téléchargeable

**Tests à écrire**

- [ ] test_get_logs_with_filters_returns_expected_entries
- [ ] test_export_logs_downloads_csv_with_header

---

## 9. Administration & Sécurité

**User Story**

> Je gère les utilisateurs, la 2FA, les backups et le mode maintenance depuis une console admin.

**Critères d'acceptation**

- [ ] CRUD /admin/users (POST, GET, PUT, DELETE)
- [ ] CRUD /admin/settings
- [ ] POST /admin/backup déclenche un dump

**Tests à écrire**

- [ ] test_admin_create_user_and_assign_role
- [ ] test_toggle_2fa_setting_persists

---

## 10. Aide & Documentation

**User Story**

> J'accède à la FAQ, aux tutoriels et à un chatbot pour m'assister.

**Critères d'acceptation**

- [ ] GET /help/faq renvoie la liste des questions/réponses
- [ ] GET /help/tutorials renvoie des liens vers les tutoriels
- [ ] Chatbot intégré via POST /chat

**Tests à écrire**

- [ ] test_get_faq_returns_list
- [ ] test_chatbot_endpoint_responds

---
