'use strict'

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
        tags: ['history-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    }

    const createSensorHistorySchema = {
        body: {
            type: 'object',
            required: ['sensor_id', 'state'],
            properties: {
                sensor_id: { type: 'number', description: 'Unique identifier for the sensor' },
                state: { type: 'number', description: 'State of the sensor' },
                recorded_at: { type: 'string', format: 'date-time', description: 'Timestamp when the state was recorded' }
            },
            additionalProperties: false
        },
        description: 'Create a new sensor history record with sensor ID, state, and recorded timestamp.',
        summary: 'Create sensor history',
        tags: ['history-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    }

    const deleteSensorHistorySchema = {
        body: {
            type: 'object',
            required: ['history_ids'],
            properties: {
                history_ids: {
                    type: 'array',
                    items: { type: 'number', description: 'Unique identifier for the sensor history' },
                    description: 'Array of sensor history IDs to delete'
                }
            },
            additionalProperties: false
        },
        description: 'Delete sensor history records by their IDs.',
        summary: 'Delete sensor history',
        tags: ['history-admin'],
        security: [
            {
                BearerAuth: []
            }
        ],
    }

    fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getSensorHistorySchema }, async function (request, reply) {
        const { sensor_id, start_date, end_date, take, skip } = request.query
        const sensorHistories = await fastify.prisma.sensorHistory.findMany({
            where: {
                sensor_id,
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


    fastify.post('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: createSensorHistorySchema }, async function (request, reply) {

        const { sensor_id, state, recorded_at } = request.body

        const sensorInfo = await fastify.prisma.sensor.findUnique({
            where: {
                id: sensor_id
            }
        })

        if (!sensorInfo) {
            return reply.code(404).send({
                message: 'Sensor not found'
            })
        }

        const sensorHistory = await fastify.prisma.sensorHistory.create({
            data: {
                sensor_id,
                state,
                recorded_at: new Date(recorded_at)
            }
        })

        return reply.send({ sensorHistory })
    })

    fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteSensorHistorySchema }, async function (request, reply) {
        const { history_ids } = request.body
        const sensorHistories = await fastify.prisma.sensorHistory.deleteMany({
            where: {
                id: {
                    in: history_ids
                }
            }
        })

        return reply.send({ sensorHistories })
    })
}