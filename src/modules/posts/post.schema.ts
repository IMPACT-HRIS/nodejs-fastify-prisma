import { z } from 'zod'
import {
  createZodFastifySchema,
  defaultStringSchema,
  fileSchema,
  skipSchema,
  takeSchema,
  uuidSchema,
} from '~/utils/methods/common/zodSchema'

export const createUniquePostSchema = createZodFastifySchema({
  body: z.object({
    title: defaultStringSchema,
    img: fileSchema,
  }),
})

export const updateUniquePostSchema = createZodFastifySchema({
  params: z.object({
    postId: uuidSchema,
  }),
  body: z.object({
    title: defaultStringSchema.optional(),
    img: fileSchema.optional(),
  }),
})

export const deleteUniquePostSchema = createZodFastifySchema({
  params: z.object({
    postId: uuidSchema,
  }),
})

export const findManyPostsSchema = createZodFastifySchema({
  querystring: z.object({
    skip: skipSchema.optional(),
    take: takeSchema.optional(),
    title: defaultStringSchema.optional(),
  }),
})

export const findUniquePostSchema = createZodFastifySchema({
  params: z.object({
    postId: uuidSchema,
  }),
})
