import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'foo@gmail.com',
            avatarUrl: 'https://github.com/samuelastech.png'
        }
    })

    const sweepstake = await prisma.sweepstake.create({
        data: {
            title: 'Example Sweepstake',
            code: 'FOODOO',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-12-29T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'DE'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-12-30T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 5,
                    secondTeamPoints: 0,

                    participant: {
                        connect: {
                            userId_sweepstakeId: {
                                userId: user.id,
                                sweepstakeId: sweepstake.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()