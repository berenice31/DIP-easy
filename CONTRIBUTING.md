# Guide de Contribution

Merci de votre intérêt pour contribuer à DIP-easy ! Ce document décrit le processus de contribution et les règles à suivre.

## Code de Conduite

Nous nous engageons à maintenir un environnement de développement respectueux et inclusif. Tout comportement inapproprié ne sera pas toléré.

## Processus de Contribution

### 1. Préparation de l'environnement

- Fork le repository
- Cloner votre fork
- Configurer le remote upstream

```bash
git remote add upstream https://github.com/votre-org/dip-easy.git
```

### 2. Création d'une branche

- Toujours créer une branche depuis `develop`
- Utiliser la convention de nommage :
  - `feature/nom-de-la-feature` pour les nouvelles fonctionnalités
  - `fix/nom-du-bug` pour les corrections de bugs
  - `docs/nom-de-la-doc` pour les modifications de documentation

### 3. Développement

1. **Tests d'abord**

   - Écrire les tests unitaires ou d'intégration
   - S'assurer qu'ils échouent initialement (TDD)

2. **Implémentation**

   - Écrire le code minimal pour faire passer les tests
   - Suivre les conventions de code existantes
   - Documenter les changements majeurs

3. **Documentation**
   - Mettre à jour le README si nécessaire
   - Mettre à jour le spec OpenAPI pour les changements d'API
   - Documenter les nouvelles fonctionnalités

### 4. Soumission d'une Pull Request

1. **Préparation**

   - S'assurer que tous les tests passent
   - Mettre à jour la documentation
   - Vérifier la conformité avec le spec OpenAPI

2. **Création de la PR**

   - Titre clair et descriptif
   - Description détaillée des changements
   - Référence aux issues concernées
   - Liste des tests ajoutés/modifiés

3. **Revue de code**
   - Répondre aux commentaires
   - Faire les modifications demandées
   - Maintenir une discussion constructive

### 5. Merge

- La PR sera mergée une fois :
  - Tous les tests passent
  - Au moins une approbation obtenue
  - Les conflits sont résolus
  - La documentation est à jour

## Standards de Code

### Backend (Python)

- Suivre PEP 8
- Utiliser des docstrings
- Écrire des tests unitaires complets

### Frontend (React/TypeScript)

- Suivre les conventions de nommage
- Utiliser TypeScript strict
- Écrire des tests avec Jest/Cypress

## Questions et Support

Pour toute question ou problème :

- Ouvrir une issue
- Utiliser le canal de discussion dédié
- Contacter les mainteneurs

## Remerciements

Merci à tous les contributeurs pour leur temps et leurs efforts !
