import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { z } from 'zod'
import prisma from '~/database/prisma'
import { createZodFastifySchema, InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

const schema = createZodFastifySchema({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    gender: z.enum(['MALE', 'FEMALE']),
  }),
})

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.post<InferZodFastifySchema<typeof schema>>(
    '/students',
    {
      schema,
    },
    async (request, reply) => {
      const body = request.body
      await prisma.student.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
        },
      })
      return reply.send({
        success: true,
      })
    },
  )

  done()
}
