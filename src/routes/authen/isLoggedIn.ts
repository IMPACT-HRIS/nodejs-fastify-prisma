import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.get('/authen/is-logged-in', async (request, reply) => {
    return reply.send({ isLoggedIn: Boolean(request.session.user), user: request.session.user })
  })

  done()
}
