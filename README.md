# Sensor API

Sensor API est une application backend construite avec **Fastify** et **Prisma** pour gérer des capteurs, des salles et des utilisateurs.

## Fonctionnalités principales

- **Gestion des utilisateurs** : Inscription, connexion, et gestion des rôles.
- **Gestion des capteurs** : Création, mise à jour, suppression, et historique des capteurs.
- **Gestion des salles** : Création, mise à jour, suppression, et association avec des capteurs.
- **Authentification sécurisée** : Basée sur **JWT** avec contrôle des rôles.
- **Documentation interactive** : Générée automatiquement avec **Swagger**.
- **Limitation de débit** : Protection contre les abus avec **Rate Limit**.

## Configuration de l'environnement

Copiez le fichier `.env.test` et renommez-le en `.env` avec les variables réelles. Assurez-vous de fournir des variables d'environnement valides.

## Commandes initiales

Avant de commencer le développement, exécutez les commandes suivantes :

### `yarn install`

Pour installer les dépendances.

### `yarn prisma db push`

Pour appliquer le schéma Prisma à la base de données.

### `yarn prisma seed`

Pour peupler la base de données avec des données factices (voir `prisma/seed.js` pour les détails).

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `yarn run dev`

Démarrez l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour la visualiser dans le navigateur.

### `yarn start`

Démarrez l'application en mode production.

### `yarn run test`

Exécutez les tests avec le framework de test intégré de Node.js.

### `yarn prisma studio`

Lancez Prisma Studio pour inspecter et gérer visuellement votre base de données.

## Plugins utilisés

### Prisma
- **Description** : ORM pour la gestion de la base de données.
- **Fonctionnalités** : Simplifie les requêtes, prend en charge les migrations, et offre une interface visuelle via Prisma Studio.

### JWT
- **Description** : Gestion de l'authentification avec JSON Web Tokens.
- **Fonctionnalités** : Authentification sans état, expiration des tokens, et contrôle d'accès basé sur les rôles.

### Swagger
- **Description** : Génère une documentation interactive pour l'API.
- **Accès** : Visitez `/documentation` dans votre navigateur pour explorer l'API.

### Rate Limit
- **Description** : Limite le nombre de requêtes par minute pour prévenir les abus.
- **Par défaut** : 150 requêtes par minute (configurable via la variable d'environnement `RATE_LIMIT`).

## Tests

### Exécution des tests
Exécutez la commande suivante pour lancer tous les tests :
```bash
yarn run test
```

### Fichiers de test
Les fichiers de test se trouvent dans le répertoire `test` et suivent la structure de l'application.

## Déploiement

### PM2
Le projet inclut un fichier de configuration PM2 (`deployment/pm2.config.js`) pour gérer l'application en production.

### Docker
Un fichier `docker-compose.yml` est fourni pour configurer une base de données PostgreSQL pour l'application.

## Acknowledgments

- Part of the code and documentation for this project was generated with the assistance of **GitHub Copilot**, an AI programming assistant.

## En savoir plus

Pour en savoir plus sur Fastify, consultez la [documentation officielle de Fastify](https://fastify.dev/docs/latest/).  
Pour en savoir plus sur Prisma, visitez la [documentation officielle de Prisma](https://www.prisma.io/docs/).

---