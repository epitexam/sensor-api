'use strict';

const { PrismaClient } = require('@prisma/client');
const { getSensorSchema } = require('../../../schemas/sensor');

module.exports = async function (fastify, opts) {
    /** 
     * @type {PrismaClient} 
     */
    const prisma = fastify.prisma;

    const selectedSensorInfo = {
        id: true,
        friendly_name: true,
        unit_of_measurement: true,
        history: {
            select: {
                state: true,
                recorded_at: true
            }
        }
    };

    fastify.get('/', { onRequest: [fastify.authenticate], schema: getSensorSchema }, async function (request, reply) {
        const { id, friendly_name, room_id, take = 20, skip = 0 } = request.query;

        if (take > 100) {
            return reply.code(400).send({ message: 'The "take" parameter must be less than or equal to 100' });
        }

        const sensors = await prisma.sensor.findMany({
            take,
            skip,
            where: {
                id: id ? id : undefined,
                ...(friendly_name && { friendly_name: { contains: friendly_name } }),
                roomId: room_id ? room_id : undefined
            },
            select: selectedSensorInfo
        });

        if (sensors.length === 0) {
            return reply.status(404).send({ error: 'No sensors found' });
        }

        return reply.send({ sensors, take });
    });
};