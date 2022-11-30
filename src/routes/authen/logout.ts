import { FastifyError, FastifyInstance, RegisterOptions } from 'fastify'
import { ENV_SESSION_COOKIE_PATH } from '~/config/env'
import { SESSION_COOKIE_NAME } from '~/config/session'

export default (app: FastifyInstance, opts: RegisterOptions, done: (err?: FastifyError) => void) => {
  app.post('/authen/logout', (request, reply) => {
    request.session.destroy(() => {
      reply.setCookie(SESSION_COOKIE_NAME, '', { maxAge: -1, path: ENV_SESSION_COOKIE_PATH })
      reply.send()
    })
  })

  done()
}
