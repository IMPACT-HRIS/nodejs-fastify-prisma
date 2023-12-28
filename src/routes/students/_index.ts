/* eslint-disable global-require */
import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import createStudent from '~/routes/students/createStudent'
import getStudents from '~/routes/students/getStudents'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.register(getStudents)
  app.register(createStudent)

  done()
}
