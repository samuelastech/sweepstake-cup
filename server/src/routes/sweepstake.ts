import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

import * as z from 'zod'
import ShortUniqueId from 'short-unique-id'

async function sweepstakeRoutes(fastify: FastifyInstance) {
    fastify.get('/sweepstakes/count', async (request, reply) => {
        const sweepstakes = await prisma.sweepstake.count()

        reply
            .code(200)
            .send({
                status: true,
                sweepstakes
            })
    })

    fastify.post('/sweepstakes', async (request, reply) => {
        const createSweepstakeBody = z.object({
            title: z.string()
        })

        try {
            const { title } = createSweepstakeBody.parse(request.body)
            const generate = new ShortUniqueId({ length: 6 })
            const code = String(generate()).toUpperCase()

            await prisma.sweepstake.create({
                data: {
                    title,
                    code
                }
            })
    
            reply
                .code(201)
                .send({
                    status: true,
                    code
                })
        } catch (error) {
            if (error instanceof z.ZodError){
                reply
                    .code(400)
                    .send({
                        status: false,
                        message: error.issues[0].message,
                        invalidFields: error.issues[0].path[0]
                    })
            }
        }

    })
}

export default sweepstakeRoutes