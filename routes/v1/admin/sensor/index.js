'use strict';

const { PrismaClient } = require('@prisma/client');
const { getSensorSchema, createSensorSchema, updateSensorSchema, deleteSensorSchema } = require('../../../../schemas/admin/sensor');

module.exports = async function (fastify, opts) {
    /** 
     * @type {PrismaClient} 
     */
    const prisma = fastify.prisma;

    fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getSensorSchema }, async function (request, reply) {
        const { id, friendly_name, room_id, take = 20, skip = 0 } = request.query;

        if (take > 100) {
            return reply.code(400).send({ message: 'The "take" parameter must be less than or equal to 100' });
        }

        const sensors = await prisma.sensor.findMany({
            where: {
                ...(id && { id }),
                ...(friendly_name && { friendly_name: { contains: friendly_name } }),
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