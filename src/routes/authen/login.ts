import argon2 from 'argon2'
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { z } from 'zod'
import { UnauthenticatedError } from '~/class/Error'
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
    '/authen/login',
    {
      schema,
    },
    async (request, reply) => {
      const foundUser = await prisma.user.findUnique({
        where: { username: request.body.username },
        select: {
          user_id: true,
          password: true,
          img_url: true,
        },
      })

      if (!foundUser) throw new UnauthenticatedError('Invalid username or password')

      const isValidPassword = await argon2.verify(foundUser.password, request.body.password)
      if (!isValidPassword) throw new UnauthenticatedError('Invalid username or password')

      request.session.user = {
        userId: foundUser?.user_id,
        isLoggedIn: true,
        imgUrl: foundUser?.img_url,
      }

      return reply.send()
    },
  )

  done()
}
