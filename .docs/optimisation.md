## Composants dépendant de jQuery

1. **Carousel avec ngx-slick-carousel**:
   - **Composants concernés**: 
     - `LoginComponent` (`src/app/features/users/component/login/`)
     - `RegisterComponent` (`src/app/features/users/component/register/`)
     - `ProfileComponent` (`src/app/features/admin/profile/`)
   - **Dépendance**: jQuery est requis par slick-carousel, qui est encapsulé via ngx-slick-carousel
   - **Utilisation**: Carrousel de témoignages et avis clients principalement

2. **Menu de navigation avec MetisMenu**:
   - **Composant concerné**: 
     - `SidebarComponent` (`src/app/layouts/sidebar/`)
   - **Dépendance**: MetisMenu utilise jQuery en interne pour les menus déroulants
   - **Utilisation**: Gestion du menu latéral avec plusieurs niveaux de navigation

3. **Configuration générale**:
   - jQuery est importé globalement via `angular.json` (ligne 44)
   - Les fichiers CSS/JS de slick-carousel sont également importés globalement

## Impact technique

1. **Performance**: L'inclusion de jQuery ajoute environ 30kb (minifié + gzippé) au bundle JavaScript final

2. **Modernité du code**: Ces dépendances créent une architecture hybride combinant:
   - L'approche moderne d'Angular (Signals, standalone components)
   - Des bibliothèques legacy dépendant de jQuery

3. **Manipulation directe du DOM**:
   - Le SidebarComponent effectue des manipulations directes du DOM avec `document.getElementsByClassName()` et d'autres méthodes similaires
   - Ces manipulations seraient préférables en utilisant les techniques Angular (ViewChild, Renderer2)

## Alternatives possibles

1. **Pour les carrousels**: 
   - `ngx-owl-carousel-o` (sans dépendance à jQuery)
   - Angular CDK pour créer un carousel personnalisé
   - SwiperJS avec son wrapper Angular

2. **Pour la navigation**:
   - Remplacer MetisMenu par une implémentation native Angular utilisant:
     - Les animations Angular
     - Le data binding réactif
     - Les services et les Signals pour la gestion d'état

Ces changements permettraient de:
- Réduire la taille du bundle
- Améliorer la consistance architecturale
- Éviter les manipulations directes du DOM
- Faciliter les tests unitaires

La migration pourrait être progressive, en commençant par les composants les moins complexes comme les carrousels.
