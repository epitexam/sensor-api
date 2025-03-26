'use strict'
const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2');

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

    const getUserSchema = {
        description: 'Get user information by ID or username. Supports pagination with take and skip parameters.',
        tags: ['user-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
        summary: 'Retrieve user information',
        querystring: {
            type: 'object',
            properties: {
                user_id: { type: 'integer', minimum: 1, default: 1, description: 'User id' },
                username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
                take: { type: 'integer', minimum: 1, maximum: 100, default: 20, description: 'Number of users to retrieve' },
                skip: { type: 'integer', minimum: 0, default: 0, description: 'Number of users to skip' }
            },
            required: [],
            additionalProperties: false
        }
    }

    const updateUserSchema = {
        description: 'Update user information such as username, email, first name, last name, and password.',
        tags: ['user-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
        summary: 'Update user details',
        body: {
            type: 'object',
            properties: {
                user_id: { type: 'number', minimum: 1, description: 'User ID' },
                username: { type: 'string', minLength: 3, maxLength: 30, description: 'Username' },
                email: { type: 'string', format: 'email', description: 'Email address' },
                first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'First name' },
                last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'Last name' },
                password: { type: 'string', minLength: 8, maxLength: 100, description: 'Password' }
            },
            required: ['user_id'],
            additionalProperties: false
        }
    }

    const deleteUserSchema = {
        description: 'Delete a user by ID.',
        tags: ['user-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
        summary: 'Delete user',
        body: {
            type: 'object',
            properties: {
                user_id: { type: 'number', minimum: 1, description: 'User ID' },
            },
            required: ['user_id'],
            additionalProperties: false
        }
    }

    fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getUserSchema }, async function (request, reply) {
        const { user_id, username, take = 20, skip = 0 } = request.query

        if (user_id) {
            const userInfo = await prisma.user.findUnique({
                where: {
                    username
                },
                select: selectedUserInfo
            });

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
        });

        return reply.status(200).send({ usersInfo });
    })

    fastify.put('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: updateUserSchema }, async function (request, reply) {
        const { user_id, username, email, first_name, last_name, password } = request.body

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            select: selectedUserInfo
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user founded." });
        }

        if (email && email !== userInfo.email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (emailExists) {
                return reply.status(400).send({ message: "Email already used." });
            }
        }

        await prisma.user.update({
            where: {
                id: user_id
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

    fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteUserSchema }, async function (request, reply) {
        const { user_id } = request.body

        const userInfo = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            select: selectedUserInfo
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user founded." });
        }

        const deletedUser = await prisma.user.delete({
            where: {
                id: user_id
            },
            select: selectedUserInfo
        })

        return reply.status(204).send({ message: "User deleted" });

    })
}
