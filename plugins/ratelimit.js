const fp = require('fastify-plugin')

const rateLimit = require('@fastify/rate-limit')
module.exports = fp(async function (fastify, opts) {

    fastify.register(rateLimit, {
        max: process.env.RATE_LIMIT || 150, // Maximum de requêtes par minute
        timeWindow: '1 minute',
    })
})
