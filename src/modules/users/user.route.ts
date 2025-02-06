import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { MAX_FILE_SIZE_IMAGE } from '~/config/maxFileSize'
import { MIME_TYPE_IMAGE_SET } from '~/config/mimeType'
import {
  createUserController,
  deleteUniqueUserController,
  findManyUsersController,
  findUniqueUserController,
  updateUniqueUserController,
} from '~/modules/users/user.controller'
import {
  createUniqueUserSchema,
  deleteUniqueUserSchema,
  findManyUsersSchema,
  findUniqueUserSchema,
  updateUniqueUserSchema,
} from '~/modules/users/user.schema'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'
import { multipartPlugin } from '~/utils/methods/fastify/fastifyPlugin'
import { requireAdmin } from '~/utils/middleware/preValidation'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(multipartPlugin, {
    limits: {
      fileSize: MAX_FILE_SIZE_IMAGE,
      files: 1,
    },
    acceptMimeTypeSet: MIME_TYPE_IMAGE_SET,
  })
  app.post<InferZodFastifySchema<typeof createUniqueUserSchema>>(
    '/users',
    {
      schema: createUniqueUserSchema,
      preValidation: [requireAdmin],
    },
    createUserController,
  )

  app.get<InferZodFastifySchema<typeof findManyUsersSchema>>(
    '/users',
    {
      schema: findManyUsersSchema,
      preValidation: [requireAdmin],
    },
    findManyUsersController,
  )

  app.get<InferZodFastifySchema<typeof findUniqueUserSchema>>(
    '/users/:userId',
    {
      schema: findUniqueUserSchema,
      preValidation: [requireAdmin],
    },
    findUniqueUserController,
  )

  app.delete<InferZodFastifySchema<typeof deleteUniqueUserSchema>>(
    '/users/:userId',
    {
      schema: deleteUniqueUserSchema,
      preValidation: [requireAdmin],
    },
    deleteUniqueUserController,
  )

  app.patch<InferZodFastifySchema<typeof updateUniqueUserSchema>>(
    '/users/:userId',
    {
      schema: updateUniqueUserSchema,
      preValidation: [requireAdmin],
    },
    updateUniqueUserController,
  )

  done()
}
