/* eslint-disable global-require */
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import authen from '~/routes/authen/_index'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(authen)

  done()
}
