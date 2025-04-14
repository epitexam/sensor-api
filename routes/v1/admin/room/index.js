'use strict';

const { PrismaClient } = require('@prisma/client');
const { getRoomSchema, createRoomSchema, updateRoomSchema, deleteRoomSchema } = require('../../../../schemas/admin/room');

module.exports = async function (fastify, opts) {
  /** 
   * @type {PrismaClient} 
   */
  const prisma = fastify.prisma;

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
  };

  fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getRoomSchema }, async function (request, reply) {
    const { room_id, name, take = 30, skip = 0 } = request.query;

    if (take > 100) {
      return reply.code(400).send({ message: 'Take parameter too large' });
    }

    if (room_id) {
      const room = await prisma.room.findUnique({
        where: {
          id: room_id
        },
        select: selectedRoomInfo
      });

      if (!room) {
        return reply.code(404).send({
          message: 'Room not found'
        });
      }

      return reply.send(room);
    }

    if (name) {
      const room = await prisma.room.findUnique({
        where: {
          name
        },
        select: selectedRoomInfo
      });

      if (!room) {
        return reply.code(404).send({
          message: 'Room not found'
        });
      }

      return reply.send(room);
    }

    const rooms = await prisma.room.findMany({
      take,
      skip,
      select: selectedRoomInfo
    });

    return reply.send(rooms);
  });

  fastify.post('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: createRoomSchema }, async function (request, reply) {
    const { name, volume } = request.body;

    const existingRoom = await prisma.room.findUnique({
      where: {
        name
      }
    });

    if (existingRoom) {
      return reply.code(409).send({
        message: 'Room name already exists'
      });
    }

    const totalRooms = await prisma.room.count();

    const room = await prisma.room.create({
      data: {
        id: totalRooms + 1,
        name,
        volume
      }
    });

    return reply.code(201).send({ room });
  });

  fastify.put('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: updateRoomSchema }, async function (request, reply) {
    const { room_name, room_id, name, volume } = request.body;

    const roomInfo = await prisma.room.findUnique({
      where: {
        id: room_id,
        name: room_name
      }
    });

    if (!roomInfo) {
      return reply.code(404).send({
        message: 'Room not found'
      });
    }

    const room = await prisma.room.update({
      where: {
        id: room_id
      },
      data: {
        name,
        volume,
      }
    });

    return reply.status(204).send({});
  });

  fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteRoomSchema }, async function (request, reply) {
    const { room_id } = request.body;

    const roomInfo = await prisma.room.findUnique({
      where: {
        id: room_id
      }
    });

    if (!roomInfo) {
      return reply.code(404).send({
        message: 'Room not found'
      });
    }

    const deletedRoom = await prisma.room.delete({
      where: {
        id: room_id
      }
    });

    return reply.status(204).send({});
  });
};