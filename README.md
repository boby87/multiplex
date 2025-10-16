# Multiflex

## Introduction / Description

Multiflex est une application web développée avec Angular, conçue pour offrir une interface utilisateur moderne et réactive. Le projet utilise TypeScript et JavaScript, s’appuie sur npm pour la gestion des dépendances, et propose une architecture modulaire adaptée aux applications d’entreprise.

## Architecture du projet

### Structure des dossiers

- `src/` : Code source principal de l’application
  - `app/` : Composants, modules, services, routes, configuration
    - `core/` : Services, gardes, interceptors, validateurs partagés
    - `features/` : Modules fonctionnels (ex : `admin/`, `users/`)
    - `layouts/` : Composants de mise en page (sidebar, topbar, etc.)
    - `shared/` : Composants, modèles, pipes, utilitaires réutilisables
  - `assets/` : Fichiers statiques (images, polices, i18n, SCSS)
  - `environments/` : Fichiers de configuration d’environnement (`environment.ts`, `environment.prod.ts`)
- `public/` : Fichiers publics accessibles directement
- `mock/` : Données de mock pour le développement
- Fichiers de configuration : `angular.json`, `package.json`, `tsconfig.json`, `jest.config.ts`, etc.

### Langages et frameworks

- **Langages** : TypeScript, JavaScript, SCSS
- **Framework principal** : Angular (CLI v19.0.6)
- **Tests** : Jest (unitaires), Karma (runner)
- **Outils** : npm, Docker, ESLint, Jenkins

## Communication entre composants

- **Services Angular** : Utilisés pour la communication interne entre composants via l’injection de dépendances.
- **API externes** : Les services (`core/service/`, `service/`) consomment des API REST via `HttpClient`.
- **Mock API** : Présence de `mock/db.json` pour simuler des réponses backend en développement.
- **Gestion d’événements** : Utilisation probable de RxJS pour la gestion des flux asynchrones et des événements.
- **Environnements** : Les URLs et clés d’API sont configurées dans `environments/`.

## Installation et lancement

### Prérequis

- **Node.js** : v18.x ou supérieur recommandé
- **npm** : v9.x ou supérieur
- **Angular CLI** : v19.0.6 (`npm ci`)
- **Docker** (optionnel, pour le déploiement ou les tests d’intégration)

### Étapes d’installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/onetechlabs-solutions/multiflex-angular-webapp.git
   cd multiflex-angular-webapp
