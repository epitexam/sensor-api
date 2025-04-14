'use strict'
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const { getUserSchema, meUserSchema, updateUserSchema, deleteUserSchema } = require('../../../schemas/user');

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    const selectedUserInfo = {
        id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
    }

    fastify.get('/', { schema: getUserSchema }, async function (request, reply) {
        const { username, take = 20, skip = 0 } = request.query

        const usersInfo = await prisma.user.findMany({
            where: {
                ...(username && { username: { contains: username } }),

            },
            take,
            skip,
            select: selectedUserInfo
        })

        return reply.status(200).send(usersInfo);
    })

    fastify.get('/me', { onRequest: [fastify.authenticate], schema: meUserSchema }, async function (request, reply) {
        const { user } = request

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: selectedUserInfo
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user founded." });
        }

        return reply.status(200).send({ userInfo });
    })

    fastify.put('/', { onRequest: [fastify.authenticate], schema: updateUserSchema }, async function (request, reply) {
        const { user } = request

        const { username, email, first_name, last_name, password } = request.body

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: selectedUserInfo
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user founded." });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username,
                email,
                first_name,
                last_name,
                password: await argon2.hash(password)
            },
            select: selectedUserInfo
        })

        return reply.status(204).send({ message: "User updated" });
    })

    fastify.delete('/', { onRequest: [fastify.authenticate], schema: deleteUserSchema }, async function (request, reply) {
        const { user } = request

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: selectedUserInfo
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user founded." });
        }

        const deletedUser = await prisma.user.delete({
            where: {
                id: user.id
            },
            select: selectedUserInfo
        })

        return reply.status(204).send({ message: "User deleted" });

    })
}
