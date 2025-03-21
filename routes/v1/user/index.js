'use strict'
const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2');

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    const getUserSchema = {
        body: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                take: { type: 'integer', default: 20 },
                skip: { type: 'integer', default: 0 }
            },
            required: []
        }
    }

    const updateUserSchema = {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                password: { type: 'string', minLength: 8 }
            },
            required: []
        }
    }

    const deleteUserSchema = {
        body: {
            type: 'object',
            properties: {
                // No properties required for delete
            },
            required: []
        }
    }

    const selectedUserInfo = {
        id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
    }

    fastify.get('/', { schema: getUserSchema }, async function (request, reply) {
        const { id, username, take = 20, skip = 0 } = request.body

        if (id) {

            const userInfo = await prisma.user.findUnique({
                where: {
                    id
                },
                select: selectedUserInfo
            })

            if (!userInfo) {
                return reply.status(404).send({ message: "No user founded." });
            }

            return reply.status(200).send(userInfo);
        }

        const usersInfo = await prisma.user.findMany({
            where: {
                username: {
                    contains: username
                }
            },
            take,
            skip,
            select: selectedUserInfo
        })

        return reply.status(200).send(usersInfo);
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
                username: username || userInfo.username,
                email: email || userInfo.email,
                first_name: first_name || userInfo.first_name,
                last_name: last_name || userInfo.last_name,
                password: password ? await argon2.hash(password) : userInfo.password
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
