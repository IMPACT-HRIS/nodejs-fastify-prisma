/* eslint-disable global-require */
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import changePassword from '~/routes/authen/changePassword'
import isLoggedIn from '~/routes/authen/isLoggedIn'
import login from '~/routes/authen/login'
import logout from '~/routes/authen/logout'
import register from '~/routes/authen/register'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(changePassword)
  app.register(isLoggedIn)
  app.register(login)
  app.register(logout)
  app.register(register)

  done()
}
