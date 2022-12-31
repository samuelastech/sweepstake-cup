import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

import * as z from 'zod'

async function authRoutes(fastify: FastifyInstance) {
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
             * Fetching user's access token from Google
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
            return { userInfo }
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