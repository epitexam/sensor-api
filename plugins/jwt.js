'use strict'

const fp = require('fastify-plugin')
const jwt = require('@fastify/jwt')

const USER_ROLE = {
    USER: 1,
    PROFESSOR: 2,
    ADMIN: 3
}


/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {

    const secret = process.env.SECRET || "foobar"
    const expiresIn = process.env.EXPIRESIN || "60m"

    fastify.register(jwt, {
        secret,
        sign: {
            algorithm: "HS256",
            expiresIn
        }
    })

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })

    fastify.decorate("isAdmin", async function (request, reply) {
        try {
            const { user } = request

            const userInfo = await fastify.prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    role: true
                }
            })

            if (!userInfo) {
                return reply.status(401).send({ message: "This user does not exist." })
            }

            if (userInfo.role < USER_ROLE.ADMIN) {
                return reply.status(401).send({ message: "You are not allowed to perform this action." })
            }

        } catch (err) {
            reply.send(err)
        }
    })

    fastify.decorate("isProfessor", async function (request, reply) {
        try {
            const { user } = request

            const userInfo = await fastify.prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    role: true
                }
            })

            if (!userInfo) {
                return reply.status(401).send({ message: "This user does not exist." })
            }

            if (userInfo.role < USER_ROLE.PROFESSOR) {
                return reply.status(401).send({ message: "You are not allowed to perform this action." })
            }

        } catch (err) {
            reply.send(err)
        }
    })
})
