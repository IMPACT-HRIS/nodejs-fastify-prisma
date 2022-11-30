import argon2 from 'argon2'
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { z } from 'zod'
import prisma from '~/database/prisma'
import {
  createZodFastifySchema,
  InferZodFastifySchema,
  loosePasswordSchema,
  usernameSchema,
} from '~/utils/methods/common/zodSchema'

const schema = createZodFastifySchema({
  body: z.object({
    username: usernameSchema,
    password: loosePasswordSchema,
  }),
})

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.post<InferZodFastifySchema<typeof schema>>(
    '/authen/register',
    {
      schema,
    },
    async (request, reply) => {
      // create user
      const { username, password } = request.body
      const foundUser = await prisma.user.findUnique({
        where: {
          username,
        },
      })
      if (foundUser) return reply.status(400).send({ error: 'User already registered' })
      const user = await prisma.$transaction(async (tx) => {
        return tx.user.create({
          data: {
            username,
            password: await argon2.hash(password),
          },
          select: {
            user_id: true,
          },
        })
      })

      return reply.send({ userId: user.user_id })
    },
  )

  done()
}
