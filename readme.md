## Internal Tools API
Backend de gestion d'outils internes pour TechCorp Solutions. API RESTful permettant le suivi des coûts, des accès et de l'usage des outils SaaS.

## Technologies
Langage: Node.js / TypeScript
Framework: Express.js
Base de données: MySQL 8.0
ORM: TypeORM
Documentation: Swagger (OpenAPI 3.0)
Port API: 3000 (configurable via .env)

## Quick Start
docker-compose --profile mysql up -d
npm install
npm run dev
API disponible sur http://localhost:3000
Documentation: http://localhost:3000/api-docs

## Configuration
Variables d'environnement: voir .env à créer avec MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, PORT
Configuration DB: MySQL sur port 3306, PhpMyAdmin sur http://localhost:8080 (user: dev, password: dev123)

## Tests
npm test - Tests unitaires + intégration

## Architecture
Choix TypeScript: Typage strict pour réduire les bugs runtime et documenter les structures de données
Express.js: Framework léger et mature, standard de l'industrie
TypeORM: ORM pour abstraction BDD et protection contre injections SQL
Docker: Reproductibilité de l'environnement (API + BDD + Admin)
Pattern MVC: Séparation Controllers (HTTP) / Services (Logique métier + SQL) / Entities (Modèles)

## Structure du projet
src/
├── src
│   ├── controllers    # Logique métier et validation des entrées (Business Logic)
│   ├── entity         # Modèles de données TypeORM (Data Layer)
│   ├── tests          # Logique métier et services de traitement de données.
│   ├── services       # Tests End 2 End
│   ├── swagger.ts     # Configuration de la documentation API
│   ├── data-source.ts # Configuration de la connexion MySQL
│   └── server.ts      # Point d'entrée et configuration Express
│
├── init.sql           # Script d'initialisation et de seeding de la BDD
├── docker-compose.yml # Orchestration des conteneurs (API + MySQL + PhpMyAdmin)
├── package.json       # Dépendances et scripts

## Endpoints
CRUD Tools

GET /api/tools - Liste tous les outils (filtres: department, status, min_cost, max_cost, pagination)
GET /api/tools/:id - Récupère un outil spécifique
POST /api/tools - Crée un nouvel outil
PUT /api/tools/:id - Met à jour un outil
DELETE /api/tools/:id - Supprime un outil

Analytics

GET /api/analytics/department-costs - Répartition des coûts par département
GET /api/analytics/expensive-tools - Top outils les plus coûteux avec rating d'efficacité
GET /api/analytics/tools-by-category - Répartition du budget par catégorie

Non implémentés (contrainte de temps)

GET /api/analytics/low-usage-tools - Outils sous-utilisés
GET /api/analytics/vendor-summary - Analyse par fournisseur

## Approche Analytics

Filtrage automatique: seuls les outils status='active' inclus dans les calculs
Précision: montants à 2 décimales, pourcentages à 1 décimale
Cohérence: pourcentages totalisent 100% (tolérance ±0.1%)
Gestion cas limites: division par zéro, outils sans utilisateurs, catégories vides
Métriques: cost_percentage, cost_per_user, efficiency_rating basé sur comparaison moyenne entreprise