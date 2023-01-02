import '@fastify/jwt'

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            sub: string,
            avatarUrl: string,
            name: string
        }
    }
}