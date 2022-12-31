import { FastifyReply, FastifyRequest } from 'fastify'

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()
}

export default authenticate