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
                room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
                name: { type: 'string', minLength: 1, maxLength: 255, description: 'Name of the room' },
                take: { type: 'integer', minimum: 0, maximum: 100, description: 'Number of rooms to retrieve' },
                skip: { type: 'integer', minimum: 0, description: 'Number of rooms to skip' }
            },
            additionalProperties: false
        },
        tags: ['room'],
        summary: 'Retrieve room information',
        description: 'Fetches room details based on room_id or name. Supports pagination with take and skip parameters.'
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

    fastify.get('/', { schema: getRoomSchema }, async function (request, reply) {
        const { room_id, name, take = 30, skip = 0 } = request.query

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
}