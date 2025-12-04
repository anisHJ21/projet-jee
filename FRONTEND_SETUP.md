# Configuration du Frontend

## Problème Résolu

Le script `npm run dev` utilisait la syntaxe Unix (`NODE_ENV=development`) qui ne fonctionne pas sur Windows.

## Solution

✅ **Script `dev` modifié** : Maintenant utilise directement `vite` pour lancer le frontend React  
✅ **cross-env ajouté** : Pour la compatibilité multiplateforme des autres scripts

## Installation

1. **Installer les dépendances** (si `cross-env` n'est pas encore installé) :
```bash
npm install
```

## Lancement

### Frontend React (avec Spring Boot backend)

```bash
npm run dev
```

Cela lancera Vite qui servira le frontend React sur `http://localhost:5173`

### Backend Spring Boot (dans un autre terminal)

```bash
cd backend
mvn spring-boot:run
```

Le backend sera sur `http://localhost:8080`

## Configuration

Assurez-vous d'avoir un fichier `.env` à la racine avec :
```
VITE_API_URL=http://localhost:8080
```

## Scripts Disponibles

- `npm run dev` - Lance le frontend React avec Vite
- `npm run dev:old` - Lance l'ancien serveur Express (si nécessaire)
- `npm run build:frontend` - Build de production du frontend
- `npm run build` - Build de l'ancien système (si nécessaire)

