'use strict';

const { PrismaClient } = require('@prisma/client');
const { getSensorHistorySchema, createSensorHistorySchema, deleteSensorHistorySchema } = require('../../../../schemas/admin/history');

module.exports = async function (fastify, opts) {
  /** 
   * @type {PrismaClient} 
   */
  const prisma = fastify.prisma;

  fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getSensorHistorySchema }, async function (request, reply) {

    const { friendly_name, sensor_id, start_date, end_date, take, skip } = request.query;

    const sensorInfo = await prisma.sensor.findUnique({
      where: {
        ...(friendly_name && { friendly_name }),
        ...(sensor_id && { id: sensor_id })
      }
    });

    if (!sensorInfo) {
      return reply.code(404).send({ message: 'Sensor not found' });
    }

    if (sensor_id && sensorInfo.id !== sensor_id) {
      return reply.code(400).send({ message: 'Sensor ID does not match the friendly name provided' });
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
    });

    return reply.send({ sensorHistories });
  });

  fastify.post('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: createSensorHistorySchema }, async function (request, reply) {

    const { friendly_name, state, recorded_at } = request.body;

    const sensorInfo = await prisma.sensor.findUnique({
      where: {
        friendly_name
      }
    });

    if (!sensorInfo) {
      return reply.code(404).send({
        message: 'Sensor not found'
      });
    }

    const sensorHistory = await prisma.sensorHistory.create({
      data: {
        sensor: {
          connect: {
            friendly_name
          }
        },
        state,
        recorded_at: new Date(recorded_at)
      }
    });

    return reply.status(201).send({ sensorHistory });
  });

  fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteSensorHistorySchema }, async function (request, reply) {
    const { history_ids } = request.body;
    const sensorHistories = await prisma.sensorHistory.deleteMany({
      where: {
        id: {
          in: history_ids
        }
      }
    });

    return reply.send({ sensorHistories });
  });
};