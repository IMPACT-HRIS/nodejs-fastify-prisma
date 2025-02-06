import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import {
  isLoggedInController,
  loginController,
  logoutController,
  registerController,
} from '~/modules/authen/authen.controller'
import { loginSchema, registerSchema } from '~/modules/authen/authen.schema'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'
import { requireUser } from '~/utils/middleware/preValidation'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.get(
    '/authen/is-logged-in',
    {
      preValidation: [requireUser],
    },
    isLoggedInController,
  )

  app.post<InferZodFastifySchema<typeof loginSchema>>(
    '/authen/login',
    {
      schema: loginSchema,
    },
    loginController,
  )

  app.get('/authen/logout', logoutController)

  app.post<InferZodFastifySchema<typeof registerSchema>>(
    '/authen/register',
    {
      schema: registerSchema,
    },
    registerController,
  )

  done()
}
