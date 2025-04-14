'use strict'

const { PrismaClient } = require('@prisma/client')
const { getRoomSchema } = require('../../../schemas/room')

module.exports = async function (fastify, opts) {

    /** 
     * 
     * @type {PrismaClient} 
     * */
    const prisma = fastify.prisma

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