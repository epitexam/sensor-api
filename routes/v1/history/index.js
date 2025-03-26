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
        security: [
            {
                BearerAuth: []
            }
        ],
    }

    fastify.get('/', { onRequest: [fastify.authenticate], schema: getSensorHistorySchema }, async function (request, reply) {
        const { sensor_id, start_date, end_date, take, skip } = request.query
        const sensorHistories = await prisma.sensorHistory.findMany({
            where: {
                sensor:{
                    id:sensor_id
                }
                recorded_at: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                }
            },
            take,
            skip
        })
        return reply.send({ sensorHistories })
    })
}
