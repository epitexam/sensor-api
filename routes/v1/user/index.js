'use strict'
const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2');
const user = require('../admin/user');

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    const getUserSchema = {
        querystring: {
            type: 'object',
            properties: {
                user_id: { type: 'number', minimum: 1, description: 'User ID' },
                username: { type: 'string', minLength: 1, maxLength: 50, description: 'Username' },
                take: { type: 'number', default: 20 },
                skip: { type: 'number', default: 0 }
            },
            required: []
        }
    }

    const updateUserSchema = {
        description: 'Update user information',
        tags: ['User'],
        summary: 'Update user details',
        body: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
                email: { type: 'string', format: 'email', description: 'Email address' },
                first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'First name' },
                last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Last name' },
                password: { type: 'string', minLength: 8, maxLength: 100, description: 'Password' }
            },
            required: [],
            additionalProperties: false
        }
    }

    const deleteUserSchema = {
        body: {
            type: 'object',
            properties: {
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
        const { user_id, username, take = 20, skip = 0 } = request.query

        if (user_id) {

            const userInfo = await prisma.user.findUnique({
                where: {
                    id: user_id
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

    fastify.get('/me', { onRequest: [fastify.authenticate], schema: getUserSchema}, async function (request, reply) {
        const { user } = request

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: selectedUserInfo
        })

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
