import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/users/count', async (request, reply) => {
        const users = await prisma.user.count()

        reply
            .code(200)
            .send({
                status: true,
                users
            })
    })
}

export default userRoutes