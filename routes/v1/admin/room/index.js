'use strict'
const { PrismaClient } = require('@prisma/client')


module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

    const getRoomSchema = {
        querystring: {
            type: 'object',
            properties: {
                room_id: { type: 'number', minLength: 1, pattern: '^[a-fA-F0-9-]+$', description: 'Unique identifier for the room' },
                name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
                take: { type: 'number', minimum: 0, maximum: 100, description: 'Number of rooms to retrieve' },
                skip: { type: 'number', minimum: 0, description: 'Number of rooms to skip' }
            },
            additionalProperties: false
        }
    }

    const createRoomSchema = {
        body: {
            type: 'object',
            required: ['name', 'volume'],
            properties: {
                name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
                volume: { type: 'number', minimum: 0, maximum: 10000, description: 'Volume of the room' }
            },
            additionalProperties: false
        }
    }

    const updateRoomSchema = {
        body: {
            type: 'object',
            required: ['room_id', 'name', 'volume'],
            properties: {
                room_id: { type: 'number', minLength: 1, pattern: '^[a-fA-F0-9-]+$', description: 'Unique identifier for the room' },
                name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
                volume: { type: 'number', minimum: 0, maximum: 10000, description: 'Volume of the room' }
            },
            additionalProperties: false
        }
    }

    const deleteRoomSchema = {
        body: {
            type: 'object',
            required: ['room_id'],
            properties: {
                room_id: { type: 'number', minLength: 1, pattern: '^[a-fA-F0-9-]+$', description: 'Unique identifier for the room' }
            },
            additionalProperties: false
        }
    }

    const selectedRoomInfo = {
        id: true,
        name: true,
        volume: true,
        sensors: {
            select: {
                id: true,
                friendly_name: true,
                unit_of_measurement: true,
            }
        }
    }

    fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getRoomSchema }, async function (request, reply) {
        const { room_id, name, take = 30, skip = 0 } = request.query

        if (take > 100) {
            return reply.code(400).send({ message: 'Take parameter too large' })
        }

        if (room_id) {
            const room = await prisma.room.findUnique({
                where: {
                    id: room_id
                },
                select: selectedRoomInfo
            })

            if (!room) {
                return reply.code(404).send({
                    message: 'Room not found'
                })
            }

            return reply.send(room)
        }

        if (name) {
            const room = await prisma.room.findUnique({
                where: {
                    name
                },
                select: selectedRoomInfo
            })

            if (!room) {
                return reply.code(404).send({
                    message: 'Room not found'
                })
            }

            return reply.send(room)
        }

        const rooms = await prisma.room.findMany({
            take,
            skip,
            select: selectedRoomInfo
        })

        return reply.send(rooms)
    })

    fastify.post('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: createRoomSchema }, async function (request, reply) {
        const { name, volume } = request.body

        const roomInfo = await prisma.room.findUnique({ where: { name } })

        if (roomInfo) {
            return reply.code(409).send({
                message: 'Room already exists'
            })
        }

        const room = await prisma.room.create({
            data: {
                name,
                volume,
            },
        })

        return reply.code(201).send({})
    })

    fastify.put('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: updateRoomSchema }, async function (request, reply) {
        const { room_id, name, volume } = request.body

        const roomInfo = await prisma.room.findUnique({
            where: {
                id: room_id
            }
        })

        if (!roomInfo) {
            return reply.code(404).send({
                message: 'Room not found'
            })
        }

        const room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                name,
                volume,
            }
        })

        return reply.status(204).send({})
    })

    fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteRoomSchema }, async function (request, reply) {
        const { room_id } = request.body

        const roomInfo = await prisma.room.findUnique({
            where: {
                id: room_id
            }
        })

        if (!roomInfo) {
            return reply.code(404).send({
                message: 'Room not found'
            })
        }

        const deletedRoom = await prisma.room.delete({
            where: {
                id: room_id
            }
        })

        return reply.status(204).send({})
    })
}