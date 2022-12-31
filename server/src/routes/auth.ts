import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

import * as z from 'zod'
import authenticate from '../plugins/authenticate'

async function authRoutes(fastify: FastifyInstance) {
    fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
        return { user: request.user }
    })

    fastify.post('/users', async (request, reply) => {
        try {
            /**
             * Validations
             */
            const createUserBody = z.object({
                access_token: z.string()
            })

            const userInfoSchema = z.object({
                id: z.string(),
                email: z.string().email(),
                name: z.string(),
                picture: z.string().url()
            })
            
            /**
             * Fetching user's from Google with the access token
             */
            const { access_token } = createUserBody.parse(request.body)
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            const userData = await userResponse.json()
            const userInfo = userInfoSchema.parse(userData)

            /**
             * Verifying if the user already exists
             */
            let user = await prisma.user.findUnique({
                where: {
                    googleId: userInfo.id
                }
            })
            
            /**
             * New user
             */
            if(!user) {
                user = await prisma.user.create({
                    data: {
                        googleId: userInfo.id,
                        name: userInfo.name,
                        email: userInfo.email,
                        avatarUrl: userInfo.picture
                    }
                })
            }

            /**
             * Generate a token
             */
            const token = fastify.jwt.sign({
                name: user.name,
                avatarUrl: user.avatarUrl
            }, {
                sub: user.id,
                expiresIn: '15 min',
            })

            return { token }

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

export default authRoutes