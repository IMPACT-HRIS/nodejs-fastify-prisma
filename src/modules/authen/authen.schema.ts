import { z } from 'zod'
import {
  createZodFastifySchema,
  defaultStringSchema,
  loosePasswordSchema,
  usernameSchema,
} from '~/utils/methods/common/zodSchema'

export const renewPasswordSchema = createZodFastifySchema({
  body: z.object({
    password: loosePasswordSchema,
  }),
})

export const changePasswordSchema = createZodFastifySchema({
  querystring: z.object({
    token: defaultStringSchema.optional(),
  }),
  body: z.object({
    username: usernameSchema.optional(),
    password: loosePasswordSchema,
    confirmPassword: loosePasswordSchema,
  }),
})

export const loginSchema = createZodFastifySchema({
  body: z.object({
    username: usernameSchema,
    password: loosePasswordSchema,
  }),
})

export const registerSchema = createZodFastifySchema({
  body: z.object({
    username: usernameSchema,
    password: loosePasswordSchema,
  }),
})

export const verifyEmailSchema = createZodFastifySchema({
  querystring: z.object({
    token: defaultStringSchema,
  }),
})

export const forgetPasswordSchema = createZodFastifySchema({
  body: z.object({
    username: defaultStringSchema,
  }),
})
