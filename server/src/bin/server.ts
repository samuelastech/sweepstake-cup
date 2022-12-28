import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as z from 'zod'
import ShortUniqueId from 'short-unique-id'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query']
})

async function bootstrap(){
    /**
     * Setting the logs to monitor the server
     */
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    fastify.get('/pools/count', async (request, reply) => {
        const pools = await prisma.pool.count()

        reply
            .code(200)
            .send({
                status: true,
                pools
            })
    })

    fastify.get('/users/count', async (request, reply) => {
        const user = await prisma.user.count()

        reply
            .code(200)
            .send({
                status: true,
                user
            })
    })

    fastify.get('/guesses/count', async (request, reply) => {
        const guesses = await prisma.guess.count()

        reply
            .code(200)
            .send({
                status: true,
                guesses
            })
    })

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string()
        })

        try {
            const { title } = createPoolBody.parse(request.body)
            const generate = new ShortUniqueId({ length: 6 })
            const code = String(generate()).toUpperCase()

            await prisma.pool.create({
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

    /**
     * Starting th server
     */
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()