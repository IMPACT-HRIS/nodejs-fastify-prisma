import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const main = async () => {
  const jesusUser = await prisma.user.findUnique({
    where: {
      username: 'JESAS',
    },
  })
  if (!jesusUser) {
    await prisma.user.create({
      data: {
        username: 'JESAS',
        password: await argon2.hash('12345678'),
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
