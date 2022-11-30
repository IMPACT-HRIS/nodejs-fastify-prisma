import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.post('/authen/logout', (request, reply) => {
    request.session.destroy(() => {
      reply.send()
    })
  })

  done()
}
