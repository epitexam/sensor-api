const fp = require('fastify-plugin')
const { PrismaClient } = require('@prisma/client')

module.exports = fp(async function (fastify, opts) {

  const prisma = new PrismaClient()

  await prisma.$connect()

  // Make Prisma Client available through the fastify server instance: server.prisma
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (fastify) => {
    await fastify.prisma.$disconnect()
  })
})
