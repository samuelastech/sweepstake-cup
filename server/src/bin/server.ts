import Fastify from 'fastify'

async function bootstrap(){
    /**
     * Setting the logs to monitor the server
     */
    const fastify = Fastify({
        logger: true,
    })

    fastify.get('/pools', () => {
        return { count: 0 }
    })

    /**
     * Starting th server
     */
    await fastify.listen({ port: 3000 })
}

bootstrap()