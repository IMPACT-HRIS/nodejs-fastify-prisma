import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { z } from 'zod'
import {
  createZodFastifySchema,
  InferZodFastifySchema,
  loosePasswordSchema,
  passwordSchema,
} from '~/utils/methods/common/zodSchema'

const schema = createZodFastifySchema({
  body: z.object({
    oldPassword: loosePasswordSchema,
    newPassword: passwordSchema,
  }),
})

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.put<InferZodFastifySchema<typeof schema>>(
    '/authen/change-password',
    {
      schema,
    },
    async (request, reply) => {
      return reply.send()
    },
  )

  done()
}
