import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { MAX_FILE_SIZE_IMAGE } from '~/config/maxFileSize'
import { MIME_TYPE_IMAGE_SET } from '~/config/mimeType'
import {
  createPostController,
  deleteUniquePostController,
  findManyPostsController,
  findUniquePostController,
  updateUniquePostController,
} from '~/modules/posts/post.controller'
import {
  createUniquePostSchema,
  deleteUniquePostSchema,
  findManyPostsSchema,
  findUniquePostSchema,
  updateUniquePostSchema,
} from '~/modules/posts/post.schema'
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
  app.post<InferZodFastifySchema<typeof createUniquePostSchema>>(
    '/posts',
    {
      schema: createUniquePostSchema,
      preValidation: [requireAdmin],
    },
    createPostController,
  )

  app.get<InferZodFastifySchema<typeof findManyPostsSchema>>(
    '/posts',
    {
      schema: findManyPostsSchema,
      preValidation: [requireAdmin],
    },
    findManyPostsController,
  )

  app.get<InferZodFastifySchema<typeof findUniquePostSchema>>(
    '/posts/:postId',
    {
      schema: findUniquePostSchema,
      preValidation: [requireAdmin],
    },
    findUniquePostController,
  )

  app.delete<InferZodFastifySchema<typeof deleteUniquePostSchema>>(
    '/posts/:postId',
    {
      schema: deleteUniquePostSchema,
      preValidation: [requireAdmin],
    },
    deleteUniquePostController,
  )

  app.patch<InferZodFastifySchema<typeof updateUniquePostSchema>>(
    '/posts/:postId',
    {
      schema: updateUniquePostSchema,
      preValidation: [requireAdmin],
    },
    updateUniquePostController,
  )

  done()
}
