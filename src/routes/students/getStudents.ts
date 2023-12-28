import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { z } from 'zod'
import prisma from '~/database/prisma'
import { createZodFastifySchema, InferZodFastifySchema, skipSchema, takeSchema } from '~/utils/methods/common/zodSchema'

const schema = createZodFastifySchema({
  querystring: z.object({
    skip: skipSchema.optional(),
    take: takeSchema.optional(),
  }),
})

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.get<InferZodFastifySchema<typeof schema>>(
    '/students',
    {
      schema,
    },
    async (request, reply) => {
      const { skip, take } = request.query
      const students = await prisma.student.findMany({
        skip,
        take,
        select: {
          firstName: true,
          lastName: true,
          school: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      })

      const courses = await prisma.course.findMany({
        select: {
          name: true,
          code: true,
          credit: true,
          courseTeacherStudent: {
            select: {
              teacher: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      })

      return reply.send({
        data: students.map((student) => {
          const displayName = `${student.firstName} ${student.lastName}`
          return { ...student, displayName }
        }),
      })
    },
  )

  done()
}
