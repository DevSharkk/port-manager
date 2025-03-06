const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Port Manager',
      version: '1.0.0',
      description: 'API simple pour la gestion du port de plaisance'
    },
    tags: [
      { name: 'Catways', description: 'Gestion des emplacements du port' },
      { name: 'Réservations', description: 'Gestion des réservations des catways' }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs; 