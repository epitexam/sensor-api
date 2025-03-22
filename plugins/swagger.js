'use strict'

const fp = require("fastify-plugin");

const swagger = require("@fastify/swagger");
const swagger_ui = require("@fastify/swagger-ui");

module.exports = fp(async function (fastify, opts) {

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
                    in: 'header',
                    name: 'Authorization',
                    description: 'JWT Bearer token'
                }
            },
        }
    });

    fastify.register(swagger_ui, {
        routePrefix: '/documentation',
        uiConfig: {
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    });
});
