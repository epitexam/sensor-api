# Plugins Folder

Plugins define behavior that is common to all the routes in your
application. Authentication, caching, templates, and all the other cross
cutting concerns should be handled by plugins placed in this folder.

Files in this folder are typically defined through the
[`fastify-plugin`](https://github.com/fastify/fastify-plugin) module,
making them non-encapsulated. They can define decorators and set hooks
that will then be used in the rest of your application.

Check out:

* [The hitchhiker's guide to plugins](https://fastify.dev/docs/latest/Guides/Plugins-Guide/)
* [Fastify decorators](https://fastify.dev/docs/latest/Reference/Decorators/).
* [Fastify lifecycle](https://fastify.dev/docs/latest/Reference/Lifecycle/).

# 📌 Fastify API – Documentation des Plugins

Ce projet utilise **Fastify** comme framework principal et s'appuie sur plusieurs plugins pour la gestion des données, l'authentification et la documentation. Voici une présentation détaillée des principaux outils utilisés :

## 🔹 Prisma – ORM pour la gestion de la base de données

### 📌 C'est quoi Prisma ?
Prisma est un ORM (Object-Relational Mapping) moderne qui permet d'interagir avec une base de données de manière simple et efficace. Il remplace les requêtes SQL brutes par une API en JavaScript/TypeScript plus intuitive.

### 🎯 Pourquoi utiliser Prisma ?
- **Simplicité** : Écriture de requêtes en JavaScript au lieu de SQL brut.
- **Sécurité** : Réduction des erreurs et protection contre certaines failles SQL.
- **Performance** : Génération de requêtes optimisées.
- **Compatibilité** : Fonctionne avec PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, etc.
- **Migrations** : Gestion des modifications de la structure de la base de données.

### 🔍 Principaux aspects :
- **Prisma Client** : Permet d’interagir avec la base de données.
- **Prisma Migrate** : Gère les migrations de la base de données.
- **Prisma Studio** : Interface visuelle pour voir et modifier les données.

---

## 🔹 JWT – JSON Web Token pour l'authentification

### 📌 C'est quoi JWT ?
JWT (JSON Web Token) est une méthode d’authentification qui permet de sécuriser les API en attribuant des **tokens** (jetons) aux utilisateurs connectés. Ces tokens contiennent des informations encodées, comme l'ID d’un utilisateur, et peuvent être vérifiés sans stocker de session côté serveur.

### 🎯 Pourquoi utiliser JWT ?
- **Sans état (stateless)** : Pas besoin de stocker des sessions en base de données.
- **Sécurité** : Permet d’assurer que seules les personnes authentifiées peuvent accéder à certaines routes.
- **Facilité d'utilisation** : Chaque requête peut contenir le token pour s’authentifier.

### 🔍 Principaux aspects :
- **Encodage** : Un JWT contient trois parties : **Header**, **Payload**, et **Signature**.
- **Vérification** : Un JWT peut être validé avec une clé secrète pour éviter les fraudes.
- **Expiration** : Il peut être configuré pour expirer après un certain temps pour plus de sécurité.

---

## 🔹 Swagger – Documentation interactive de l'API

### 📌 C'est quoi Swagger ?
Swagger (via **Fastify Swagger**) permet de générer automatiquement une documentation interactive pour l'API. Cela permet aux développeurs et aux utilisateurs de tester facilement les routes disponibles.

### 🎯 Pourquoi utiliser Swagger ?
- **Documentation automatique** : Génère une interface propre à partir des définitions de routes.
- **Exploration facile** : Permet de tester les endpoints directement depuis le navigateur.
- **Lisibilité** : Fournit une description claire des requêtes et des réponses attendues.
- **Standardisation** : Suit la norme **OpenAPI**, facilitant l’intégration avec d’autres services.

### 🔍 Principaux aspects :
- **Interface interactive** : Une page web où l’on peut tester l’API sans utiliser Postman ou d’autres outils.
- **Description des routes** : Chaque route est documentée avec ses paramètres et ses réponses attendues.
- **Support OpenAPI** : Compatible avec d’autres outils d’API.

---

## 📌 Conclusion  
Ces trois plugins (**Prisma**, **JWT**, et **Swagger**) sont essentiels pour assurer une API **performante**, **sécurisée** et **bien documentée**. Chacun joue un rôle clé :  
- **Prisma** facilite la gestion de la base de données.  
- **JWT** garantit une authentification sécurisée.  
- **Swagger** permet d’explorer et de tester l’API facilement.  

Avec ces outils, votre API Fastify est bien équipée pour être maintenable et évolutive ! 🚀