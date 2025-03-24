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
        tags: ['sensor-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    };

    const createSensorSchema = {
        body: {
            type: 'object',
            required: ['friendly_name', 'unit_of_measurement'],
            properties: {
                friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
                unit_of_measurement: { type: 'string', minLength: 1, maxLength: 255, description: 'Unit of measurement for the sensor' },
                room_id: { type: 'number', minimum: 1, description: 'Unique identifier for the room' }
            },
            additionalProperties: false
        },
        description: 'Create a new sensor with a friendly name, unit of measurement, and optional room ID.',
        summary: 'Create sensor',
        tags: ['sensor-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    };

    const updateSensorSchema = {
        body: {
            type: 'object',
            required: ['friendly_name', 'unit_of_measurement', 'id'],
            properties: {
                id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' },
                friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
                unit_of_measurement: { type: 'string', minLength: 1, maxLength: 255, description: 'Unit of measurement for the sensor' }
            },
            additionalProperties: false
        },
        description: 'Update sensor information such as friendly name and unit of measurement.',
        summary: 'Update sensor details',
        tags: ['sensor-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    };

    const deleteSensorSchema = {
        body: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'number', minimum: 1, description: 'Unique identifier for the sensor' }
            }
        },
        description: 'Delete a sensor by its ID.',
        summary: 'Delete sensor',
        tags: ['sensor-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    };

    fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getSensorSchema }, async function (request, reply) {
        const { id, friendly_name, room_id, take = 20, skip = 0 } = request.query;

        if (take > 100) {
            return reply.code(400).send({ message: 'The "take" parameter must be less than or equal to 100' });
        }

        const sensors = await prisma.sensor.findMany({
            where: {
                ...(id && { id }),
                ...(friendly_name && { friendly_name }),
                ...(room_id && { roomId: room_id })
            },
            take: take ? parseInt(take) : undefined,
            skip: skip ? parseInt(skip) : undefined,
        });

        if (sensors.length === 0) {
            return reply.status(404).send({ error: 'No sensors found' });
        }

        return reply.send({ sensors });
    });

    fastify.post('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: createSensorSchema }, async function (request, reply) {
        const { friendly_name, unit_of_measurement, room_id } = request.body;

        const existingSensor = await prisma.sensor.findUnique({
            where: { friendly_name }
        });

        if (existingSensor) {
            return reply.status(409).send({ error: 'Sensor with this friendly name already exists' });
        }

        if (room_id) {
            const existingRoom = await prisma.room.findUnique({
                where: { id: room_id }
            });

            if (!existingRoom) {
                return reply.status(404).send({ error: 'Room not found' });
            }
        }

        const sensor = await prisma.sensor.create({
            data: {
                friendly_name,
                unit_of_measurement,
                roomId: room_id || null
            }
        });

        return reply.status(201).send({ sensor });
    });

    fastify.put('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: updateSensorSchema }, async function (request, reply) {
        const { id } = request.body;
        const { friendly_name, unit_of_measurement } = request.body;

        const existingSensor = await prisma.sensor.findUnique({
            where: { id: Number(id) }
        });

        if (!existingSensor) {
            return reply.status(404).send({ error: 'Sensor not found' });
        }

        const updatedSensor = await prisma.sensor.update({
            where: { id: Number(id) },
            data: {
                friendly_name,
                unit_of_measurement
            }
        });

        return reply.send({ updatedSensor });
    });

    fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteSensorSchema }, async function (request, reply) {
        const { id } = request.body;

        const existingSensor = await prisma.sensor.findUnique({
            where: { id: Number(id) }
        });

        if (!existingSensor) {
            return reply.status(404).send({ error: 'Sensor not found' });
        }

        await prisma.sensor.delete({
            where: { id: Number(id) }
        });

        return reply.send({ message: 'Sensor deleted successfully' });
    });
};