# Internal Tools API

Backend de gestion d'outils internes pour TechCorp Solutions. API RESTful permettant le suivi des coûts, des accès et de l'usage des outils SaaS.

## Technologies
- **Langage:** Node.js / TypeScript
- **Framework:** Express.js 
- **Base de données:** MySQL 8.0
- **ORM:** TypeORM
- **Documentation:** Swagger (OpenAPI 3.0)
- **Port API:** 3000 (configurable via `.env`)

## Quick Start

### Prérequis
* Docker et Docker Compose installés.
* Ports 3000 et 8080 disponibles.

### Démarrage complet (Recommandé)

1. **Lancer l'environnement (BDD + API + Admin) :**
   docker-compose up --build

Installation des dépendances (si lancement local hors Docker) :
npm install

Démarrage du serveur (si lancement local hors Docker) :

npm run dev


Accès à l'API :

API Root : http://localhost:3000/api/tools

Documentation :

Swagger UI : http://localhost:3000/api-docs


# Configuration
Variables d'environnement
Créez un fichier .env à la racine basé sur cet exemple :

Ini, TOML

# --- DATABASE ---
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=internal_tools
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=dev
MYSQL_PASSWORD=dev123

# --- API ---
PORT=3000

# --- TOOLS ---
PHPMYADMIN_PORT=8080
Configuration DB
Host: mysql (dans Docker) ou localhost (en local)

Interface Admin: PhpMyAdmin disponible sur http://localhost:8080

Credentials: User: dev / Password: dev123

# Tests
npm test
Note : Lance les tests unitaires (Jest) et les tests d'intégration.

### Architecture Logicielle
* **Architecture MVC (Model-View-Controller) :** Séparation stricte des responsabilités.
    * **Controllers :** Gèrent la logique métier, la validation des entrées et les codes HTTP.
    * **Entities (Models) :** Définissent la structure des données et les relations via TypeORM.
    * **Services (implicites) :** La logique complexe est découplée des routes pour être testable.

### Stack Technologique
* **TypeScript :** Choisi pour son typage statique strict. Il sécurise le développement, réduit les bugs de runtime et sert de documentation vivante pour les structures de données (DTOs).
* **Express.js :** Framework standard de l'industrie, sélectionné pour sa légèreté, sa performance et sa maturité.
* **TypeORM & MySQL :** Utilisation d'un ORM pour l'abstraction de la base de données. Permet de manipuler les données via des objets (Pattern Data Mapper/Active Record) tout en protégeant contre les injections SQL.
* **Docker :** Conteneurisation complète de l'application (API + BDD + Admin) pour garantir la reproductibilité de l'environnement (élimine le *"ça marche sur ma machine"*).

### Documentation & Qualité
* **Swagger (Code-First) :** La documentation OpenAPI est générée directement depuis les commentaires du code (`swagger-jsdoc`), garantissant qu'elle reste toujours synchronisée avec l'implémentation réelle.
* **Outillage DX (Developer Experience) :** Utilisation de `nodemon` pour le hot-reload et `dotenv` pour une gestion sécurisée des secrets d'environnement.

## Structure du projet
.
├── src
│   ├── controllers    # Logique métier et validation des entrées (Business Logic)
│   ├── entity         # Modèles de données TypeORM (Data Layer)
│   ├── tests          # Logique métier et services de traitement de données.
│   ├── services       # Tests End 2 End
│   ├── swagger.ts     # Configuration de la documentation API
│   └── data-source.ts # Configuration de la connexion MySQL
│
├── init.sql           # Script d'initialisation et de seeding de la BDD
├── docker-compose.yml # Orchestration des conteneurs (API + MySQL + PhpMyAdmin)
├── package.json       # Dépendances et scripts
└── server.ts          # Point d'entrée et configuration Express