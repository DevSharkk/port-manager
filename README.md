# Port Manager API

API de gestion pour le port de plaisance de Russell, développée dans le cadre d'un projet de formation.

## Fonctionnalités

- Gestion des catways (emplacements)
- Gestion des réservations
- Gestion des utilisateurs
- Interface d'administration
- Documentation API intégrée

## Technologies utilisées

- Node.js
- Express
- MongoDB
- EJS (templates)
- Bootstrap (interface)

## Installation

1. Clonez le repository
2. Installez les dépendances : `npm i`
3. Créez un fichier `.env` avec vos variables d'environnement
4. Lancez le serveur : `npm start`

## Routes principales

### Catways
- GET /api/catways
- POST /api/catways
- PUT /api/catways/:id
- DELETE /api/catways/:id

### Réservations
- GET /api/catways/:id/reservations
- POST /api/catways/:id/reservations
- PUT /api/catways/:id/reservations/:idReservation
- DELETE /api/catways/:id/reservations/:idReservation

### Documentation
- Interface Swagger : /api-docs

## Auteur

Levacher Maxime

## Licence

Ce projet a été réalisé dans le cadre d'une formation.
