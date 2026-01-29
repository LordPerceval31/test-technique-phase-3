# 🚀 TechCorp Dashboard - Jour 6, 7 & 8 (Final Release)

Bienvenue dans le cockpit de gestion des outils internes de TechCorp. Cette application permet de monitorer les dépenses SaaS, l'utilisation des outils par département et l'optimisation des coûts à travers une interface unifiée.

## 🏗️ Architecture du Projet

L'application est construite avec une approche modulaire et typée :

- **Vite + React + TS** : Pour un environnement de développement ultra-rapide et sécurisé.
- **Tailwind CSS v4** : Utilisation des nouvelles capacités de styling pour un design "Pixel Perfect".
- **Recharts** : Librairie de visualisation de données pour les graphiques analytiques (Jour 8).
- **Vitest & React Testing Library** : Suite de tests unitaires garantissant la robustesse des composants critiques.

## 🎨 Design System & UX

J'ai maintenu une cohérence visuelle stricte sur les 3 jours :

- **Mode Sombre/Clair Fluide** : Système de thémisation complet.
- **Navigation Contextuelle (Drill-down)** : Interaction fluide entre les graphiques analytiques et le catalogue d'outils.
- **Deep Linking** : Synchronisation des états de filtrage avec l'URL pour un partage facile.

## 📅 Journal des Livrables

### ✅ Jour 6 : Dashboard Foundation (Terminé)
- **Navigation** : Header responsive et sidebar virtuelle.
- **KPIs** : Cartes dynamiques avec barres de progression.
- **Tableau** : Liste des outils récents avec tri et pagination.
- **Tests** : Couverture unitaire des composants de base (`KPICard`, `RecentTools`, `Header`).

### ✅ Jour 7 : Tools Catalog (Autonomous Consistency)
- **Catalogue Complet** : Vue en grille (Grid) ou liste avec pagination.
- **CRUD Complet** : Ajout, Modification et Suppression d'outils via Modales.
- **Filtres Avancés** : Moteur de recherche multi-critères (Nom, Département, Statut, Prix min/max).
- **Bulk Operations** : Sélection multiple pour suppression ou changement de statut en masse.
- **Gestion d'État** : Initialisation "Lazy" des filtres basée sur l'URL.
- **Tests** : Couverture unitaire des composants de base (`toolsCard`, `ToolsFilter`).

### ✅ Jour 8 : Analytics & Data Viz (Advanced Integration)
- **Visualisation** : Intégration de graphiques complexes (`AreaChart`, `PieChart`, `BarChart`).
- **Time Machine** : Filtrage temporel réel (30j, 90j, 12 mois) recalculant tous les KPIs et graphiques.
- **Interactivité** :
  - **Drill-down** : Cliquer sur un département dans le graphique redirige vers la page Tools filtrée.
  - **Export Data** : Génération de rapports CSV dynamiques basés sur la vue actuelle.
- **Logique Métier** : Calcul précis du coût par employé (Headcount vs Licences) et taux d'adoption.

## 🚧 Limitations Connues (Non implémenté par manque de temps)
En raison des contraintes temporelles strictes de l'exercice (3 jours), les fonctionnalités suivantes n'ont pas pu être finalisées dans cette version :

- **Insights Dashboard (Business Intelligence)** : La section d'alertes automatiques (ex: "3 outils inutilisés détectés") et les calculs de ROI n'ont pas été implémentés.
- **Predictive Insights** : Les projections de coûts futurs (Forecasting) sont absentes.
- **Usage Trends** : Les graphiques spécifiques de "Growth Trends" (timeline des nouveaux outils) manquent à l'appel.
- **Tests E2E** : La couverture de tests n'a pas été étendue aux fonctionnalités complexes des Jours 7 et 8 (Forms, Charts interactions).

## 🚀 Quick Start

### Pré-requis
Ce projet nécessite une API Backend pour fonctionner (voir `Internal Tools API`).

### Installation
npm install


### Configuration
Assurez-vous que l'API tourne sur le port configuré dans src/utils/api.ts.

### Lancer le développement
npm run dev

### Lancer la suite de tests
npm test