'use strict'

const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2');

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    fastify.post('/login', async function (request, reply) {
        const { email, password } = request.body

        if (!password || password.length < 6) {
            return reply.status(400).send({ message: "Password must be at least 6 characters long." });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return reply.status(400).send({ message: "Email invalid." });
        }

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


    fastify.post('/register', async function (request, reply) {
        const { email, username, password, first_name, last_name } = request.body

        if (!password || password.length < 6) {
            return reply.status(400).send({ message: "Password must be at least 6 characters long." });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return reply.status(400).send({ message: "Email invalid." });
        }

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

        return reply.status(201).send({ message: "User registered successfully." });

    })
}
