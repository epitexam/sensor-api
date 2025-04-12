'use strict'

const fp = require('fastify-plugin');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');

module.exports = fp(async function (fastify, opts) {

  // Swagger spec
  fastify.register(swagger, {
    swagger: {
      info: {
        title: 'API avec JWT',
        description: 'Documentation API sécurisée avec JWT',
        version: '1.0.0'
      },
      securityDefinitions: {
        BearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT Bearer token'
        }
      }
    }
  });

  // Swagger UI
  fastify.register(swaggerUI, {
    routePrefix: '/documentation', // Accessible via /documentation
    exposeRoute: true,             // Important pour l'exposition en prod
    staticCSP: true,               // Corrige les erreurs de chargement en prod
    transformStaticCSP: (header) => header,
    uiConfig: {
      deepLinking: true,           // Permet les liens directs vers des routes
    },
  });
});
