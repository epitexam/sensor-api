'use strict'

const fp = require("fastify-plugin");

const swagger = require("@fastify/swagger");
const swagger_ui = require("@fastify/swagger-ui")

module.exports = fp(async function (fastify, opts) {


    fastify.register(swagger);
    
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
    })
})