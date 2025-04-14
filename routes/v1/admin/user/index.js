'use strict';
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const { getUserSchema, updateUserSchema, deleteUserSchema } = require('../../../../schemas/admin/user');

module.exports = async function (fastify, opts) {
  /** 
   * @type {PrismaClient} 
   */
  const prisma = fastify.prisma;

  const selectedUserInfo = {
    id: true,
    email: true,
    username: true,
    first_name: true,
    last_name: true,
  };

  fastify.get('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: getUserSchema }, async function (request, reply) {
    const { user_id, username, take = 20, skip = 0 } = request.query;

    if (user_id) {
      const userInfo = await prisma.user.findUnique({
        where: {
          username,
        },
        select: selectedUserInfo,
      });

      if (!userInfo) {
        return reply.status(404).send({ message: "No user founded." });
      }

      return reply.status(200).send(userInfo);
    }

    const usersInfo = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      take,
      skip,
    });

    return reply.status(200).send({ usersInfo });
  });

  fastify.put('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: updateUserSchema }, async function (request, reply) {
    const { user_id, username, email, first_name, last_name, password } = request.body;

    const userInfo = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: selectedUserInfo,
    });

    if (!userInfo) {
      return reply.status(404).send({ message: "No user founded." });
    }

    if (email && email !== userInfo.email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        return reply.status(400).send({ message: "Email already used." });
      }
    }

    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        username: username || userInfo.username,
        email: email || userInfo.email,
        first_name: first_name || userInfo.first_name,
        last_name: last_name || userInfo.last_name,
        password: password ? await argon2.hash(password) : userInfo.password,
      },
      select: selectedUserInfo,
    });

    return reply.status(204).send({ message: "User updated" });
  });

  fastify.delete('/', { onRequest: [fastify.authenticate, fastify.isAdmin], schema: deleteUserSchema }, async function (request, reply) {
    const { user_id } = request.body;

    const userInfo = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: selectedUserInfo,
    });

    if (!userInfo) {
      return reply.status(404).send({ message: "No user founded." });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: user_id,
      },
      select: selectedUserInfo,
    });

    return reply.status(204).send({ message: "User deleted" });
  });
};
