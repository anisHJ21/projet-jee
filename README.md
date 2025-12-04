# EcoCollect - Système Intelligent de Gestion des Déchets Urbains

## 📋 Description du Projet

EcoCollect est une plateforme intelligente de gestion des déchets urbains conçue pour les municipalités. Le système centralise la gestion des points de collecte, véhicules, employés et tournées tout en fournissant un suivi en temps réel, une planification automatisée et des insights basés sur les données pour réduire les coûts opérationnels et l'impact environnemental.

### Problèmes Résolus

- **Inefficacité dans la planification des tournées** : Trajets longs, surcoûts en carburant, émissions de CO₂
- **Absence de suivi en temps réel** : Débordements de conteneurs, nuisances
- **Manque de coordination** : Limitation du tri et du recyclage
- **Indicateurs de performance manquants** : Difficulté à obtenir des métriques fiables

## 🏗️ Architecture

### Stack Technologique

**Backend :**
- **Spring Boot 3.2.0** avec Java 17
- **Spring Data MongoDB** pour la persistance
- **MongoDB** (NoSQL) comme base de données
- **Log4j2** pour la gestion des logs
- **Validation Jakarta** pour la validation des données

**Frontend :**
- **React 18** avec TypeScript
- **Vite** comme outil de build
- **TanStack Query** pour la gestion d'état serveur
- **Shadcn/ui** (Radix UI) pour les composants
- **Leaflet** pour la visualisation cartographique
- **Tailwind CSS** pour le styling

### Structure du Projet

```
TaskDoer/
├── backend/                          # Application Spring Boot
│   ├── src/main/java/com/ecocollect/wastemanagement/
│   │   ├── controller/              # Controllers REST
│   │   ├── service/                 # Services métier
│   │   ├── repository/              # Repositories MongoDB
│   │   ├── model/                   # Entités MongoDB
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── exception/               # Gestion d'exceptions
│   │   └── config/                  # Configuration
│   ├── src/main/resources/
│   │   └── application.yml          # Configuration Spring Boot
│   └── pom.xml                      # Dépendances Maven
├── client/                          # Application React
│   ├── src/
│   │   ├── components/              # Composants React
│   │   ├── pages/                   # Pages de l'application
│   │   ├── lib/                     # Utilitaires et configuration
│   │   └── hooks/                   # Hooks React personnalisés
│   └── package.json
└── README.md
```

## 🗄️ Structure MongoDB

### Collections

#### 1. **collectionPoints**
Gère les points de collecte de déchets avec géolocalisation.

```json
{
  "_id": "uuid",
  "name": "string",
  "address": "string",
  "wasteType": "plastic|organic|glass|paper|metal|mixed",
  "fillLevel": 0-100,
  "status": "operational|maintenance|full|damaged",
  "lastCollected": "string",
  "latitude": double,
  "longitude": double
}
```

**Index :**
- `location_2dsphere` sur `latitude` et `longitude` (géospatial)
- `fillLevel_status` composé sur `fillLevel` et `status`

#### 2. **employees**
Gère les employés de la municipalité.

```json
{
  "_id": "uuid",
  "name": "string",
  "role": "string",
  "status": "available|on_duty|off_duty",
  "phone": "string",
  "email": "string",
  "assignedZone": "string",
  "shiftsThisWeek": integer,
  "joinDate": "string"
}
```

**Index :**
- `status_zone` composé sur `status` et `assignedZone`

#### 3. **vehicles**
Gère la flotte de véhicules.

```json
{
  "_id": "uuid",
  "plateNumber": "string (unique)",
  "type": "string",
  "status": "available|in_use|maintenance",
  "capacity": integer,
  "currentLoad": integer,
  "fuelLevel": 0-100,
  "lastMaintenance": "string",
  "assignedDriver": "string",
  "currentRoute": "string"
}
```

**Index :**
- `plateNumber_unique` unique sur `plateNumber`

#### 4. **routes**
Gère les tournées de collecte.

```json
{
  "_id": "uuid",
  "name": "string",
  "status": "scheduled|in_progress|completed|cancelled",
  "zone": "string",
  "scheduledTime": "string",
  "estimatedDuration": "string",
  "collectionPoints": integer,
  "completedPoints": integer,
  "assignedVehicle": "string",
  "assignedEmployees": ["string"],
  "distance": "string"
}
```

#### 5. **alerts**
Gère les alertes critiques du système.

```json
{
  "_id": "uuid",
  "severity": "critical|warning|info",
  "title": "string",
  "description": "string",
  "location": "string",
  "timestamp": "string",
  "acknowledged": boolean
}
```

#### 6. **notifications**
Gère les notifications utilisateur.

```json
{
  "_id": "uuid",
  "type": "alert|warning|success|info",
  "title": "string",
  "message": "string",
  "timestamp": "string",
  "read": boolean
}
```

#### 7. **users**
Gère les utilisateurs du système (authentification).

```json
{
  "_id": "uuid",
  "username": "string (unique)",
  "password": "string (hashed)"
}
```

**Index :**
- `username_unique` unique sur `username`

## 🚀 Installation et Configuration

### Prérequis

- **Java 17+**
- **Maven 3.6+**
- **Node.js 18+** et **npm**
- **MongoDB 6.0+** (local ou Atlas)

### Backend (Spring Boot)

1. **Naviguer vers le dossier backend :**
```bash
cd backend
```

2. **Configurer MongoDB :**
   - Créer un fichier `.env` ou définir la variable d'environnement :
   ```bash
   export MONGODB_URI="mongodb://localhost:27017/ecocollect"
   ```
   - Ou modifier `src/main/resources/application.yml`

3. **Compiler et lancer l'application :**
```bash
mvn clean install
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`

### Frontend (React)

1. **Naviguer vers le dossier client :**
```bash
cd client
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Configurer l'URL de l'API :**
   - Créer un fichier `.env` :
   ```bash
   VITE_API_URL=http://localhost:8080
   ```

4. **Lancer l'application en développement :**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📡 API Endpoints

### Points de Collecte

- `GET /api/collection-points` - Liste tous les points
- `GET /api/collection-points/{id}` - Détails d'un point
- `POST /api/collection-points` - Créer un point
- `PATCH /api/collection-points/{id}` - Mettre à jour un point
- `DELETE /api/collection-points/{id}` - Supprimer un point

### Employés

- `GET /api/employees` - Liste tous les employés
- `GET /api/employees/{id}` - Détails d'un employé
- `POST /api/employees` - Créer un employé
- `PATCH /api/employees/{id}` - Mettre à jour un employé
- `DELETE /api/employees/{id}` - Supprimer un employé

### Véhicules

- `GET /api/vehicles` - Liste tous les véhicules
- `GET /api/vehicles/{id}` - Détails d'un véhicule
- `POST /api/vehicles` - Créer un véhicule
- `PATCH /api/vehicles/{id}` - Mettre à jour un véhicule
- `DELETE /api/vehicles/{id}` - Supprimer un véhicule

### Tournées

- `GET /api/routes` - Liste toutes les tournées
- `GET /api/routes/{id}` - Détails d'une tournée
- `POST /api/routes` - Créer une tournée
- `PATCH /api/routes/{id}` - Mettre à jour une tournée
- `DELETE /api/routes/{id}` - Supprimer une tournée
- `POST /api/routes/optimize` - Optimiser une tournée
- `POST /api/routes/{id}/assign-employees` - Affecter des employés
- `POST /api/routes/plan` - Planifier une tournée intelligente

### Alertes

- `GET /api/alerts` - Liste toutes les alertes
- `GET /api/alerts/{id}` - Détails d'une alerte
- `POST /api/alerts` - Créer une alerte
- `PATCH /api/alerts/{id}` - Mettre à jour une alerte
- `DELETE /api/alerts/{id}` - Supprimer une alerte

### Notifications

- `GET /api/notifications` - Liste toutes les notifications
- `GET /api/notifications/{id}` - Détails d'une notification
- `POST /api/notifications` - Créer une notification
- `PATCH /api/notifications/{id}` - Mettre à jour une notification
- `DELETE /api/notifications/{id}` - Supprimer une notification
- `POST /api/notifications/mark-all-read` - Marquer toutes comme lues

### Dashboard

- `GET /api/dashboard/stats` - Statistiques du tableau de bord

## ✨ Fonctionnalités Implémentées

### 1. Gestion CRUD Complète
- ✅ Points de collecte avec géolocalisation
- ✅ Gestion des employés avec zones assignées
- ✅ Gestion de la flotte de véhicules
- ✅ Planification et suivi des tournées
- ✅ Système d'alertes et notifications

### 2. Carte Interactive
- ✅ Affichage des points de collecte sur une carte Leaflet
- ✅ Marqueurs colorés selon le niveau de remplissage
- ✅ Popups avec détails des points
- ✅ Filtrage et recherche

### 3. Optimisation de Tournées
- ✅ Algorithme d'optimisation basé sur :
  - Distance entre points (formule Haversine)
  - Priorité selon le niveau de remplissage
  - Capacité des véhicules
- ✅ Endpoint : `POST /api/routes/optimize`

### 4. Notifications Automatiques
- ✅ Détection automatique des conteneurs pleins (≥80%)
- ✅ Création d'alertes critiques pour conteneurs ≥90%
- ✅ Notifications pour conteneurs endommagés
- ✅ Déclenchement lors de la création/mise à jour de points

### 5. Affectation Automatique des Employés
- ✅ Logique d'affectation basée sur :
  - Disponibilité (status = "available")
  - Zone assignée (correspondance avec la tournée)
  - Équilibrage de la charge de travail (shiftsThisWeek)
- ✅ Endpoint : `POST /api/routes/{id}/assign-employees`

### 6. Planification Intelligente
- ✅ Planification automatique de tournées :
  - Sélection des points prioritaires (fillLevel ≥ 60%)
  - Optimisation de l'ordre de collecte
  - Calcul automatique de distance et durée
  - Affectation automatique d'employés
- ✅ Endpoint : `POST /api/routes/plan`

### 7. Dashboard avec Statistiques
- ✅ Métriques en temps réel :
  - Total de points de collecte et nécessitant attention
  - Tournées actives
  - Employés disponibles/en service
  - Alertes actives et critiques

## 🔧 Configuration Avancée

### Variables d'Environnement

**Backend :**
- `MONGODB_URI` : URI de connexion MongoDB (défaut: `mongodb://localhost:27017/ecocollect`)
- `PORT` : Port du serveur (défaut: `8080`)
- `CORS_ORIGINS` : Origines CORS autorisées (séparées par des virgules)

**Frontend :**
- `VITE_API_URL` : URL de l'API backend (défaut: `http://localhost:8080`)

### Logs

Les logs sont configurés avec Log4j2 et suivent le format :
```
yyyy-MM-dd HH:mm:ss [LEVEL] [LOGGER] - MESSAGE
```

Niveau de log par défaut : `INFO` pour root, `DEBUG` pour `com.ecocollect`

## 🧪 Tests

### Tests Backend

```bash
cd backend
mvn test
```

Les tests utilisent :
- **JUnit** pour les tests unitaires
- **Mockito** pour le mocking
- **@DataMongoTest** pour les tests de repositories
- **@WebMvcTest** pour les tests de controllers

## 📦 Déploiement

### Backend

1. **Build du JAR :**
```bash
cd backend
mvn clean package
```

2. **Lancer le JAR :**
```bash
java -jar target/waste-management-1.0.0.jar
```

### Frontend

1. **Build de production :**
```bash
cd client
npm run build
```

2. **Servir les fichiers statiques :**
   - Les fichiers sont dans `client/dist`
   - Servir avec nginx, Apache, ou un serveur statique

## 🔐 Sécurité

- Validation des données avec Jakarta Validation
- Gestion centralisée des exceptions
- CORS configuré pour le frontend
- Authentification (infrastructure présente, à compléter selon besoins)

## 📝 Notes de Migration

### Migration de PostgreSQL vers MongoDB

Les principales différences :
- **UUID** → **String/ObjectId** pour les IDs
- **Arrays PostgreSQL** → **List<String>** en Java
- **Relations** → **Références par ID** ou **documents imbriqués**
- **Index géospatiaux** → **Index 2dsphere** pour les coordonnées

### Collections Créées via MCP MongoDB

Toutes les collections ont été créées via le serveur MCP MongoDB :
- `collectionPoints`
- `employees`
- `vehicles`
- `routes`
- `alerts`
- `notifications`
- `users`

Avec les index appropriés pour optimiser les performances.

## 🤝 Contribution

Ce projet a été développé dans le cadre d'une migration complète de Node.js/Express/PostgreSQL vers Spring Boot/MongoDB avec l'ajout de fonctionnalités intelligentes d'optimisation et de planification.

## 📄 Licence

MIT

## 👥 Auteurs

Développé pour la gestion intelligente des déchets urbains.

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2024

