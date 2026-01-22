# 🛠️ Internal Tools API

API REST pour la gestion des outils internes d'une entreprise, développée avec Node.js, TypeScript, Express et TypeORM.

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Architecture du projet](#-architecture-du-projet)
- [API Endpoints](#-api-endpoints)
- [Documentation Swagger](#-documentation-swagger)
- [Scripts disponibles](#-scripts-disponibles)
- [Bases de données](#-bases-de-données)

---

## 🎯 Vue d'ensemble

Cette API permet de gérer un inventaire d'outils internes utilisés par une entreprise. Elle permet de créer, lire, modifier et supprimer des outils, tout en gardant une trace des coûts mensuels, des départements propriétaires et du nombre d'utilisateurs actifs.

## ✨ Fonctionnalités

- ✅ CRUD complet sur les outils (Create, Read, Update, Delete)
- 🔍 Filtrage des outils par département
- 💰 Suivi des coûts mensuels
- 👥 Gestion du nombre d'utilisateurs actifs
- 📊 Catégorisation des outils
- 🔄 Statuts d'outils (active, deprecated, trial)
- 📖 Documentation API interactive avec Swagger
- 🐬 Support MySQL avec phpMyAdmin
- 🐘 Support PostgreSQL avec pgAdmin (architecture préparée)

## 🚀 Technologies utilisées

- **Runtime**: Node.js avec TypeScript
- **Framework**: Express 5
- **ORM**: TypeORM
- **Base de données**: MySQL 8.0
- **Documentation**: Swagger UI
- **Containerisation**: Docker & Docker Compose
- **Dev Tools**: Nodemon, ts-node

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://www.docker.com/get-started) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd internal-tools-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer le fichier `.env`**

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=internal_tools
MYSQL_USER=dev
MYSQL_PASSWORD=dev123
MYSQL_PORT=3306

# phpMyAdmin
PHPMYADMIN_PORT=8080
```

## ⚙️ Configuration

Le projet est configuré pour fonctionner avec MySQL :

## 🚀 Démarrage

### Démarrage avec MySQL

1. **Lancer la stack MySQL**
```bash
chmod +x start-mysql.sh
./start-mysql.sh
```

2. **Démarrer l'API en mode développement**
```bash
npm run dev
```

L'API sera accessible sur : `http://localhost:3000`

### Autres commandes utiles

**Tester les connexions aux bases de données**
```bash
chmod +x test-connections.sh
./test-connections.sh
```

**Réinitialiser toutes les données**
```bash
chmod +x reset-all.sh
./reset-all.sh
```

## 📁 Architecture du projet

```
internal-tools-api/
│
├── src/
│   ├── controllers/
│   │   └── toolController.ts      # Gestion des requêtes HTTP
│   │
│   ├── services/
│   │   └── toolService.ts         # Logique métier
│   │
│   ├── repositories/
│   │   └── toolRepository.ts      # (Vide - géré par TypeORM)
│   │
│   ├── entities/
│   │   └── Tool.ts                # Modèle de données TypeORM
│   │
│   ├── data-source.ts             # Configuration TypeORM
│   └── swagger.ts                 # Configuration Swagger
│
├── mysql/
│   └── init.sql                   # Script d'initialisation MySQL
│
├── server.ts                      # Point d'entrée de l'application
├── docker-compose.yml             # Configuration Docker
├── Dockerfile                     # Image Docker de l'API
├── package.json                   # Dépendances Node.js
└── tsconfig.json                  # Configuration TypeScript
```

### Explication de l'architecture

L'application suit une **architecture en couches** :

1. **Controller** (`toolController.ts`) 
   - Reçoit les requêtes HTTP
   - Valide les paramètres
   - Appelle le service approprié
   - Retourne la réponse au client

2. **Service** (`toolService.ts`)
   - Contient la logique métier
   - Interagit avec le repository
   - Traite les données

3. **Repository** (géré par TypeORM)
   - Gère l'accès aux données
   - Exécute les requêtes SQL

4. **Entity** (`Tool.ts`)
   - Définit le modèle de données
   - Mapping avec la table SQL

## 🌐 API Endpoints

### Outils (Tools)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/tools` | Récupère tous les outils |
| `GET` | `/api/tools?department=IT` | Filtre les outils par département |
| `GET` | `/api/tools/:id` | Récupère un outil spécifique |
| `POST` | `/api/tools` | Crée un nouvel outil |
| `PUT` | `/api/tools/:id` | Met à jour un outil |
| `DELETE` | `/api/tools/:id` | Supprime un outil |

### Exemples de requêtes

**Créer un outil**
```bash
curl -X POST http://localhost:3000/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notion",
    "description": "Outil de prise de notes collaboratif",
    "vendor": "Notion Labs",
    "websiteUrl": "https://notion.so",
    "categoryId": 2,
    "monthlyCost": 200.00,
    "activeUsersCount": 30,
    "ownerDepartment": "Marketing",
    "status": "active"
  }'
```

**Récupérer tous les outils du département IT**
```bash
curl http://localhost:3000/api/tools?department=IT
```

## 📖 Documentation Swagger

Une documentation interactive complète est disponible via Swagger UI :

🔗 **URL** : `http://localhost:3000/api-docs`

Swagger permet de :
- Visualiser tous les endpoints disponibles
- Tester les requêtes directement depuis l'interface
- Voir les schémas de données
- Comprendre les paramètres requis

## 📜 Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| Développement | `npm run dev` | Lance l'API avec hot-reload |
| MySQL Stack | `./start-mysql.sh` | Démarre MySQL + phpMyAdmin |
| PostgreSQL Stack | `./start-postgres.sh` | Démarre PostgreSQL + pgAdmin |
| Test connexions | `./test-connections.sh` | Vérifie les connexions BDD |
| Reset | `./reset-all.sh` | Réinitialise toutes les données |

## 🗄️ Bases de données

### MySQL

**Accès phpMyAdmin** : `http://localhost:8080`
- Serveur : `mysql`
- Utilisateur : `dev` (ou celui défini dans `.env`)
- Mot de passe : `dev123` (ou celui défini dans `.env`)

**Structure de la table `tools`**
```sql
CREATE TABLE tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    website_url VARCHAR(500),
    category_id INT NOT NULL,
    monthly_cost DECIMAL(10,2) NOT NULL,
    active_users_count INT DEFAULT 0,
    owner_department VARCHAR(100) NOT NULL,
    status ENUM('active', 'deprecated', 'trial') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🐛 Dépannage

**Problème : L'API ne démarre pas**
- Vérifiez que MySQL est bien démarré : `docker ps`
- Vérifiez les logs : `docker logs internal-tools-api`

**Problème : Erreur de connexion à MySQL**
- Vérifiez le fichier `.env`
- Testez la connexion : `./test-connections.sh`
- Redémarrez les containers : `docker-compose --profile mysql restart`

**Problème : Port déjà utilisé**
- Modifiez les ports dans le fichier `.env`
- Redémarrez les services

## 📝 Bonnes pratiques

- ✅ Toujours utiliser TypeScript pour la type safety
- ✅ Documenter les nouveaux endpoints dans Swagger
- ✅ Tester les endpoints via Swagger UI avant de commiter
- ✅ Utiliser des transactions pour les opérations critiques
- ✅ Valider les données côté serveur


