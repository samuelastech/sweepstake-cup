import Fastify from 'fastify'
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

    fastify.get('/pools/count', async (request, reply) => {
        const pools = await prisma.pool.count()

        reply
            .code(200)
            .send({
                status: true,
                pools
            })
    })

    /**
     * Starting th server
     */
    await fastify.listen({ port: 3333 })
}

bootstrap()