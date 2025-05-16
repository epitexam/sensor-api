'use strict'
const { PrismaClient } = require('@prisma/client');
const { addAdminSchema } = require('../../../schemas/admin');


module.exports = async function (fastify, opts) {

    /** 
   * @type {PrismaClient} 
   */
    const prisma = fastify.prisma;

    fastify.post('/add-admin', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: addAdminSchema }, async function (request, reply) {

        const { email } = request.body

        const userInfo = await fastify.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!userInfo) {
            return reply.code(404).send({ message: 'User not found' })
        }

        if (userInfo.role === 4) {
            return reply.code(400).send({ message: 'User is already an admin' })
        }

        await fastify.prisma.user.update({
            where: {
                email
            },
            data: {
                role: 4
            }
        })

        return reply.send({ message: 'User has been promoted to admin' })
    })
}
