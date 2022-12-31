import Fastify from 'fastify'
import cors from '@fastify/cors'
import env from '@fastify/env'
import jwt from '@fastify/jwt'

import sweepstakeRoutes from '../routes/sweepstake'
import guessRoutes from '../routes/guess'
import userRoutes from '../routes/user'
import gameRoutes from '../routes/game'
import authRoutes from '../routes/auth'

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    const envSchema = {
        type: 'object',
        required: ['PORT'],
        properties: {
            PORT: {
                type: 'string',
                default: 3000
            }
        }
    }

    const options = {
        schema: envSchema,
        dotenv: true,
        data: process.env
    }

    fastify.register(env, options)
    await fastify.after()

    await fastify.register(cors, {
        origin: true,
    })

    await fastify.register(jwt, {
        secret: process.env.SECRET
    })

    await fastify.register(sweepstakeRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(authRoutes)
    await fastify.register(userRoutes)

    /**
     * Starting th server
     */
    await fastify.listen({ port: process.env.PORT, host: '0.0.0.0' })
}

bootstrap()