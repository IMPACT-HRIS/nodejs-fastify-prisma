/* eslint-disable global-require */
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import authenRoute from '~/modules/authen/authen.route'
import fileRoute from '~/modules/files/file.route'
import userRoute from '~/modules/users/user.route'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(authenRoute)
  app.register(fileRoute)
  app.register(userRoute)

  done()
}
