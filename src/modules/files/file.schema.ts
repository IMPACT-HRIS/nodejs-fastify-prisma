import { z } from 'zod'
import { createZodFastifySchema } from '~/utils/methods/common/zodSchema'

export const downloadFileSchema = createZodFastifySchema({
  params: z.object({
    '*': z.string(),
  }),
})
