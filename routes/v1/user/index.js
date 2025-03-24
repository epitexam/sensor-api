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
        querystring: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 1, maxLength: 50, description: 'Username' },
                take: { type: 'number', default: 20 },
                skip: { type: 'number', default: 0 }
            },
            required: []
        },
        description: 'Get user information by ID or username. Supports pagination with take and skip parameters.',
        summary: 'Retrieve user information',
        tags: ['user']
    }

    const meUserSchema = {
        querystring: {
            type: 'object',
            properties: {},
            required: []
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        description: 'Retrieve the authenticated user\'s information.',
        summary: 'Get authenticated user information',
        tags: ['user']
    }

    const updateUserSchema = {
        description: 'Update user information such as username, email, first name, last name, and password.',
        tags: ['user'],
        security: [
            {
                BearerAuth: []
            }
        ],
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
        description: 'Delete a user by ID.',
        tags: ['user'],
        security: [
            {
                BearerAuth: []
            }
        ],
        summary: 'Delete user',
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
        const { username, take = 20, skip = 0 } = request.query

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
