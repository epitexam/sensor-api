'use strict'

const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2');

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    const loginSchema = {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: "email", minLength: 1, maxLength: 255, description: 'The email address of the user' },
                password: { type: 'string', minLength: 6, maxLength: 128, description: 'The password of the user' }
            },
            additionalProperties: false,
        },
        description: 'Schema for user login, requiring email and password fields. The email must be a valid email address and the password must be at least 6 characters long.',
        summary: 'Authenticate user and return a token',
        tags: ['auth']
    }

    const registerSchema = {
        body: {
            type: 'object',
            required: ['email', 'password', 'username', 'first_name', 'last_name'],
            properties: {
                email: { type: 'string', format: "email", minLength: 1, maxLength: 255, description: 'The email address of the user' },
                password: { type: 'string', minLength: 6, maxLength: 128, description: 'The password of the user' },
                username: { type: 'string', minLength: 1, maxLength: 50, description: 'The username of the user' },
                first_name: { type: 'string', minLength: 1, maxLength: 50, description: 'The first name of the user' },
                last_name: { type: 'string', minLength: 1, maxLength: 50, description: 'The last name of the user' },
            },
            additionalProperties: false,
        },
        description: 'Schema for user registration, requiring email, password, username, first name, and last name fields. The email must be a valid email address, the password must be at least 6 characters long, and the username, first name, and last name must be between 1 and 50 characters long.',
        summary: 'Register a new user',
        tags: ['auth']
    }

    fastify.post('/login', { schema: loginSchema }, async function (request, reply) {
        const { email, password } = request.body

        const userInfo = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password: true
            }
        })

        if (!userInfo) {
            return reply.status(404).send({ message: "No user linked to this email." })
        }

        const passwordMatching = await argon2.verify(userInfo.password, password)

        if (!passwordMatching) {
            return reply.status(400).send({ message: "Invalid credentials." })
        }

        const token = fastify.jwt.sign({ id: userInfo.id })

        return reply.send({ token })
    })

    fastify.post('/register', { schema: registerSchema }, async function (request, reply) {
        const { email, username, password, first_name, last_name } = request.body

        const emailAlreadyUsed = await prisma.user.findUnique({ where: { email }, select: { id: true } })

        if (emailAlreadyUsed) {
            return reply.status(400).send({ message: "This email is already used." })
        }

        const hashedPassword = await argon2.hash(password)

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                first_name,
                last_name
            },

        })

        return reply.status(201).send({ message: "User registered successfully. You can now login." });

    })
}
