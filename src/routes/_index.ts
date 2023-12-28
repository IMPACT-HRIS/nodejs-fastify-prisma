/* eslint-disable global-require */
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import authen from '~/routes/authen/_index'
import students from '~/routes/students/_index'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(authen)
  app.register(students)

  done()
}
