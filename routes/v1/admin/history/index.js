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
    try {
      const { friendly_name, state, recorded_at } = request.body;

      const sensorInfo = await prisma.sensor.findUnique({
        where: { friendly_name },
        select: {
          id: true,
          Room: { select: { id: true } }
        }
      });

      if (!sensorInfo) {
        return reply.code(404).send({ message: 'Sensor not found' });
      }

      const sensorHistory = await prisma.sensorHistory.create({
        data: {
          sensor: { connect: { id: sensorInfo.id } },
          state,
          recorded_at: recorded_at ? new Date(recorded_at) : new Date(),
        }
      });


      if (state >= 800) {
        const subs = await prisma.subscription.findMany({
          where: { room: { id: sensorInfo.Room.id } },
          select: { user: { select: { email: true } } },
          take: 2
        });

        const emails = subs.map(sub => sub.user.email);

        let htmlMessage;
        if (state === 800) {
          htmlMessage = `
            <div style="background:#f6f8fa;padding:32px 0;">
              <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.07);overflow:hidden;">
                <tr>
                  <td style="padding:32px 32px 16px 32px;">
                    <h1 style="margin:0 0 16px 0;font-size:1.6em;color:#1976d2;font-family:Arial,sans-serif;">Alerte Qualité de l'air</h1>
                    <p style="margin:0 0 16px 0;font-size:1.1em;color:#222;font-family:Arial,sans-serif;">
                      Bonjour,<br><br>
                      <b>Le niveau de CO<sub>2</sub> a atteint 800 ppm</b> dans la pièce concernée.<br>
                      <span style="color:#388e3c;font-weight:bold;">Merci d’ouvrir les fenêtres pour améliorer la qualité de l’air.</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <div style="border-top:1px solid #eee;margin:24px 0;"></div>
                    <p style="margin:0;font-size:1em;color:#555;font-family:Arial,sans-serif;">
                      Restant à votre disposition pour toute question.<br>
                      Cordialement,<br>
                      <span style="font-weight:bold;">L’équipe Capteurs Air</span>
                    </p>
                    <p style="margin:24px 0 0 0;font-size:0.9em;color:#aaa;font-family:Arial,sans-serif;">
                      Service Automatisé – Ne pas répondre à ce message.<br>
                      <span style="font-size:0.95em;">Ce message vous a été envoyé automatiquement par le système de surveillance de la qualité de l’air.</span>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `;
        } else if (state > 1200) {
          htmlMessage = `
            <div style="background:#f6f8fa;padding:32px 0;">
              <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.07);overflow:hidden;">
                <tr>
                  <td style="padding:32px 32px 16px 32px;">
                    <h1 style="margin:0 0 16px 0;font-size:1.6em;color:#d32f2f;font-family:Arial,sans-serif;">Alerte Critique CO<sub>2</sub></h1>
                    <p style="margin:0 0 16px 0;font-size:1.1em;color:#222;font-family:Arial,sans-serif;">
                      Bonjour,<br><br>
                      <b>Le niveau de CO<sub>2</sub> a dépassé ${state} ppm</b> dans la pièce surveillée.<br>
                      <span style="color:#d32f2f;font-weight:bold;">Veuillez ouvrir immédiatement les fenêtres et quitter la pièce pour garantir votre sécurité.</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <div style="border-top:1px solid #eee;margin:24px 0;"></div>
                    <p style="margin:0;font-size:1em;color:#555;font-family:Arial,sans-serif;">
                      Merci de votre compréhension et de votre réactivité.<br>
                      Cordialement,<br>
                      <span style="font-weight:bold;">L’équipe Capteurs Air</span>
                    </p>
                    <p style="margin:24px 0 0 0;font-size:0.9em;color:#aaa;font-family:Arial,sans-serif;">
                      Service Automatisé – Ne pas répondre à ce message.<br>
                      <span style="font-size:0.95em;">Ce message vous a été envoyé automatiquement par le système de surveillance de la qualité de l’air.</span>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `;
        }
        
        if (htmlMessage && emails.length > 0) {
          try {
            await fastify.resend.emails.send({
              from: 'onboarding@resend.dev',
              to: emails,
              subject: 'Alerte CO2',
              html: htmlMessage
            });
          } catch (mailError) {
            request.log.error(mailError);
          }
        }
      }

      return reply.status(201).send({
        message: 'Sensor history created',
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
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