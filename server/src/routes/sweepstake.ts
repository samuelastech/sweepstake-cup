import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

import * as z from 'zod'
import ShortUniqueId from 'short-unique-id'

import authenticate from '../plugins/authenticate'

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

            // When authenticated
            try {
                await request.jwtVerify()

                await prisma.sweepstake.create({
                    data: {
                        title,
                        code,
                        ownerId: request.user.sub,

                        participants: {
                            create: {
                                userId: request.user.sub
                            }
                        }
                    }
                })
            }
            
            // When not authenticated
            catch (error) {
                await prisma.sweepstake.create({
                    data: {
                        title,
                        code
                    }
                })
            }

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

    fastify.post('/sweepstakes/join', { onRequest: [authenticate] }, async (request, reply) => {
        const joinPoolBody = z.object({
            code: z.string()
        })

        const { code } = joinPoolBody.parse(request.body)

        try {
            const sweepstake = await prisma.sweepstake.findUnique({
                where: { code },
                include: { 
                    participants: {
                        where: {
                            userId: request.user.sub
                        }
                    }
                }
            })

            if(!sweepstake)
                throw new Error('Pool not found')

            if(sweepstake.participants.length > 0)
                throw new Error('You already joined this sweepstake')
            
            if(!sweepstake.ownerId){
                await prisma.sweepstake.update({
                    where: { 
                        id: sweepstake.id
                    },

                    data: {
                        ownerId: request.user.sub
                    }
                })
            }
            
            // Everything's fine
            await prisma.participant.create({
                data: {
                    sweepstakeId: sweepstake.id,
                    userId: request.user.sub
                }
            })

            return reply.status(201).send({
                status: true,
                message: 'User joined the sweepstake'
            })

        } catch (error) {
            if(error instanceof Error && error.message === 'Pool not found'){
                return reply.code(404).send({
                    status: false,
                    message: error.message
                })
            }

            if(error instanceof Error && error.message === 'You already joined this sweepstake'){
                return reply.code(400).send({
                    status: false,
                    message: error.message
                })
            }
        }
    })

    fastify.get('/sweepstakes', { onRequest: [authenticate] }, async (request, reply) => {
        const sweepstake = await prisma.sweepstake.findMany({
            where: {
                participants: {
                    some: {
                        userId: request.user.sub
                    }
                }
            },

            include: {
                _count: {
                    select: { 
                        participants: true,
                    }
                },

                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4,
                },

                owner: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return reply.send({
            status: true,
            sweepstakes: sweepstake
        })
    })

    fastify.get('/sweepstakes/:id', { onRequest: [authenticate] }, async (request, reply) => {
        const getSweepstakeParams = z.object({
            id: z.string()
        })

        const { id } = getSweepstakeParams.parse(request.params)

        const sweepstake = await prisma.sweepstake.findFirst({
            include: {
                _count: {
                    select: { 
                        participants: true,
                    }
                },

                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4,
                },

                owner: {
                    select: {
                        name: true
                    }
                }
            },
            
            where: {
                id,
                participants: {
                    some: {
                        userId: request.user.sub
                    }
                }
            },
        })

        return reply.send({
            status: true,
            sweepstakes: sweepstake
        })
    })
}

export default sweepstakeRoutes