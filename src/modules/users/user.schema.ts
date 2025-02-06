import { z } from 'zod'
import {
  createZodFastifySchema,
  defaultStringSchema,
  fileOptionalSchema,
  loosePasswordSchema,
  skipSchema,
  takeSchema,
  uuidSchema,
} from '~/utils/methods/common/zodSchema'

export const createUniqueUserSchema = createZodFastifySchema({
  body: z.object({
    firstName: defaultStringSchema.optional(),
    lastName: defaultStringSchema.optional(),
    username: defaultStringSchema,
    password: loosePasswordSchema,
    img: fileOptionalSchema.optional(),
  }),
})

export const updateUniqueUserSchema = createZodFastifySchema({
  params: z.object({
    userId: uuidSchema,
  }),
  body: z.object({
    firstName: defaultStringSchema.optional(),
    lastName: defaultStringSchema.optional(),
    img: fileOptionalSchema.optional(),
    password: loosePasswordSchema.optional(),
  }),
})

export const deleteUniqueUserSchema = createZodFastifySchema({
  params: z.object({
    userId: uuidSchema,
  }),
})

export const findManyUsersSchema = createZodFastifySchema({
  querystring: z.object({
    skip: skipSchema.optional(),
    take: takeSchema.optional(),
    role: defaultStringSchema.optional(),
    search: defaultStringSchema.optional(),
  }),
})

export const lookupManyUsersSchema = createZodFastifySchema({
  querystring: z.object({
    search: defaultStringSchema.optional(),
  }),
})

export const findUniqueUserSchema = createZodFastifySchema({
  params: z.object({
    userId: uuidSchema,
  }),
})
