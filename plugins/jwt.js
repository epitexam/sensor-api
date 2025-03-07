'use strict'

const fp = require('fastify-plugin')
const jwt = require('@fastify/jwt')


/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {

    const secret = process.env.SECRET || "foobar"

    fastify.register(jwt, {
        secret: 'foobar',
        cookie: {
            cookieName: 'token',
            signed: false
        }
    })

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
})
