# Guide de Lancement du Projet

## ✅ Corrections Effectuées

1. **package.json** - Script `dev` modifié pour utiliser Vite directement
2. **cross-env** - Installé pour la compatibilité Windows
3. **Syntaxe Unix** - Remplacée par des commandes compatibles Windows

## 🚀 Lancement du Projet

### Étape 1 : Lancer le Backend Spring Boot

Ouvrez un **premier terminal** :

```bash
cd backend
mvn spring-boot:run
```

**Important** : Assurez-vous que MongoDB est démarré avant de lancer le backend.

Le backend sera disponible sur : `http://localhost:8080`

### Étape 2 : Lancer le Frontend React

Ouvrez un **deuxième terminal** (laissez le premier ouvert) :

```bash
npm run dev
```

Le frontend sera disponible sur : `http://localhost:5173`

## ⚙️ Configuration

### Fichier .env (à créer à la racine)

Créez un fichier `.env` avec :
```
VITE_API_URL=http://localhost:8080
```

## ✅ Vérification

1. **Backend** : Ouvrez `http://localhost:8080/api/dashboard/stats`
   - Devrait retourner du JSON avec les statistiques

2. **Frontend** : Ouvrez `http://localhost:5173`
   - Devrait afficher l'interface du dashboard

## 🔧 Dépannage

### Erreur "MongoDB connection failed"
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `backend/src/main/resources/application.yml`

### Erreur CORS dans le navigateur
- Vérifiez que le backend est bien lancé
- Vérifiez que `VITE_API_URL` dans `.env` pointe vers `http://localhost:8080`

### Le frontend ne se connecte pas au backend
- Vérifiez que les deux services sont lancés
- Vérifiez la console du navigateur (F12) pour les erreurs
- Vérifiez que le fichier `.env` existe et contient `VITE_API_URL=http://localhost:8080`

## 📝 Commandes Utiles

```bash
# Backend
cd backend
mvn clean install          # Nettoyer et compiler
mvn spring-boot:run        # Lancer le backend

# Frontend
npm install                # Installer les dépendances
npm run dev                # Lancer en développement
npm run build:frontend     # Build de production
```

## 🎯 Résultat Attendu

Une fois les deux services lancés :
- ✅ Backend Spring Boot sur le port 8080
- ✅ Frontend React sur le port 5173
- ✅ Communication entre frontend et backend fonctionnelle
- ✅ Dashboard affichant les statistiques

