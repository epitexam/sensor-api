const fp = require('fastify-plugin')
const { Resend } = require('resend')
const { RESEND_API_KEY } = process.env


module.exports = fp(async function (fastify, opts) {

    const resend = new Resend(RESEND_API_KEY)    

    fastify.decorate('resend', resend)
})
