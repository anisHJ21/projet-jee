# Guide de Démarrage Rapide

## Problèmes Corrigés

✅ **pom.xml** - Correction de la balise `<n>` en `<name>`  
✅ **@Transactional** - Retiré de tous les services (MongoDB ne nécessite pas de transactions pour les opérations simples)  
✅ **Imports manquants** - Ajout des imports `ValidationException`  
✅ **@GeoSpatialIndexed** - Retiré (les index géospatiaux sont créés via MCP MongoDB)

## Démarrage du Backend

### 1. Vérifier les prérequis
```bash
java -version  # Doit être Java 17+
mvn -version   # Doit être Maven 3.6+
```

### 2. Configurer MongoDB
Assurez-vous que MongoDB est en cours d'exécution :
- **Local** : `mongodb://localhost:27017/ecocollect`
- **Atlas** : Utilisez votre URI de connexion

### 3. Lancer le backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend sera disponible sur `http://localhost:8080`

**Si vous avez des erreurs de connexion MongoDB :**
- Vérifiez que MongoDB est démarré
- Vérifiez la variable d'environnement `MONGODB_URI`
- Ou modifiez `src/main/resources/application.yml`

## Démarrage du Frontend

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'URL de l'API
Créer un fichier `.env` à la racine du projet :
```bash
VITE_API_URL=http://localhost:8080
```

### 3. Lancer le frontend
```bash
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

## Vérification

1. **Backend** : Ouvrir `http://localhost:8080/api/dashboard/stats`
   - Devrait retourner des statistiques JSON

2. **Frontend** : Ouvrir `http://localhost:5173`
   - Devrait afficher le dashboard

## Problèmes Courants

### Backend ne démarre pas
- **Erreur MongoDB** : Vérifiez que MongoDB est démarré et accessible
- **Erreur de port** : Changez le port dans `application.yml` ou utilisez `PORT=8081 mvn spring-boot:run`
- **Erreur de compilation** : Exécutez `mvn clean install` pour nettoyer et recompiler

### Frontend ne se connecte pas au backend
- Vérifiez que le backend est démarré
- Vérifiez la variable `VITE_API_URL` dans `.env`
- Vérifiez les erreurs CORS dans la console du navigateur

### Erreurs CORS
- Le backend est configuré pour accepter les requêtes depuis `http://localhost:5173`
- Si vous utilisez un autre port, modifiez `application.yml` :
```yaml
spring:
  web:
    cors:
      allowed-origins: ${CORS_ORIGINS:http://localhost:5173,http://localhost:3000}
```

## Commandes Utiles

```bash
# Backend - Nettoyer et compiler
cd backend && mvn clean install

# Backend - Lancer avec logs
cd backend && mvn spring-boot:run

# Frontend - Installer dépendances
npm install

# Frontend - Lancer en développement
npm run dev

# Frontend - Build de production
npm run build
```

