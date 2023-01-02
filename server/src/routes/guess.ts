import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import authenticate from '../plugins/authenticate'

import * as z from 'zod'
import ErrorCustom from '../utils/ErrorCustom'

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

    fastify.post('/sweepstakes/:sweepstakeId/games/:gameId/guesses',
    { onRequest: [authenticate] }, async (request, reply) => {
        /**
         * Request Validations
         */
        const createGuessParams = z.object({
            sweepstakeId: z.string(),
            gameId: z.string()
        })

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number()
        })

        const { sweepstakeId, gameId } = createGuessParams.parse(request.params)
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

        try {
            /**
             * User are not in the sweepstake
             */
            const participant = await prisma.participant.findUnique({
                where: {
                    userId_sweepstakeId: {
                        sweepstakeId,
                        userId: request.user.sub
                    }
                }
            })
    
            if(!participant)
                throw new ErrorCustom("You're not allowed to create a guess inside this sweepstake", 401)
            
            /**
             * User already created a guess
             */
            const guess = await prisma.guess.findUnique({
                where: {
                    participantId_gameId: {
                        participantId: participant.id,
                        gameId: gameId
                    }
                }
            })

            if(guess)
                throw new ErrorCustom("You already created a guess in this sweepstake", 401)

            /**
             * Does the game exist?
             */
            const game = await prisma.game.findUnique({
                where: { id: gameId }
            })
            
            if(!game)
                throw new ErrorCustom('Game not found', 404)

            /**
             * Has the game passed?
             */
            if (game.date < new Date())
                throw new ErrorCustom('You cannot send a guess to a finished game', 401)

            /**
             * Everything is fine
             */
            await prisma.guess.create({
                data: {
                    firstTeamPoints,
                    secondTeamPoints,
                    gameId,
                    participantId: participant.id
                }
            })

            return reply.status(201).send({
                status: true
            })
        } catch (error) {
            if (error instanceof ErrorCustom){
                return reply.status(error.code).send({
                    status: false,
                    message: error.message
                })
            }
        }
    })
}

export default guessRoutes