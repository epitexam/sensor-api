'use strict'
const { PrismaClient } = require('@prisma/client')

module.exports = async function (fastify, opts) {

    /** 
     * @type {PrismaClient} 
     */
    const prisma = fastify.prisma;

    const getSensorHistorySchema = {
        querystring: {
            type: 'object',
            properties: {
                friendly_name: { type: 'string', minLength: 1, maxLength: 255, description: 'Friendly name of the sensor' },
                sensor_id: { type: 'number', description: 'Unique identifier for the sensor' },
                start_date: { type: 'string', format: 'date-time', description: 'Start date for the history range' },
                end_date: { type: 'string', format: 'date-time', description: 'End date for the history range' },
                take: { type: 'number', minimum: 0, maximum: 100, description: 'Number of records to retrieve' },
                skip: { type: 'number', minimum: 0, description: 'Number of records to skip' }
            },
            additionalProperties: false
        },
        description: 'Retrieve sensor history within a specified date range. Supports pagination with take and skip parameters.',
        summary: 'Get sensor history',
        tags: ['history'],
    }

    fastify.get('/', { onRequest: [], schema: getSensorHistorySchema }, async function (request, reply) {
        const { friendly_name, sensor_id, start_date, end_date, take, skip } = request.query

        const sensorInfo = await prisma.sensor.findUnique({
            where: {
                ...(friendly_name && { friendly_name }),
                ...(sensor_id && { id: sensor_id })
            }
        })

        if (!sensorInfo) {
            return reply.code(404).send({ message: 'Sensor not found' })
        }

        if (sensor_id && sensorInfo.id !== sensor_id) {
            return reply.code(400).send({ message: 'Sensor ID does not match the friendly name provided' })
        }
        
        const validStartDate = start_date ? new Date(start_date) : null;
        const validEndDate = end_date ? new Date(end_date) : null;

        if ((start_date && isNaN(validStartDate)) || (end_date && isNaN(validEndDate))) {
            return reply.code(400).send({ message: 'Invalid date format for start_date or end_date' });
        }

        const sensorHistories = await prisma.sensorHistory.findMany({
            where: {
                ...(sensor_id && { sensor: { id: sensor_id } }),
                ...(friendly_name && { sensor: { friendly_name } }),
                ...(validStartDate || validEndDate ? {
                    recorded_at: {
                        ...(validStartDate && { gte: validStartDate }),
                        ...(validEndDate && { lte: validEndDate })
                    }
                } : {})
            },
            take,
            skip
        })
        return reply.send({ sensorHistories })
    })
}
