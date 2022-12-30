import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async (request, reply) => {
        const guesses = await prisma.guess.count()

        reply
            .code(200)
            .send({
                status: true,
                guesses
            })
    })
}

export default guessRoutes