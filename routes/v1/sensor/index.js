'use strict';

const { PrismaClient } = require('@prisma/client');

module.exports = async function (fastify, opts) {
    /** 
     * @type {PrismaClient} 
     */
    const prisma = fastify.prisma;

    const getSensorSchema = {
        querystring: {
            type: 'object',
            properties: {
                id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' },
                friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
                room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' },
                take: { type: 'number', minimum: 0, maximum: 100, default: 20, description: 'Number of sensors to retrieve' },
                skip: { type: 'number', minimum: 0, default: 0, description: 'Number of sensors to skip' }
            },
            additionalProperties: false
        },
        description: 'Retrieve sensor information by ID, friendly name, or room ID. Supports pagination with take and skip parameters.',
        summary: 'Get sensor information',
        tags: ['sensor'],
        security: [
            {
                BearerAuth: []
            }
        ],
    };

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
                friendly_name: friendly_name ? {
                    contains: friendly_name,
                } : undefined,
                roomId: room_id ? room_id : undefined
            },
        })

        if (sensors.length === 0) {
            return reply.status(404).send({ error: 'No sensors found' });
        }

        return reply.send({ sensors, take });
    });
};