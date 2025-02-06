import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { downloadFileController } from '~/modules/files/file.controller'
import { downloadFileSchema } from '~/modules/files/file.schema'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app
    .get<InferZodFastifySchema<typeof downloadFileSchema>>(
      '/download/*',
      {
        schema: downloadFileSchema,
      },
      downloadFileController,
    )
    .setErrorHandler(async (error, request, reply) => {
      if (error.name === 'NoSuchKey') return reply.status(404).send('Not found')

      request.log.error(error.message)
      return reply.status(500).send('Something went wrong')
    })

  done()
}
