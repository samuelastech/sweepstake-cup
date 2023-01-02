import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import * as z from 'zod'

import authenticate from '../plugins/authenticate'

async function gameRoutes(fastify: FastifyInstance) {
    fastify.get('/sweepstakes/:id/games', { onRequest: [authenticate] }, async (request, reply) => {
        const getGameParams = z.object({
            id: z.string()
        })

        const { id } = getGameParams.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc'
            },
            
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: request.user.sub,
                            sweepstakeId: id
                        }
                    }
                }
            }
        })

        reply.send({
            status: true,
            games: games.map(game => ({
                ...game,
                guess: game.guesses.length > 0 ? game.guesses[0] : null,
                guesses: undefined
            }))
        })
    })
}

export default gameRoutes