import sanitizeHtml from 'sanitize-html'
import { z, ZodType } from 'zod'
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_HTML,
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_TITLE,
  MAX_LENGTH_USERNAME,
  MAX_LENGTH_UUID,
} from '~/config/maxLength'
import { MIN_LENGTH_PASSWORD } from '~/config/minLength'
import { REGEX_INT, REGEX_NONNEGATIVE_INT, REGEX_PASSWORD, REGEX_TIME, REGEX_TIME_STAMP } from '~/config/regex'
import { SANITIZE_HTML_OPTION_RICHTEXT_EDITOR } from '~/config/sanitizeHtmlOption'
import { validateDate, validatePhone } from '~/utils/methods/common/validator'

type ZodFastifySchema = {
  body?: ZodType<unknown>
  querystring?: ZodType<unknown>
  params?: ZodType<unknown>
  headers?: ZodType<unknown>
  response?: ZodType<unknown>
}
type InferOrUndefined<T extends ZodType<unknown> | undefined> = T extends ZodType<unknown> ? z.infer<T> : undefined
export const createZodFastifySchema = <Schema extends ZodFastifySchema>(schema: Schema) => schema
export type InferZodFastifySchema<Schema extends ZodFastifySchema> = {
  Params: InferOrUndefined<Schema['params']>
  Querystring: InferOrUndefined<Schema['querystring']>
  Body: InferOrUndefined<Schema['body']>
}

// Common
export const uuidSchema = z.string().min(1).max(MAX_LENGTH_UUID)
export const usernameSchema = z.string().min(1).max(MAX_LENGTH_USERNAME)
export const passwordSchema = z
  .string()
  .min(MIN_LENGTH_PASSWORD)
  .max(MAX_LENGTH_PASSWORD)
  .regex(REGEX_PASSWORD, 'Must contain at least 1 lowercase letter, 1 uppercase letter, 1 number')
export const loosePasswordSchema = z.string().min(1).max(MAX_LENGTH_PASSWORD)
export const emailSchema = z.string().email().max(MAX_LENGTH_EMAIL)
export const titleSchema = z.string().min(1).max(MAX_LENGTH_TITLE)
export const dateSchema = z.string().refine(validateDate, 'Invalid Date')
export const timeSchema = z.string().regex(REGEX_TIME, 'Invalid Time')
export const timeStampSchema = z.string().regex(REGEX_TIME_STAMP, 'Invalid Time Stamp')
export const searchSchema = z.string().min(1)
export const skipSchema = z
  .string()
  .regex(REGEX_NONNEGATIVE_INT, 'Value should be non-negative integer')
  .transform((val) => Number.parseInt(val, 10))
export const takeSchema = z
  .string()
  .regex(REGEX_INT, 'Value should be integer')
  .transform((val) => Number.parseInt(val, 10))
export const fileSchema = z.object({
  filename: z.string(),
  filepath: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
})
export const fileOptionalSchema = z.union([fileSchema, z.literal('')])
export const tinyIntSchema = z.enum(['0', '1']).transform((val) => val === '1')
export const htmlSchema = z
  .string()
  .max(MAX_LENGTH_HTML)
  .transform((val) => sanitizeHtml(val, SANITIZE_HTML_OPTION_RICHTEXT_EDITOR))

export const phoneNumberSchema = z.string().refine(validatePhone, 'Invalid phone Number')
export const defaultStringSchema = z.string()
