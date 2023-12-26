import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

const main = async () => {
  // Seed 50 users
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        userId: uuidv4(),
        username: `user_${i}`,
        password: `password_${i}`,
        firstName: `First_${i}`,
        lastName: `Last_${i}`,
        email: `user${i}@example.com`,
        imgUrl: `https://example.com/image${i}.jpg`,
        phoneNumber: `123-456-${i.toString().padStart(2, '0')}`,
      },
    })

    // Seed a student for each user
    await prisma.student.create({
      data: {
        studentId: uuidv4(),
        userId: user.userId,
        studentNo: `S${i.toString().padStart(3, '0')}`,
        startDate: new Date(),
        endDate: new Date(),
        attendCount: 0,
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
